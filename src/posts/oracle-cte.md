---
title: 'Oracle MERGE & WITH: 원격 데이터 동기화의 늪에서 벗어나기'
date: '2025-07-18 15:53'
tags: ['Oracle', 'SQL', 'DataBase']
---

최근 고객사의 요청으로 원격 DB의 데이터를 로컬 테이블과 동기화해야 하는 까다로운 작업을 진행했다. 단순히 테이블을 일치시키는 것이 아니라, 여러 테이블을 조합하는 복잡한 비즈니스 로직을 거친 결과 값만을 동기화해야 해서 쿼리는 상당히 길고 복잡해질 수밖에 없었다.

설상가상으로, 아키텍처 제약상 DB 링크(`@REMOTE_LINK`)를 통한 원격 조회가 필수적인 상황이었다. 이 과정에서 백엔드 개발자라면 한 번쯤 마주쳤을 법한 난관에 부딪혔다. `ORA-01417` 오류와 쿼리 성능 저하 문제였다.

이 포스팅에서는 CTE(`WITH`절)를 활용하여 이 문제를 어떻게 해결했는지, 그 경험을 공유하고자 한다.

> CTE: SQL에서 사용되는 **Common Table Expression (공통 테이블 표현식)** 의 약자

_(참고: 본문에 사용된 쿼리는 보안을 위해 실제 테이블과 컬럼명을 일반적인 예시로 변경했습니다.)_

## 복잡한 쿼리와 원격 조회

요구사항은 명확하다.

> 원격 DB에 있는 판매 주문(`SALES_ORDERS`)과 반품 기록(`RETURN_LOGS`)을 조합하고, 특정 상품 정보(`PROD_INFO`)로 필터링한 뒤, 고유한 순번(`RANK()`)을 매겨 로컬 테이블(`LOCAL_SALES_SUMMARY`)에 동기화.

`MERGE`문을 이용하기로 하고, `USING`절 안에서 서브쿼리로 이 문제를 해결하려 했을때, 곧바로 문제에 직면했다.

## ORA-01417 오류가 발생하던 원본 쿼리

인라인 뷰가 3~4단계로 중첩되어 있고, 그 안에 `UNION ALL`과 `ORA-01417` 오류를 유발하는 연쇄 조인까지 포함되어 있었다.

```sql
SELECT REPORT_TYPE, PRODUCT_CODE, TRANSACTION_SEQ
FROM (
    SELECT
        A.REPORT_TYPE,
        :productCode AS PRODUCT_CODE,
        RANK() OVER (PARTITION BY A.PRODUCT_ID ORDER BY A.TRANSACTION_DATE, ROWNUM) AS TRANSACTION_SEQ
    FROM (
        -- 데이터 소스 1 (판매) 과 데이터 소스 2 (반품) 를 UNION
        SELECT A.REPORT_TYPE, A.PRODUCT_ID, A.TRANSACTION_DATE
        FROM (
            -- 판매 데이터 조회
            SELECT A.REPORT_TYPE, A.PRODUCT_ID, A.ORDER_DATE AS TRANSACTION_DATE
            FROM   REMOTE_DB.SALES_ORDERS@REMOTE_LINK A
            WHERE  NVL(A.ORDER_TYPE, 'X') = 'A1'
              AND  A.PRODUCT_ID IN (SELECT PRODUCT_ID FROM REMOTE_DB.PROD_INFO@REMOTE_LINK WHERE COMPANY_ID||COMPANY_TYPE = :productCode AND REPORT_TYPE = :reportType)
              AND  A.REPORT_TYPE = :reportType
        ) A
        LEFT JOIN (
            -- ORA-01417 오류 발생 지점!
            SELECT A.REPORT_TYPE AS DTL_REPORT_TYPE, A.PRODUCT_ID AS DTL_PRODUCT_ID, A.ORDER_DATE AS DTL_ORDER_DATE
            FROM   REMOTE_DB.ORDER_DETAILS@REMOTE_LINK A
            LEFT JOIN REMOTE_DB.PROD_INFO@REMOTE_LINK B ON A.REPORT_TYPE = B.REPORT_TYPE AND A.PRODUCT_ID = B.PRODUCT_ID
            LEFT JOIN REMOTE_DB.CUSTOMER_MASTER@REMOTE_LINK C ON B.REPORT_TYPE=C.REPORT_TYPE AND B.COMPANY_ID||B.COMPANY_TYPE=C.COMPANY_ID||C.COMPANY_TYPE AND A.CUSTOMER_ID=C.CUSTOMER_ID
            WHERE  A.PRODUCT_ID IS NOT NULL AND B.PRODUCT_ID IS NOT NULL AND B.COMPANY_ID||B.COMPANY_TYPE = :productCode AND A.REPORT_TYPE = :reportType
            GROUP BY A.REPORT_TYPE, A.PRODUCT_ID, A.ORDER_DATE
        ) B ON A.REPORT_TYPE = B.DTL_REPORT_TYPE AND A.PRODUCT_ID = B.DTL_PRODUCT_ID AND A.TRANSACTION_DATE = B.DTL_ORDER_DATE
        UNION ALL
        -- 반품 데이터 조회
        SELECT A.REPORT_TYPE, B.PRODUCT_ID, A.RETURN_DATE AS TRANSACTION_DATE
        FROM   REMOTE_DB.RETURN_LOGS@REMOTE_LINK A
        LEFT JOIN REMOTE_DB.PROD_INFO@REMOTE_LINK B ON A.REPORT_TYPE = B.REPORT_TYPE AND A.COMPANY_ID||A.COMPANY_TYPE = B.COMPANY_ID||B.COMPANY_TYPE
        WHERE  A.COMPANY_ID||A.COMPANY_TYPE = :productCode AND A.REPORT_TYPE = :reportType
    ) A
)
```

> ORA-01417 : 하나의 테이블은 하나의 다른 테이블과 포괄 조인될 수 있습니다

이 쿼리의 문제점.

1. **ORA-01417 오류**: `ORDER_DETAILS`를 조회하는 서브쿼리 내의 **A LEFT JOIN B LEFT JOIN C** 구조가 에러를 발생시킨다.

2. **해독 불가**: 괄호가 너무 많아 어디서부터 어디까지가 하나의 논리 단위인지 파악하기가 어려움.

3. **디버깅의 어려움**: 데이터가 잘못 나올 경우, 이 복잡한 구조의 어느 부분에서 문제가 생겼는지 추적하는 것은 사실상 불가능.

## CTE(WITH 절)로 논리 분리하기

해결책은 **복잡한 원본 데이터 조회 과정을 논리적인 단계로 나누는 것**이다. CTE(WITH 절)는 바로 이럴 때 진가를 발휘한다. 흥미로운 점은, 쿼리를 분해하는 과정에서 `ORA-01417` 오류를 유발했던 복잡한 `LEFT JOIN` 부분이 최종 결과에 꼭 필요한 로직이 아니었다는 사실을 발견했다는 것이다. 이는 복잡한 쿼리를 리팩토링할 때 종종 얻게 되는 또 다른 이점이다.

다음과 같은 논리적 단계로 나누어 쿼리를 재구성했다.

1. `PRODUCT_FILTER`: 동기화의 기준이 될 **필터 조건(상품 정보)** 을 원격 테이블에서 먼저 조회

2. `SALES_DATA`: 필터링된 판매 주문 데이터를 가져옴

3. `RETURNS_DATA`: 필터링된 반품 기록 데이터를 가져옴

4. `COMBINED_TRANSACTIONS`: 판매와 반품 데이터를 하나로 합침

5. `RANKED_TRANSACTIONS`: 합쳐진 데이터에 RANK() 함수를 적용해 최종적으로 고유 순번을 부여

## 완성된 `MERGE` 쿼리

이렇게 재탄생한 최종 쿼리는 논리적으로 명확해졌을 뿐만 아니라, 불필요한 로직까지 제거되어 훨씬 더 효율적으로 동작하게 되었다.

```sql
MERGE INTO LOCAL_SALES_SUMMARY TGT
USING (
    -- 1. 기준이 되는 상품 정보 필터
    WITH PRODUCT_FILTER AS (
        SELECT PRODUCT_ID, COMPANY_ID, COMPANY_TYPE, REPORT_TYPE
        FROM REMOTE_DB.PROD_INFO@REMOTE_LINK
        WHERE COMPANY_ID || COMPANY_TYPE = :productCode AND REPORT_TYPE = :reportType
    ),
    -- 2. 판매 데이터 조회
    SALES_DATA AS (
        SELECT A.REPORT_TYPE, A.PRODUCT_ID, A.ORDER_DATE AS TRANSACTION_DATE
        FROM REMOTE_DB.SALES_ORDERS@REMOTE_LINK A
        WHERE NVL(A.ORDER_TYPE, 'X') = 'A1'
          AND A.REPORT_TYPE = :reportType
          AND A.PRODUCT_ID IN (SELECT PRODUCT_ID FROM PRODUCT_FILTER)
    ),
    -- 3. 반품 데이터 조회
    RETURNS_DATA AS (
        SELECT A.REPORT_TYPE, B.PRODUCT_ID, A.RETURN_DATE AS TRANSACTION_DATE
        FROM REMOTE_DB.RETURN_LOGS@REMOTE_LINK A
        JOIN PRODUCT_FILTER B
          ON A.REPORT_TYPE = B.REPORT_TYPE
         AND A.COMPANY_ID || A.COMPANY_TYPE = B.COMPANY_ID || B.COMPANY_TYPE
        WHERE A.REPORT_TYPE = :reportType
    ),
    -- 4. 두 데이터 통합
    COMBINED_TRANSACTIONS AS (
        SELECT REPORT_TYPE, PRODUCT_ID, TRANSACTION_DATE FROM SALES_DATA
        UNION ALL
        SELECT REPORT_TYPE, PRODUCT_ID, TRANSACTION_DATE FROM RETURNS_DATA
    ),
    -- 5. 최종 데이터 가공
    RANKED_TRANSACTIONS AS (
        SELECT REPORT_TYPE, :productCode AS PRODUCT_CODE,
               RANK() OVER (PARTITION BY PRODUCT_ID ORDER BY TRANSACTION_DATE, ROWNUM) AS TRANSACTION_SEQ
        FROM COMBINED_TRANSACTIONS
    )
    -- MERGE의 USING 절에 최종 가공된 데이터를 전달
    SELECT REPORT_TYPE, PRODUCT_CODE, TRANSACTION_SEQ FROM RANKED_TRANSACTIONS
) SRC
ON (
    TGT.REPORT_TYPE = SRC.REPORT_TYPE AND
    TGT.PRODUCT_CODE = SRC.PRODUCT_CODE AND
    TGT.TRANSACTION_SEQ = SRC.TRANSACTION_SEQ
)
WHEN MATCHED THEN
    UPDATE SET TGT.IS_DELETED = 'N' WHERE TGT.IS_DELETED = 'Y';
```

## 결론

이 경험을 통해 얻은 교훈은 명확하다.

* **분해 및 분석**: 복잡한 쿼리는 가장 작은 단위로 분해하면 명확해진다. CTE는 이를 위한 최적의 도구다.

* **코드가 곧 문서**: 잘 작성된 CTE 쿼리는 그 자체로 비즈니스 로직을 설명하는 명세서가 된다.

* **숨은 오류와 로직 발견**: 코드를 분해하는 과정에서 `ORA-01417` 같은 구조적 오류뿐만 아니라, 불필요하거나 잘못된 비즈니스 로직을 발견하고 개선할 기회를 얻게 된다.

복잡한 쿼리와 마주했을 때, 그 '벽'을 한 번에 뚫으려 하지 말고 WITH 절을 사용해 차근차근 분해해보는 접근법을 시도해 보자. 안정성과 성능, 그리고 유지보수성까지 모두 잡는 현명한 선택이 될 것이다.
---
title: '[Kafka] DTO 때문에 겪는 역직렬화 지옥, Avro로 탈출하기'
date: '2025-07-11 15:51'
tags: ['Kafka', 'Avro', 'MSA', 'SchemaRegistry']
---

[Kafka PoC](https://github.com/Yseek/kafka-reporter-poc)를 진행하다가 재미있는 문제에 부딪혔다.

처음엔 간단했다. 동기식으로 동작해서 느려터진 API를 Kafka를 써서 비동기 방식으로 바꾸는, 아주 교과서적인 시나리오. Proudcer는 API 요청을 받아서 메시지를 던지고 바로 응답, Consumer는 그 메시지를 받아서 무거운 작업을 처리하는 구조. 심플했다.

하지만 문제는 **Producer와 Consumer가 서로 다른 프로젝트** 라는 점에서 시작됐다.

## DTO, 왜 안되는데 

마이크로서비스의 원칙을 지키기 위해, 난 두 프로젝트가 서로의 코드를 공유하지 않길 바랐다. 그래서 각자 자신만의 DTO 클래스를 가지게 했다.

- `producer`: `com.async.report.producer.dto.ReportDto`
- `consumer`: `com.async.report.consumer.dto.ReportDto`

그리고 Producer는 메시지를 보낼 때, 헤더에 타입 정보(`__TypeId__`)를 담아서 보냈다. "이 메시지는 `producer.dto.ReportDto`로 만들었으니, 참고해" 라는 의도다.

하지만 Consumer는 이 메시지를 받자마자 바로 죽어버렸다. 💀

```text
Caused by: java.lang.ClassNotFoundException: com.async.report.producer.dto.ReportDto
```

너무나 당연한 에러였다. Consumer 프로젝트엔 `producer.dto.ReportDto`라는 클래스가 존재하지 않으니까. 여기서부터 진짜 삽질이 시작됐다.

## 수동 매핑? 유지보수는?

처음엔 Consumer에 "번역기"를 달아주는, 단순하고 무식하고 확실한 방법을 시도했다.  
(일단 동작하는 걸 보고 싶었다!)

```java
@Bean
    public ConsumerFactory<String, ReportDto> consumerFactory() {
        DefaultJackson2JavaTypeMapper typeMapper = new DefaultJackson2JavaTypeMapper();
        Map<String, Class<?>> idClassMapping = new HashMap<>();
        idClassMapping.put("com.async.report.producer.dto.ReportDto", ReportDto.class);
        typeMapper.setIdClassMapping(idClassMapping);

        /* ... */
        
        return new DefaultKafkaConsumerFactory<>(props, new StringDeserializer(), deserializer);
    }
```

일단 동작은 했다. 하지만 Commit Push를 해놓고 보니 너무 찝찝했다. 
> 찝찝한 마음을 담은 커밋 메시지 ( ✨ consumer 추가... DTO 문제 해결 필요 ) 

대형 서비스들이 당연히 이런 식으로 구현되어있지 않을 거다. DTO가 100개 추가되면 매핑 코드도 100줄이 되어야 하는데, 이건 말이 안된다.

## 공통 모듈? Avro? 그게 그거 아닌가?

>그냥, `common-dto` 만들어서 같이 쓰면 편하겠지"  
>"어차피 Avro도 .avsc 파일 공유해야 하면, 공통 모듈이랑 똑같은 거 아냐?

직관적으로 이런 생각들이 떠올랐다. 하지만 바로 이 지점이, 공통 모듈과 Avro가 근본적으로 다른, 가장 강력한 차이점을 보여주는 부분이다.

`common-dto` 같은 공통 모듈은 서비스들을 **'컴파일된 코드'** 라는 뻣뻣한 약속으로 묶어버린다. Producer가 DTO에 필수 필드를 하나 추가하면, 그 즉시 Consumer는 메시지를 처리 못 하고 죽는다. 해결책은 동시 배포뿐. 이것이 바로 **강한 결합(Tight Coupling)** 이다.

하지만 Avro와 스키마 레지스트리는 **'스키마'** 라는 유연한 계약으로 연결된다. 여기서 스키마 레지스트리가 '계약 관리자' 역할을 하며, 시스템 전체를 보호한다.

만약 Producer가 새로운 필수 필드 managerName을 추가하고 배포를 시도하면 어떻게 될까?  
스키마 레지스트리는 이 변경을 보고 등록을 **거부(Reject)** 해버린다.

> 이건 하위 호환성이 깨지는 변경이야. 기존 Consumer들은 이 메시지를 받으면 무조건 에러 나. 안 돼!

결국 문제는 런타임이 아닌 개발 단계에서 미리 발견된다. 개발자는 "아, 내 변경이 다른 서비스를 망가뜨리는구나"를 깨닫고, 필드를 필수가 아닌 선택(optional)으로 바꾸는 등 하위 호환성을 지키는 방향으로 스키마를 수정하게 된다.

예를 들어, `managerName` 필드를 아래처럼 선택 필드로 추가하는 것이다.

_`ReportDto.avsc`_
```json
{
  "name": "fields",
  "fields": [
    { "name": "reportName", "type": "string" },
    { "name": "reporter", "type": "string" },
    { "name": "content", "type": "string" },
    { "name": "managerName", "type": ["null", "string"], "default": null }
  ]
}
```

이렇게 하면, Producer가 먼저 배포되어도 아직 구버전 스키마를 쓰는 Consumer는 새로운 managerName 필드를 그냥 조용히 무시하고 하던 일을 계속한다. 시스템은 멈추지 않는다. 그리고 Consumer 개발팀은 나중에 여유 있을 때 스키마를 업데이트하고, 새로운 데이터를 활용하면 그만이다.

## Avro, 해결사

해결책으로 **Avro와 스키마 레지스트리(Schema Registry)** 를 적용해봤다.

핵심 아이디어는 이렇다. 더 이상 Producer와 Consumer가 서로의 **코드(Class)** 에 의존하는 게 아니라, 중앙에서 관리되는 공통의 **설계도(Schema)** 를 바라보게 만드는 거다.

1. **설계도 정의(.avsc)**: 먼저 데이터 구조를 Avro 스키마 파일로 정의한다. 이건 그냥 JSON이라 어떤 언어에도 종속되지 않는다.

2. **설계도 등록(Schema Registry)**: 이 설계도를 중앙 관리소에 등록하고 ID: 5번 같은 고유 번호를 받는다.

3. **똑똑한 전송**: Producer는 이제 메시지에 스키마 ID(5번)와 압축된 바이너리 데이터만 담아서 보낸다. 훨씬 가볍고 효율적이다.

4. **설계도 기반 번역**: Consumer는 스키마 ID(5번)을 보고 중앙 관리소에서 설계도를 가져온다. 그리고 그 설계도를 보고 안전하게 데이터를 자신의 DTO로 변환한다.

이 방식을 도입하자, 괴롭혔던 문제가 다 사라졌다.

결국 이 PoC는 단순히 카프카를 써보는 걸 넘어, 느슨하게 결합된 아키텍처의 중요성을 온몸으로 깨닫는 계기가 되었다. 혹시라도 나처럼 DTO 역직렬화 지옥에서 헤매고 있다면, Avro와 스키마 레지스트리(Schema Registry)는 충분히 투자할 가치가 있는 기술이라고 말해주고 싶다. 삽질은 짧을수록 좋으니까.
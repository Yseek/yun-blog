---
title: '[SOLID 원칙 정복기] 1편: 첫걸음, 거대한 클래스 만들기'
date: '2025-07-04 13:09'
tags: ['SOLID', '디자인패턴', '클린코드', '설계']
---

개발자라면 누구나 '좋은 코드'에 대한 고민을 한 번쯤 해봤을 거다. 나 또한 마찬가지다. 어떻게 하면 더 유연하고, 유지보수하기 쉽고, 이해하기 좋은 코드를 작성할 수 있을까 고민하다 보면 항상 `SOLID 원칙`이라는 키워드를 마주치게 된다.

이론으로만 아는 것을 넘어, `SOLID` 원칙을 내 것으로 체득하고 싶다는 생각에 작은 토이프로젝트를 시작하고, 그 과정을 기록해보기로 한다.

## 프로젝트 소개: '자판기'
이번 `SOLID` 원칙 학습을 위해 선택한 프로젝트는 `자판기 프로그램`이다.

자판기를 선택한 이유는 간단하다.

- __직관적__: 누구나 동작 방식을 쉽게 이해할 수 있다.
- __역할 분리 명확__: 돈 계산, 재고 관리, 상품 선택 등 기능별로 역할을 나누기 좋다.
- __확장 가능__: 새로운 상품이나 결제 수단을 추가하는 상황을 가정하기 좋다.

## 거대한 클래스

리펙토링의 효과를 제대로 느끼려면, 먼저 `나쁜 코드`가 있어야한다. 그래서 `SOLID`원칙을 전혀 고려하지 않고, 오직 기능 구현에만 초점을 맞춰 모든 로직을 하나의 클래스에 담아보자.

```java
import java.util.HashMap;
import java.util.Map;

public class VendingMachine {

    private Map<String, Integer> items; // key: 음료수 이름, value: 가격
    private Map<String, Integer> stock; // key: 음료수 이름, value: 재고
    private int currentMoney = 0; // 현재 투입된 금액

    public VendingMachine() {
        this.items = new HashMap<>();
        this.stock = new HashMap<>();

        // 초기 상품 세팅
        items.put("Coke", 1200);
        stock.put("Coke", 5);
        items.put("Cider", 1100);
        stock.put("Cider", 5);
        items.put("Water", 800);
        stock.put("Water", 10);
    }

    // 1. 돈 투입 기능
    public void insertMoney(int money) {
        this.currentMoney += money;
        final String result = STR."투입 금액: \{money}원 / 현재 잔액: \{currentMoney}원";
        System.out.println("result = " + result);
    }

    // 2. 음료 선택 및 판매 기능 (가장 많은 책임을 가진 메소드)
    public void selectItem(String itemName) {
        // 유효성 검사 1: 존재하는 상품인가?
        if (!items.containsKey(itemName)) {
            System.out.println(STR."오류: '\{itemName}'는 판매하지 않는 상품입니다.");
            return;
        }

        final int price = items.get(itemName);
        final int currentStock = stock.get(itemName);

        // 유효성 검사 2: 재고가 있는가?
        if (currentStock <= 0) {
            System.out.println(STR."오류: '\{itemName}'는 품절되었습니다.");
            return;
        }

        // 유효성 검사 3: 돈이 충분한가?
        if (currentMoney < price) {
            System.out.println(STR."오류: 잔액이 부족합니다. (부족한 금액: \{price - currentMoney}원");
            return;
        }

        // 처리
        // 1) 재고 차감
        stock.put(itemName, currentStock - 1);

        // 2) 금액 계산 및 거스름돈 반환
        final int change = currentMoney - price;
        this.currentMoney = 0;

        // 3) 결과 출력
        System.out.println(STR."'\{itemName}'가 나왔습니다.");
        System.out.println(STR."거스름돈: \{change}원");
    }

    public void displayStock() {
        System.out.println("--- 현재 재고 현황 ---");
        for (String itemName : stock.keySet()) {
            System.out.println(STR."\{itemName}: \{stock.get(itemName)}개");
        }
        System.out.println("--------------------");
    }
}
```

## 이 코드의 문제점?

- __한 클래스가 너무 많은 일을 한다.__ `VendingMachine` 클래스는 상품 정보 관리, 재고 관리, 돈 계산, 판매 처리 등 자판기의 모든 책임을 혼자 짊어지고 있다. 만약 '돈 계산' 로직만 변경하고 싶어도, '재고 관리'나 '판매 처리' 로직까지 모두 신경 써야 하는 구조조다. (SRP 위반 가능성)

- __변화에 취약한 구조이다.__ 만약 '환타'라는 신제품을 추가하거나, '콜라 1+1 행사' 같은 할인 정책을 넣으려면 어떻게 해야 할까? `VendingMachine` 클래스 내부 코드를 직접 열어 수정해야만 한다. 기능의 '확장'이 기존 코드의 '변경'을 유발하는 것. (OCP 위반 가능성)

- __사용자와 관리자의 경계가 모호하다.__ `selectItem` 같은 사용자 기능과 `displayStock` 같은 관리자 기능이 한 클래스에 뒤섞여 있다. 이로 인해 사용자가 굳이 알 필요 없는 기능까지 노출될 수 있다. (ISP 위반 가능성)

이런 문제들이 쌓이면 __기술 부채(Technical Debt)__ 가 된다. 지금 당장은 편할 수 있지만 훗날 발목을 잡을 것이다...

## 다음 이야기: 책임을 분리하자

그래서 다음 포스팅은 거대한 클래스를 `SOLID`원칙에 따라 하나씩 리팩토링 하며 `좋은 코드`로 개선해나가는 여정을 시작할 것이다.

그 첫 번째 단계로, `SOLID`의 `S`에 해당하는 __단일 책임 원칙(SRP, SIngle Responsibility Principle)__ 을 적용하여 `VendingMachine`의 과도한 책임을 분리해보겠다.
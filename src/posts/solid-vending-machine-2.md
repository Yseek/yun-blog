---
title: '[SOLID 원칙 정복기] 2편: 단일 책임 원칙(SRP)으로 클래스 분리하기'
date: '2025-07-07 09:16'
tags: ['SOLID', '디자인패턴', '클린코드', '설계', 'SRP']
---

[__지난 1편__](https://yseek.github.io/yun-blog/posts/solid-vending-machine-1)에서는 `SOLID` 원칙을 적용하기 전, 모든 기능이 하나의 거대한 클래스에 포함된 자판기 프로그램을 만들었다. 이 코드는 작동은 하지만, 유지보수와 확장이 어려운 __기술 부채(Technical Debt)__ 를 안고 있다.

이번 포스팅에서는 이 문제를 해결하기 위한 첫걸음으로, `SOLID`의 __'S'__, __단일 책임 원칙(SRP)__ 을 적용해 클래스를 깔끔하게 분리하는 과정을 다뤄보겠다.

 ## SRP(단일 책임 원칙)란?

> A class should have only one reason to change.  
> (클래스를 변경해야 하는 이유는 단 하나여야 한다.)

SRP를 가장 쉽게 이해하는 방법은 클래스를 '부서'에 비유하는 것이다. 하나의 부서는 하나의 책임만 져야 효율적이다. 재무팀이 인사팀의 일까지 하진 않으니까...

지난번 `VendingMachine` 클래스는 가격 정책(재무팀), 재고 관리(물류팀), 판매(영업팀)의 일을 혼자서 처리하는 '만능 부서'였다. 작은 변경 하나에도 클래스 전체가 영향을 받는 불안정한 구조다.

## 리팩토링 과정: 책임을 나누고 전문가에게 맡기자

가장 먼저 `VendingMachine` 클래스에 어떤 책임들이 있는지 식별한다.

- __상품(Item) 관리__: 이름, 가격 등 상품의 속성을 가짐
- __재고(Inventory) 관리__: 상품의 수량을 관리하고, 재고가 있는지 확인
- __결제(Payment)__: 돈을 받고, 잔액을 계산하고, 거스름돈을 반환
- __총괄(Machine)__: 위 과정들을 올바른 순서로 조율

이제 이 책임들을 각각 '전문가 클래스'에게 나누어준다.

### 1. `Item.java`: 상품의 명세서

가장 먼저 분리한 것은 '상품' 그 자체이다. 이 클래스는 상품의 이름과 가격이라는 데이터만 순수하게 담고 있다. 다른 어떤 로직도 수행하지 않고 자신의 정보만 책임지는, 가장 단순하고 명확한 클래스다.

```java
/**
 * 상품 정보
 */
public class Item {
    private String name;
    private int price;

    public Item(String name, int price) {
        this.name = name;
        this.price = price;
    }

    public String getName() {
        return name;
    }

    public int getPrice() {
        return price;
    }
}

```

### 2. `PaymentProcessor.java`: 금전 출납기

다음은 돈과 관련된 모든 처리를 담당하는 '결제 전문가'다. `PaymentProcessor`는 돈을 받고, 현재 잔액이 충분한지 확인하고, 결제가 완료되면 거스름돈을 계산하는 등 오직 '돈'에 관련된 책임만 수행한다. 이제 가격 할인이나 다른 결제 수단 추가 같은 변경이 필요할 때, 이 클래스만 집중해서 보면 된다.

```java
/**
 * 결제 관리
 */
public class PaymentProcessor {
    private int currentMoney = 0;

    public void insertMoney(int money) {
        this.currentMoney += money;
        System.out.println(STR."투입 금액: \{money}원 / 현재 잔액: \{currentMoney}원");
    }

    public boolean isPaymentSufficient(int price) {
        return currentMoney >= price;
    }

    public void processPayment(int price) {
        int change = currentMoney - price;
        this.currentMoney = change;
        System.out.println(STR."잔액: \{change}원");
    }

    public void returnChange() {
        System.out.println(STR."거스름돈: \{currentMoney}원");
        this.currentMoney = 0;
        System.out.println(STR."머신 잔액: \{currentMoney}원");
    }

    public int getCurrentMoney() {
        return currentMoney;
    }
}
```

### 3. `Inventory.java`: 재고 관리자

'재고 관리 전문가'인 `Inventory`이다. 이 클래스는 각 상품의 재고를 보관하고, 특정 상품의 재고가 남아있는지 확인하며, 판매가 완료되었을 때 재고를 차감하는 역할을 한다. 재고 관리 방식이 바뀌거나 로직이 추가되어도, 이 클래스만 수정하면 되므로 다른 코드에 영향을 주지 않는다.

```java
/**
 * 재고 관리
 */
public class Inventory {
    private Map<Item, Integer> stock;

    public Inventory() {
        this.stock = new HashMap<>();
    }

    public void addItem(Item item, int quantity) {
        this.stock.put(item, quantity);
    }

    public boolean isInStock(Item item) {
        return stock.getOrDefault(item, 0) > 0;
    }

    public void releaseItem(Item item) {
        if (isInStock(item)) {
            stock.put(item, stock.get(item) - 1);
        }
    }

    // 재고 확인 등 관리자 기능
    public void displayStock() {
        System.out.println("--- 현재 재고 현황 ---");
        for (Map.Entry<Item, Integer> entry : stock.entrySet()) {
            System.out.println(STR."\{entry.getKey().getName()}: \{entry.getValue()}개");
        }
        System.out.println("--------------------");
    }
}

```

### 4. `VendingMachine.java`: 총괄

마지막으로, 모든 책임을 갖고 있던 `VendingMachine`은 이제 각 전문가에게 일을 넘기고 전체 과정을 조율하게 된다. `selectItem` 메소드가 어떻게 변했는지 비교해보면 그 차이가 명확히 보인다.

__변경 전: 모든 일을 직접 처리 `VendingMachine` (`step01/VendingMachine.java`)__

```java
// VendingMachine.java
public void selectItem(String itemName) {
    // 상품 존재 확인, 가격 확인, 재고 확인, 잔액 확인,
    // 재고 차감, 거스름돈 계산 등 모든 로직...
    if (!items.containsKey(itemName)) {/* ... */}
    final int price = items.get(itemName);
    final int currentStock = stock.get(itemName);
    if (currentStock <= 0) {/* ... */}
    if (currentMoney < price) {/* ... */}
    stock.put(itemName, currentStock - 1);
    final int change = currentMoney - price;
    this.currentMoney = 0;
    // ...
}
```

__변경 후: 전문가에게 일을 위임하는 `VendingMachine` (`step02_srp/VendingMachine.java`)__

```java
// VendingMachine.java
public void selectItem(String itemName) {
    Item item = items.get(itemName);
    if (item == null) { /* ... */ }

    // 재고 확인 -> Inventory
    if (!inventory.isInStock(item)) { /* ... */ }

    // 잔액 확인 -> PaymentProcessor
    if (!paymentProcessor.isPaymentSufficient(item.getPrice())) { /* ... */ }
    
    // 재고 및 결제 처리
    inventory.releaseItem(item);
    paymentProcessor.processPayment(item.getPrice());
    // ...
}
```

복잡했던 메소드가 간결해지고, "어떤 순서로 일을 처리한다"는 절차를 명확하게 보여준다.

## 결과: SRP 적용 이점

단일 책임 원칙을 적용한 것만으로도 코드는 많은 것을 얻었다.

- __높은 가독성__: 각 클래스는 자신의 책임만 담고 있어 이해하기 쉽다.
- __쉬운 유지보수__: 가격 할인 정책이 변경되면 `PaymentProcessor`만 수정하면 된다. 다른 클래스는 영향을 받지 않느다.
- __코드 재사용성__: `PaymentProcessor`는 다른 종류의 판매 기계에서도 재사용 할 수 있다.

## 다음 이야기: 책임을 분리하자

이제 클래스들은 각자의 책임을 갖게 되었다. 하지만 여전히 문제가 남아있다. 자판기에 `환타` 같은 음료를 추가하려면 `VendingMachine` 클래스의 코드를 직접 수정해야한다.

다음 포스팅에서는 __개방-폐쇄 원칙(OCP)__ 을 적용하여, __기존 코드를 수정하지않고도__ 새로운 기능을 안전하게 확장하는 방법을 알아보자.


---
- [[SOLID 원칙 정복기] 1편: 첫걸음, 거대한 클래스 만들기](https://yseek.github.io/yun-blog/posts/solid-vending-machine-1)  
...  
- [[SOLID 원칙 정복기] 3편: OCP로 신상 음료 출시하기 (feat. 추상화)](https://yseek.github.io/yun-blog/posts/solid-vending-machine-3)
---
---
title: '[SOLID 원칙 정복기] 4편: 그 상속, 정말 괜찮을까? (LSP)'
date: '2025-07-07 14:48'
tags: ['SOLID', '디자인패턴', '클린코드', '설계', 'LSP']
---

[지난 3편](https://yseek.github.io/yun-blog/posts/solid-vending-machine-3)에서는  __개방-폐쇄 원칙(OCP)__ 을 통해 '수정'없이 '확장'이 가능한 유연한 코드를 만들었다. 그 중심에는 '상속'이라는 강력한 도구가 있었다.

하지만 상속을 사용하는 것만으로 충분할까? 만약 상속을 '잘못' 사용하면, 애써 만든 유연한 구조가 한순간에 무너질 수도 있다. 이번 포스팅에서는 `SOLID`의 __'L'__, __리스코프 치환 원칙(LSP)__ 을 통해 상속을 '올바르게' 사용하는 기준에 대해 알아보자.

## LSP(리스코프 치환 원칙)란?

> Subtypes must be substitutable for their base types.  
> (자식 타입은 언제나 자신의 부모 타입으로 교체될 수 있어야 한다.)

이해하기 쉽게 "자식 클래스는 부모 클래스인 척할 때, 언제나 문제 없이 행동할 수 있어야 한다"는 뜻이다. 자식 클래스(`HotAmericano`)를 부모 클래스(`Item`) 타입으로 다룰 때, 프로그램은 눈치채지 못하고 똑같이 동작해야 한다.

만약 코드 어딘가에 `if (item instanceof HotAmericano)` 같은 코드가 있다면, 그건 부모인 척하는 자식의 정체를 캐묻는 것과 같다. 이는 LSP 위반의 강력한 신호다.

## 리팩토링 과정: 수상한 자식 등장

의도적으로 원칙을 위반하는 상황을 만들어보자.

__새로운 요구사항__: 자판기에 '뜨거운 음료'를 추가한다. 이 음료는 제공하기 전에 반드시 `warmUp()` 과정을 거쳐야 한다.

### 1. 나쁜 예: LSP를 위반하는 코드

먼저 `HotAmericano`라는 새로운 자식 클래스를 만든다. 그리고 이 자식의 타입(`instanceof`)을 확인하여 특별 대우하는 `VendingMachine` 코드를 작성해보자.

_`HotAmericano.java` (자신만의 특별한 메소드를 가짐)_
```java
public class HotAmericano extends Item {
    public HotAmericano() { super("HotAmericano", 1500); }
    public void warmUp() { /* ... 데우는 로직 ... */ }
}
```

_`VendingMachine.java` (자식의 정체를 캐묻는 나쁜 코드)_
```java
public void selectItem(String itemName) {
    Item item = items.get(itemName);
    // ... 유효성 검사 ...

    // *** LSP 위반 지점 ***
    if (item instanceof HotAmericano hotItem) {
        hotItem.warmUp(); // 자식 타입으로 형변환 후 특별한 메소드 호출
    }

    inventory.releaseItem(item);
    // ...
}
```

이 코드는 심각한 문제가 있다. `VendingMachine`이 `HotAmericano`라는 특정 자식의 존재 묻고 있다. 만약 `HotLatte`가 추가된다면? `else if (item instanceof HotLatte hotItem)`를 또 추가해야 한다. `OCP 원칙`까지 무너져 버린다.

### 2. 해결책: 행동을 일반화하여 부모에게 맡기기

해결책은 '자식만 아는 특별한 행동'을 '부모도 아는 일반적인 행동'으로 끌어올리는 것이다.

_`Item.java` (모든 상품은 '준비' 과정을 가진다고 일반화)_
```java
public abstract class Item {
    // ... 기존 코드 ...
    public abstract void prepare(); // '준비'라는 행동을 추상 메소드로 정의
}
```

_`Coke.java` (일반 음료의 준비과정)_
```java
public class Coke extends Item {
    // ...
    @Override
    public void prepare() { System.out.println(STR."\{getName()}는 바로 제공됩니다."); }
}
```

_`HotAmericano.java` (뜨거운 음료의 준비 과정)_
```java
public class HotAmericano extends Item {
    // ...
    @Override
    public void prepare() { System.out.println(STR."\{getName()}를 데우는 중... 완료!"); }
}
```

이제 `VendingMachine`은 자식의 정체를 궁금해할 필요가 없다. 그저 부모의 규약대로 '준비'를 명령하면 된다.

_`VendingMachine.java` (LSP를 준수하는 개선된 코드)_
```java
public void selectItem(String itemName) {
    Item item = items.get(itemName);
    // ... 유효성 검사 ...

    item.prepare(); // 어떤 자식이든 상관없이, 그저 부모의 규약대로 호출

    inventory.releaseItem(item);
    // ...
}
```

## LSP 원칙 준수 결과

LSP를 준수함으로써 `VendingMachine`은 모든 `Item` 타입의 객체를 차별 없이, 일관된 방식으로 다룰 수 있게 되었다. `HotAmericano`는 이제 부모인 `Item`을 완벽하게 대체할 수 있게 된 것이다.

```java
@Test
@DisplayName("여러 종류의 상품을 선택해도 각자 맞는 준비 과정 실행")
void testWithMixedItem() {
    System.out.println("--- LSP 혼합 상품 테스트 ---");
    //given
    final List<Item> items = Arrays.asList(new Coke(), new HotAmericano(), new Cider());
    final VendingMachine machine = new VendingMachine(items);

    //when
    machine.insertMoney(5000);

    System.out.println("* 콜라 선택");
    machine.selectItem("Coke");

    System.out.println("\n* 아메리카노 선택");
    machine.selectItem("HotAmericano");

    //then
    machine.displayStock();
}
```
![출력 내용](../images/solid-vending-machine-4/vending-machine-4-1.png)

## 다음 이야기: 필요하지 않은 기능까지 받아야 하나?

이젠 상속을 통해 역할을 잘 분담하게 되었다. 그런데 자판기에는 '고객'과 '관리자'라는 두 명의 사용자가 있다. 만약 '고객'에게 재고를 추가하는 '관리자' 기능까지 노출된다면 어떻게 될까?

다음 포스팅에서는 __인터페이스 분리 원칙(ISP)__ 을 통해 역할에 맞게 기능을 나누는 법을 알아보자.


---
- [[SOLID 원칙 정복기] 1편: 첫걸음, 거대한 클래스 만들기](https://yseek.github.io/yun-blog/posts/solid-vending-machine-1)  
- [[SOLID 원칙 정복기] 2편: 단일 책임 원칙(SRP)으로 클래스 분리하기](https://yseek.github.io/yun-blog/posts/solid-vending-machine-2)
- [[SOLID 원칙 정복기] 3편: OCP로 신상 음료 출시하기 (feat. 추상화)](https://yseek.github.io/yun-blog/posts/solid-vending-machine-3)
---
---
title: '[SOLID 원칙 정복기] 최종화: 추상에 의존한다 (DIP)'
date: '2025-07-08 10:21'
tags: ['SOLID', '디자인패턴', '클린코드', '설계', 'DIP']
---

[지난 5편](https://yseek.github.io/yun-blog/posts/solid-vending-machine-5)까지의 여정을 통해, 거대했던 하나의 클래스를 여러 원칙을 적용하며 개선해왔다.

- __SRP__ 로 각자의 책임 분리
- __OCP__ 로 확장에는 열려있는 구조
- __LSP__ 로 상속을 올바르게 사용
- __ISP__ 로 클라이언트에게 필요한 기능만을 제공

하지만 아직 해결해야 할 마지막 문제가 남이있다. 바로 `VendingMachine`이 `Inventory`나 `PaymentProcessor`같은 객체를 직접 `new` 키워드로 생성하고 있는 점이다. 이번 포스팅에서는 마지막 원칙, `SOLID`의 __'D'__, __의존관계 역전 원칙(DIP)__ 을 통해 문제를 해결하고 시리즈를 마무리해보자. 

## DIP(의존관계 역전 원칙)란?

> Depend on abstractions, not on concretions.  
> (구체적인 것에 의존하지 말고, 추상적인 것에 의존하라.)

말 그대로, __"구체적인 실제 클래스에 의존하지 말고, 추상적인 약속(인터페이스)에 의존하라"__ 는 말이다.

이 원칙을 구현하는 대표적인 방법이 바로 __제어의 역전(IoC, Inversion of Control)__ 과 __의존성 주입(DI, Dependency Injection)__ 이다. 말이 조금 어려울 수 있지만, 간단하다. 객체를 생성하고 제어하는 흐름을 뒤바꾸고(IoC), 필요한 객체(의존성)을 외부에서 '주입'해주는(DI) 디자인 패턴이다.

## 리팩토링 과정: 제어권을 외부로

### 1. 문제점 

`DIP`원칙 적용 전의 `VendingMachine` 생성자다. 상위 모듈인 `VendingMachine`이 하위 모듈인 `Inventory`와 `PaymentProcessor`를 직접 생성하며 강하게 결합되어 있다. (DIP 위반)

```java
    public VendingMachine(List<Item> drinks) {
        this.inventory = new Inventory();               // DIP 위반
        this.paymentProcessor = new PaymentProcessor(); //DIP 위반
        // ...
    }
```

### 2. '약속' 인터페이스 정의하기

`VendingMachine`이 의존할 '약속', 즉 인터페이스를 정의한다.

_`Storable.java` (재고 관리 인터페이스)_
```java
public interface Storable {
    // addItem, addStock, isInStock 등 재고 관련 기능 명세
}
```

_`Payable.java` (결제 처리 인터페이스)_
```java
public interface Payable {
    // insertMoney, isPaymentSufficient, processPayment 등 결제 관련 기능 명세
}
```

### 3. `VendingMachine`은 '약속'에만 의존

이제 `VendingMachine`은 구체적인 객체가 아닌, '인터페이스'에만 의존한다. 실제 객체는 생성자를 통해 외부에서 주입받는다.

```java
public class VendingMachine implements UserOperations, AdminOperations {
    private final Storable inventory; // Storable 규격의 부품
    private final Payable paymentProcessor; // Payable 규격의 부품
    // ...

    // 생성자를 통해 모든 부품(의존성)을 외부에서 주입받는다.
    public VendingMachine(List<Item> itemList, Storable inventory, Payable paymentProcessor) {
        this.items = /* ... */;
        this.inventory = inventory; // 외부에서 받은 재고 부품을 장착
        this.paymentProcessor = paymentProcessor; // 외부에서 받은 결제 부품을 장착
        // ...
    }
    // ...
}
```

`VendingMachine`은 이제 `new` 키워드를 사용하지 않는다. 제어권이 완전히 외부로 넘어갔다(IoC).

### 4. 외부에서 주입

객체를 생성하고 주입하는 책임은 외부의 '조립기'가 맡는다.

```java
  @Test
    @DisplayName("표준 부품(Inventory, PaymentProcessor)을 주입했을 때 정상 동작한다")
    void testWithStandardParts() {
        // 1. 사용할 실제 객체를 여기서 생성
        final Storable inventory = new Inventory();
        final Payable paymentProcessor = new PaymentProcessor();
        final List<Item> items = Arrays.asList(new Coke(), new HotAmericano(), new Water());

        // 2. 인터페이스 타입으로 VendingMachine에 '주입'
        final VendingMachine machine = new VendingMachine(items, inventory, paymentProcessor);

        // ...자판기 사용...
    }
```

## 결과: 모듈만 변경해 바꿔 끼워

만약 기존 결제기가 고장나서, 새로운 `FakePaymentProcessor`로 교체해야 한다면 어떻게 해야 할까?

```java
class FakePaymentProcessor implements Payable {
    //...메소드 구현...
}
```

`FakePaymentProcessor`을 새로 만든 뒤, `VendingMachine`에 `FakePaymentProcessor`을 넣어주면 된다.

```java
  @Test
    @DisplayName("교체 부품(Inventory, FakePaymentProcessor)을 주입했을 때 정상 동작한다")
    void testWithStandardParts() {
        // 1. 사용할 실제 객체를 여기서 생성
        final Storable inventory = new Inventory();
        final Payable fakePayment = new FakePaymentProcessor();
        final List<Item> items = Arrays.asList(new Coke(), new HotAmericano(), new Water());

        // 2. 인터페이스 타입으로 VendingMachine에 '주입'
        final VendingMachine machine = new VendingMachine(items, inventory, fakePayment);

        // ...자판기 사용...
    }
```

`VendingMachine` 코드는 전혀 수정할 필요가 없다. 이것이 바로 `DIP`가 주는 궁극의 유연함이다.


## 시리즈를 마치며...

드디어 처음의 거대했던 `VendingMachine` 클래스를 `SOLID` 원칙에 따라 유연하고 견고한 구조로 탈바꿈시켰다. 이 작은 프로젝트를 통해 모든 원칙이 지켜진 '이상적인 코드'의 모습을 그려보았다.

하지만 현실에선, 종종 다른 상황을 마주하게 된다.

수많은 레거시 코드 속에서 'SOLID'는 교과서 속 이야기처럼 멀게 느껴지기도 한다. 어떤 코드는 단일 책임 원칙(SRP)는 잘 지켰지만 개방-폐쇄 원칙(OCP)은 무너져 있고, 어떤 코드는 의존성 주입(DI)을 시도했지만 어설픈 추상화에 그치기도 한다. 때로는 전체 구조를 뒤엎지 않고서는 'SOLID'를 적용할 엄두조차 나지 않는 거대한 코드베이스 앞에서 좌절감을 느끼기도 한다.

그렇다면 'SOLID'원칙은 현실과 동떨어진 이론일까? 그렇진 않다고 생각한다.

중요한 건 '완벽함'이 아니라 __'방향성'__ 이다. 'SOLID'는 '모든 코드는 이래야만 한다'는 엄격한 법이 아니라, __'더 나은 코드는 저 방향에 있다'__ 고 알려주는 가이드이다.

우리의 목표는 하룻밤에 모든 코드를 'SOLID'하게 바꾸는 것이 아닐 것이다. 새로 작성하는 코드 한 줄, 새로운 클래스 하나에라도 이 원칙을 녹여내려 노력해보는 것이다. 어제의 코드보다 오늘 내가 작성하는 코드가 조금 더 'SOLID' 원칙에 가까워졌다면, 훌륭하지 않은가!

그동안 이론으로만 알고 있거나, 어설프게 적용하다 길을 잃었던 'SOLID' 원칙들을 이번 기회에 제대로 마주하고 싶었다. 역시 '아는 것'과 '해보는 것'은 전혀 다른 차원의 경험이었다.

머리에서만 맴돌던 다섯 가지 원칙들이, 이 작은 자판기 프로젝트를 통해 비로소 체화되는 것을 느끼며, 앞으로 마주할 모든 코드 앞에서 더 나은 구조를 향한 질문을 던질 용기를 얻게 되었다.

개발자로서 이제 조금 더 'SOLID'하게 살아보려고 한다. 이 시리즈를 끝까지 봐주셔서 감사합니다.

---
- [[SOLID 원칙 정복기] 1편: 첫걸음, 거대한 클래스 만들기](https://yseek.github.io/yun-blog/posts/solid-vending-machine-1)  
- [[SOLID 원칙 정복기] 2편: 단일 책임 원칙(SRP)으로 클래스 분리하기](https://yseek.github.io/yun-blog/posts/solid-vending-machine-2)
- [[SOLID 원칙 정복기] 3편: OCP로 신상 음료 출시하기 (feat. 추상화)](https://yseek.github.io/yun-blog/posts/solid-vending-machine-3)
- [[SOLID 원칙 정복기] 4편: 그 상속, 정말 괜찮을까? (LSP)](https://yseek.github.io/yun-blog/posts/solid-vending-machine-4)
- [[SOLID 원칙 정복기] 5편: 고객님, 여긴 관리자 구역입니다 (ISP)](https://yseek.github.io/yun-blog/posts/solid-vending-machine-5)
---
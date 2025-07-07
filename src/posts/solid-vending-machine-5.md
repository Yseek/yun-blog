---
title: '[SOLID 원칙 정복기] 5편: 고객님, 여긴 관리자 구역입니다 (ISP)'
date: '2025-07-07 16:33'
tags: ['SOLID', '디자인패턴', '클린코드', '설계', 'ISP']
---

[지난 4편](https://yseek.github.io/yun-blog/posts/solid-vending-machine-4)까지 `SRP`, `OCP`, `LSP를` 통해 클래스 내부를 유연하고, 확장 가능하며, 안정적으로 만들어왔다. 이제 시선을 클래스 내부에서 외부로 돌려, 코드를 사용하는 __'클라이언트'__ 의 입장에서 설계를 바라보자.

하나의 클래스에 너무 많은 기능이 있으면, __'고객'__ 과 __'관리자'__ 처럼 역할이 다른 클라이언트에게 불필요한 기능까지 노출되는 문제가 생긴다. 이번 포스팅에서는 `SOLID`의 __'I'__, __인터페이스 분리 원칙(ISP)__ 을 통해 문제를 해결해보자.

## ISP(인터페이스 분리 원칙)란?

> Clients should not be forced to depend upon interfaces that they do not use.  
> (클라이언트는 자신이 사용하지 않는 메소드에 의존해서는 안 된다.)

이 원칙의 핵심은 __"뚱뚱한 인터페이스 하나보다, 역할에 맞는 작은 인터페이스 여러 개가 낫다."__ 이다.

`VendingMachine` 클래스에는 `insertMoney`(고객 기능)와 `addStock`(관리자 기능)이 모두 들어있다. 만약 이 모든 기능을 하나의 인터페이스로 묶어 제공한다면, 일반 고객이 `addStock`이라는 기능을 알게 되는 셈이다. 고객은 이 기능에 전혀 관심이 없는데도 말이다... 이는 불필요한 결합을 만들고 시스템을 불안정하게 만드는 요인이 된다.

## 리팩토링 과정: 권한에 맞는 명찰을 달아주자

해결책은 간단하다. 클라이언트의 역할에 따라 인터페이스를 분리하여, 각자에게 맞는 '명찰'을 달아주면 된다.

### 1. 역할별 인터페이스 정의

먼저 '고객'과 '관리자'의 역할에 맞는 두 개의 인터페이스를 만든다.

_`UserOperations.java` (고객 전용 명찰)_
```java
// 오직 고객이 할 수 있는 행동만 정의
public interface UserOperations {
    void insertMoney(int quantity);
    void selectItem(String itemName);
    void returnChange();
}
```

_`AdminOperations.java` (관리자 전용 명찰)_
```java
// 오직 관리자가 할 수 있는 행동만 정의
public interface AdminOperations {
    void addStock(String itemName, int quantity);
    void displayStock();
}
```

### 2. `VendingMachine`에 명찰 달아주기

`VendingMachine` 클래스는 이제 두 개의 인터페이스를 모두 구현(`implements`)함으로써, 고객 역할과 관리자 역할을 모두 수행할 수 있음을 명시한다.

```java
// VendingMachine이 User와 Admin의 역할을 모두 수행함을 선언
public class VendingMachine implements UserOperations, AdminOperations {
    // ... 모든 기능의 실제 구현 코드는 내부에 존재
    @Override
    public void insertMoney(int money) {/* ... */}
    @Override
    public void selectItem(String itemName) {/* ... */}
    @Override
    public void returnChange() {/* ... */}
    @Override
    public void addStock(String itemName, int quantity) {/* ... */}
    @Override
    public void displayStock() {/* ... */}
}
```

### 3. 클라이언트가 역할에 맞는 명찰로 접근하기

이제 클라이언트는 `VendingMachine`의 전부를 볼 필요 없이, 자신이 필요한 역할의 명찰(인터페이스)만 보고 접근할 수 있다.

_`VendingMachineTest.java` (테스트 코드)_
```java
private VendingMachine machine;

@BeforeEach
void setUp() {
    // 모든 테스트에서 사용할 공통 자판기 객체
    machine = new VendingMachine(
            Arrays.asList(new Coke(), new HotAmericano(), new Cider(), new Water())
    );
}
...
@Test
@DisplayName("고객 관점: 고객은 고객 기능에만 접근 가능")
void testFromUserPerspective() {
    System.out.println("--- ISP 고객 관점 테스트 ---");
    //given
    final UserOperations userClient = machine;

    //when
    userClient.insertMoney(5000);
    userClient.selectItem("Coke");
    userClient.selectItem("HotAmericano");
    userClient.selectItem("Cider");
    userClient.returnChange();

    //then
    // userClient.addStock("Coke", 5); // 이 코드는 컴파일 에러가 발생한다.
    // 왜냐하면 UserOperations 인터페이스에는 addStock() 메소드가 없기 때문
    System.out.println("고객 기능이 정상 실행되었습니다.");
}

@Test
@DisplayName("관리자 관점: 관리자는 관리자 기능에만 접근 가능")
void testFromAdminPerspective() {
    System.out.println("--- ISP 관리자 관점 테스트 ---");

    //given
    AdminOperations adminClient = machine;

    //when
    adminClient.displayStock();
    adminClient.addStock("Coke", 11);
    adminClient.addStock("HotAmericano", 12);

    //then
    // adminClient.insertMoney(1000); // 컴파일 에러
    // AdminOperations라는 명찰에는 insertMoney 기능이 없기 때문
    adminClient.displayStock();
}
```

## 결과: 클라이언트는 안심할 수 있다

`ISP`를 적용함으로써, 클라이언트에게 꼭 필요한 최소한의 기능만을 노출하게 됐다.

- __보안 향상__: 사용자가 실수로 관리자 기능을 호출할 가능성이 원천적으로 차단
- __명확한 역할__: `UserOperations` 인터페이스만 봐도 고객의 역할을, `AdminOperations`만 봐도 관리자의 역할을 바로 파악 가능

## 다음 이야기: 대망의 마지막... 우리는 모두 추상에 의존한다

지금까지 클래스와 인터페이스를 분리하며 유연한 설계를 만들었다. 하지만 아직 한 가지 문제가 남아있다. `VendingMachine`이 `PaymentProcessor` 나 `Inventory` 같은 구체적인 클래스를 직접 생성(`new PaymentProcessor()`)하고 있다는 점이다.

다음 포스팅에서는 마지막 원칙인 __의존관계 역전 원칙(DIP)__ 을 통해, 이 의존 관계를 역전시켜 'SOLID' 원칙으로 만드는 대장정을 마무리 해보자. 

---
- [[SOLID 원칙 정복기] 1편: 첫걸음, 거대한 클래스 만들기](https://yseek.github.io/yun-blog/posts/solid-vending-machine-1)  
- [[SOLID 원칙 정복기] 2편: 단일 책임 원칙(SRP)으로 클래스 분리하기](https://yseek.github.io/yun-blog/posts/solid-vending-machine-2)
- [[SOLID 원칙 정복기] 3편: OCP로 신상 음료 출시하기 (feat. 추상화)](https://yseek.github.io/yun-blog/posts/solid-vending-machine-3)
- [[SOLID 원칙 정복기] 4편: 그 상속, 정말 괜찮을까? (LSP)](https://yseek.github.io/yun-blog/posts/solid-vending-machine-4)
---
---
title: '[SOLID 원칙 정복기] 3편: OCP로 신상 음료 출시하기 (feat. 추상화)'
date: '2025-07-07 12:35'
tags: ['SOLID', '디자인패턴', '클린코드', '설계', 'OCP']
---

[지난 2편](https://yseek.github.io/yun-blog/posts/solid-vending-machine-2)에서는 `단일 책임 원칙(SRP)`을 적용하여 자판기 클래스를 책임별로 깔끔하게 분리했다. 각 클래스는 이제 한 가지 일에만 집중하게 되었다.

하지만 여전히 문제는 남아있다. 만약 자판기에 '환타'나 '이온 음료' 같은 신제품을 추가하려면 어떻게 해야 할까? 결국 `VendingMachine` 클래스 코드를 직접 열어 상품을 추가하는 코드를 수정해야 한다.

이번 포스팅에서는 이 문제를 `SOLID`의 __'O'__, __개방-폐쇄 원칙(OCP)__ 을 통해 해결해 보자.

## OCP(개방-폐쇄 원칙)란?

> Software entities should be open for extension, but closed for modification.  
> (소프트웨어 요소는 확장에는 열려있고, 변경에는 닫혀있어야 한다.)

간단히 말해, __새로운 기능을 추가할 때 기존 코드는 건드리지 말자__ 는 원칙이다. 기능 추가라는 '확장'은 자유롭게 하되, 그로 인해 기존 코드에 '변경'이 발생해서는 안 된다는 뜻이다.

이 원칙을 지키는 핵심 기술이 바로 __추상황(Abstraction)__ 이다. 코드가 '콜라', '사이다' 같은 구체적인 대상이 아닌, '아이템' 이라는 추상적인 개념에 의존하게 만들어 변화에 유연하게 대처할 수 있게 된다.

## 리팩토링 과정

### 1. `Item`을 추상 클래스로 변경

기존에 일반 클래스였던 `Item`을 `abstract` 키워드를 붙여 추상 클래스로 변경한다. 이제 `Item`은 '자판기 상품이라면 마땅히 가져야 할 기본 명세'의 역할을 한다.

```java
// Item을 추상 클래스로 변경하여 모든 상품의 기본 틀로 사용
public abstract class Item {
    private String name;
    private int price;

    public Item(String name, int price) {
        this.name = name;
        this.price = price;
    }
    // getName(), getPrice() 메소드는 동일
}
```

### 2. 구체적인 상품들이 `Item`을 상속

이제 `Coke`, `Cider`, `Water` 클라스가 `Item` 추상 클래스를 `extends` (상속)받도록 한다. 이들은 이제 'Item' 이라는 기본 명세를 따라는 구체적인 상품이 된다.

```java
// Item이라는 추상적인 개념을 상속받은 '구체적인' 상품
public class Coke extends Item {
    public Coke() {
        super("Coke", 1200);
    }
}

public class Cider extends Item {
    public Cider() {
        super("Cider", 1100);
    }
}

...
```

### 3. `VendingMachine`의 변화: 의존성 주입(Dependency Injection)

가장 중요한 변화다. `VendingMachine`은 더 이상 어떤 상품을 팔지 스스로 결정하지 않는다. 대신 __외부에서 상품 목록(`List<Item>`)을 주입받아__ 동작한다.

```java
public class VendingMachine {
    private final Inventory inventory;
    private final PaymentProcessor paymentProcessor;
    private final Map<String, Item> items;

    // 생성자를 통해 판매할 상품 목록을 외부에서 주입받는다!
    public VendingMachine(List<Item> itemList) {
        this.inventory = new Inventory();
        this.paymentProcessor = new PaymentProcessor();
        
        // 주입받은 리스트로 판매 상품 맵을 구성
        this.items = itemList.stream()
                .collect(Collectors.toMap(Item::getName, Function.identity()));

        // 재고 초기화
        this.items.values().forEach(item -> inventory.addItem(item, 5));
    }

    // ... 나머지 코드는 거의 동일 ...
}
```

이제 `VendingMachine`은 자신이 어떤 상품을 파는지 모른다. 그저 'Item'이라는 추상적인 규격에 맞는 대상들을 다룬다.

## OCP의 위력: '환타' 출시!

자, 이제 `VendingMachine.java`를 수정하지 않고 신상 음료 '환타'를 출시해보자.

```java
@Test
@DisplayName("새로운 상품을 추가해도 잘 동작한다")
void extendWithNewItem() {
    System.out.println("--- OCP 확장성 테스트 ---");
    //given
    class Fanta extends Item {
        public Fanta() {
            super("Fanta", 1300);
        }
    }

    // Fanta 를 포함한 상품 목록 구성
    final List<Item> items = Arrays.asList(new Coke(), new Cider(), new Fanta());
    final VendingMachine machine = new VendingMachine(items);

    //when
    machine.displayStock();
    machine.insertMoney(5000);
    machine.selectItem("Fanta");

    //then
    machine.displayStock();
}
```

![출력 내용](../images/solid-vending-machine-3/vending-machine-3-1.png)

`VendingMachine`, `Inventory`, `PaymentProcessor` 등 핵심 로직이 담긴 클래스는 단 한 줄도 수정하지 않았다. 그저 `Fanta` 라는 새로운 기능을 '추가'했을 뿐이다!

## 다음 이야기: 대체될 수 없는 자식클래스?

상속 구조를 통해 코드는 훨씬 유연해졌다. 하지만 상속을 '올바르게' 사용하는 것은 또 다른 문제다. 만약 '뜨거운 음료'처럼 특별한 동작을 하는 하위 클래스가 부모 클래스인 `Item`을 완벽히 대체하지 못한다면 어떻게 될까?

다음 포스팅에서는 __리스코프 치환 원칙(LSP)__ 을 통해 상속을 올바르게 사용하는 법을 알아보자.

---
- [[SOLID 원칙 정복기] 1편: 첫걸음, 거대한 클래스 만들기](https://yseek.github.io/yun-blog/posts/solid-vending-machine-1)
- [[SOLID 원칙 정복기] 2편: 단일 책임 원칙(SRP)으로 클래스 분리하기](https://yseek.github.io/yun-blog/posts/solid-vending-machine-2)  
...
- [[SOLID 원칙 정복기] 4편: 그 상속, 정말 괜찮을까? (LSP)](https://yseek.github.io/yun-blog/posts/solid-vending-machine-4)
- [[SOLID 원칙 정복기] 5편: 고객님, 여긴 관리자 구역입니다 (ISP)](https://yseek.github.io/yun-blog/posts/solid-vending-machine-5)
---
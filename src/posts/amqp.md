---
title: 'AMQP란? RabbitMQ를 이해하기 위한 필수 프로토콜'
date: '2025-07-09 15:07'
tags: ['Message Queue', 'Protocol']
---

**메시지 큐(Message Queue: MQ)** 관련 공부를 하던 중 마주친 생소한 키워드라 따로 정리해본다. 약자에서 알 수 있듯이, **AMQP(Advanced Message Queuing Protocol)** 는 말 그대로 '통신 규약(프로토콜)'이다. 우리가 자주 접하는 **HTTP** 규약처럼, 메시지 큐 시스템들이 서로 소통하기 위해 만들어진 **'메시지 세계의 표준 규격** 이다.

## AMQP의 핵심 역할: "중개"

AMQP의 가장 중요한 역할은 메시지를 보내는 프로그램(생산자)과 메시지를 받는 프로그램(소비자) 사이의 의존성을 없애는 것이다.

- **만약 AMQP가 없다면?** 생산자는 소비자의 주소(IP), 상태(실행 중인지?), 언어 등을 모두 알아야 직접 메시지를 보낼 수 있다. 소비자에 변경이 생기면 생산자 코드도 바꿔야한다.
- **AMQP가 있다면?** 생산자는 Broker에 정해진 양식(AMQP)로 Message를 보내기만 하면 된다. 소비자는 Broker를 통해 Message를 받기만 하면 된다. 둘은 서로를 몰라도 된다.

## AMQP 구성 요소

- **생산자 (Producer)**: 메시지를 만들어 보내는 주체
- **교환기 (Exchange)**: 생산자에게 메시지를 받아, 어떤 큐로 보낼지 결정하는 routing 센터
- **바인딩 (Binding)**: 교환기와 큐를 연결하는 규칙
- **큐 (Queue)**: 메시지가 소비자에게 전달되기 전까지 안전하게 보관되는 대기열
- **브로커 (Broker)**: AMQP 프로토콜을 구현한 중앙 시스템. `RabbitMQ`가 바로 이 역할을 하는 대표적인 소프트웨어다. 
- **소비자 (Consumer)**: 큐에서 메시지를 가져와 처리하는 주체

![AMQP의 전체적인 메시지 흐름도](../images/amqp/amqp-diagram.png)

## 전체 메시지 흐름

1. 발행(Publish): `Producer`가 메시지에 특정 주소 정보(Routing Key)를 붙여 `Exchange`로 보낸다.
2. 라우팅(Routing): `Exchange`는 메시지의 Routing Key를 확인하고, 자신에게 설정된 `Binding` 규칙에 따라 메시지를 어떤 `Queue`로 보낼지 결정한다.
3. 저장(Queueing): 메시지는 결정된 `Queue`로 전달되어 `Consumer`에 전달 되기 전까지 안전하게 대기한다.
4. 소비(Consume): `Consumer`는 `Queue`를 통해 메시지를 받아 처리한 후, 잘 처리 되었다는 **응답(Acknowledgement)** 을 `Broker`에게 보낸다. (이 응답을 통해 메시지의 신뢰성 있는 처리가 보장)

결론적으로 **AMQP는 특정 제품이 아니라, RabbitMQ 같은 메시지 브로커들이 안정적인 메시지 전달이라는 목표를 달성하기 위해 따르는 '설계도'이자 '통신 규약'** 이다.
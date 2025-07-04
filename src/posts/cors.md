---
title: 'CORS란 무엇인가'
date: '2025-07-03 13:09'
tags: ['HTTP', 'CORS', '웹 보안', 'API']
---

**CORS (Cross-Origin Resource Sharing)** :

> 웹 브라우저가 **다른 출처(origin)** 에 있는 리소스를 요청할 수 있도록 서버가 명시적으로 허용하는 메커니즘

## "다른 출처(origin)"이란?

- **출처(origin)** 는 아래 3가지 요소로 정의:

```text
출처 = 프로토콜 + 도메인 + 포트
```

예:

| 주소                                                | 출처 같음?          |
| -------------------------------------------------- | ----------          |
| `http://localhost:3000` vs `http://localhost:8080` | ❌ 포트 다름        |
| `https://abc.com` vs `http://abc.com`              | ❌ 프로토콜 다름     |
| `http://abc.com` vs `http://api.abc.com`           | ❌ 서브도메인 다름   |

## 왜 CORS가 필요할까?

브라우저는 기본적으로 **보안을 위해 다른 출처에 요청을 제한**

```javascript
fetch("<http://api.otherdomain.com/data>");
```

이 요청은 **브라우저 보안 정책(Same-Origin Policy)에 따라 차단**

이걸 허용하려면 서버가 **CORS 허용 설정** 필요

## CORS의 동작 원리

### 상황: `http://localhost:3000`에서 `http://localhost:8080/api`로 요청

### 1. 브라우저가 서버에 **OPTIONS** 요청을 먼저 보냄 (Preflight 요청)

```text
OPTIONS /api
Origin: <http://localhost:3000>
Access-Control-Request-Method: GET
Access-Control-Request-Headers: Authorizatio
```

### 2. 서버가 **CORS 허용 응답**을 보내야 함

```text
HTTP/1.1 200 OK
Access-Control-Allow-Origin: <http://localhost:3000>
Access-Control-Allow-Methods: GET, POST, OPTIONS
Access-Control-Allow-Headers: Authorization
Access-Control-Allow-Credentials: true
```

### 3. 브라우저가 본 요청을 실제로 보냄

## 브라우저가 요구하는 CORS 응답 헤더들

|헤더|설명|
|---|---|
|`Access-Control-Allow-Origin`|허용할 출처|
|`Access-Control-Allow-Methods`|허용할 HTTP 메서드|
|`Access-Control-Allow-Headers`|클라이언트가 요청에 사용할 헤더들|
|`Access-Control-Allow-Credentials`|쿠키나 인증정보 포함 허용 여부|

## CORS 오류는 어디서 발생하나?

서버가 응답을 했어도, **CORS 헤더가 없으면 브라우저가 막아버림**

예:

```text
Access to fetch at '<http://localhost:8080/chat>' from origin '<http://localhost:3000>' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## 추가 참고

- CORS는 **브라우저에서만 적용** 됨 (서버 → 서버 요청에는 해당 없음)
- Postman, curl에서는 **CORS 검사 안 함**
- REST API를 분리할 경우, 반드시 CORS 고려 필요

## 정리

| 개념      | 설명                             |
| ------- | ------------------------------ |
| CORS    | 브라우저가 다른 출처의 요청을 막는 기본 보안 정책   |
| 해결      | 서버가 특정 출처, 메서드, 헤더 등을 명시적으로 허용 |
| 브라우저 역할 | OPTIONS 요청 후, 허용 안 되면 요청 자체 차단 |
| 프론트 확인  | 네트워크 탭에서 요청/응답 헤더 꼭 확인         |

---
title: 'CORS의 늪: 왜 form.submit()은 되는데 AJAX 요청은 실패할까?'
date: '2025-07-31 17:43'
tags: ['HTTP', 'CORS']
---

레거시 시스템에 드래그 앤 드롭 파일 업로드 기능을 추가하다가 반나절을 꼬박 헤맸던 CORS 이슈에 대해 이야기해 보려고 한다. 분명 똑같이 서버로 `POST`요청을 보내는데, 왜 기존 방식은 되고 새로운 방식은 안되는 걸까?

## 이상한 CORS 오류

기존 시스템은 보이지 않는 `<iframe>`을 `target`으로 삼아 `form.submit()`을 호출하는 방식으로 파일을 업로드하고 있었다. 이 방식은 아무 문제 없이 잘 동작했다.

여기에 드래그 앤 드롭 기능을 추가하기 위해, `XMLHttpRequest`(AJAX)를 사용하여 파일을 비동기적으로 전송하는 코드를 작성했다. 그런데 테스트를 해보니 파일은 서버에 정상적으로 도착하는데, 브라우저에서는 `onerror` 이벤트가 발생하며 서버의 응답을 전혀 받지 못하는 기이한 현상이 발생했다. 콘솔에는 바로 그 **CORS 오류**가 찍혀있었다.

> 아니, form.submit()도 결국 POST 요청인데 왜 이건 되고, 똑같은 POST 요청인 XMLHttpRequest는 CORS 오류가 나는 걸까?

## 전통적인 방식: `form.submit()`과 `<iframe>`

먼저 잘 되던 기존 방식의 원리다.

```html
<form name="uploadForm" action="http://file.server.com/upload" target="hiddenIframe" method="post">
    <input type="file" name="file1">
</form>
<iframe name="hiddenIframe" style="display:none;"></iframe>

<script>
    document.uploadForm.submit();
</script>
```

이 방식은 브라우저의 아주 오래된 기본 동작을 이용한다.

* `form.submit()`이 호출되면, 브라우저는 이 동작을 **페이지 이동(Navigation)** 으로 간주한다.
* `target`이 `iframe`으로 지정되어 있으므로, 새로운 페이지로 이동하는 대신 `iframe` 안에서 페이지가 로드된다.
* 서버의 응답은 `iframe` 내부에 로드되고, 그 안의 스크립트(`parent.addTR()`)가 부모창을 조작한다.

여기서 중요한 점은, 브라우저는 이 전체 과정을 **스크립트가 데이터를 요청하는 것이 아니라, 문서가 다른 문서를 불러오는 행위**로 본다는 것이다. 따라서 여기에는 엄격한 CORS 보안 정책이 적용되지 않는다. 

## 현대적인 방식: `XMLHttpRequest`(AJAX)와 CORS

문제가 발생한 새로운 방식이다.

```js
var xhr = new XMLHttpRequest();
var formData = new FormData();
formData.append('file1', myFile);

xhr.open('POST', 'http://file.server.com/upload', true);
xhr.send(formData); // CORS 오류 발생 지점
```

이 코드는 자바스크립트가 다른 도메인(`http://file.server.com`)의 자원(Resource)을 요청하는 방식이다.

브라우저는 이 행위를 "스크립트가 내 허락 없이 다른 집의 정보를 빼내오려는 시도"로 보고, 아주 엄격한 **동일 출처 정책(Same-Origin Policy)** 을 적용한다. 이 정책의 예외를 허용해주는 메커니즘이 바로 **CORS(Cross-Origin Resource Sharing)** 이다.

파일 업로드와 같은 '단순하지 않은 요청(Non-Simple Request)'의 경우, 브라우저는 실제 데이터(POST)를 보내기 전에 먼저 OPTIONS라는 메서드로 "지금 요청 보내도 괜찮아?"라고 서버에 허락을 구하는 **사전 요청(Preflight Request)** 을 보낸다.

이때 서버가 응답 헤더에 Access-Control-Allow-Origin과 같은 허가증을 보내주지 않으면, 브라우저는 요청을 위험한 것으로 간주하고 차단해 버린다. 이것이 바로 내가 겪은 onerror의 원인이었다.

## 결정적 차이: 요청의 주체 (문서 vs 스크립트)

| 항목 | `form.submit()` (to `iframe`) | `xhr.send()` (AJAX) |
| :--- | :--- | :--- |
| **요청 주체** | **문서(Document)** | **스크립트(Script)** |
| **동작 방식** | 페이지 이동과 유사 | 데이터 요청 |
| **CORS 적용** | **적용되지 않음** | **엄격하게 적용됨** |

결국, `submit`은 브라우저의 전통적인 '문서'기능이라 CORS를 우회하는 효과가 있었고, `XMLHttpRequest`는 '스크립트'기능이라 CORS 보안 정책의 직접적인 대상이 되었던 것이다.

## 결론

클라이언트 측에서 아무리 다른 방법을 시도해도 문제는 해결되지 않았다. IE11의 기술적 한계까지 겹쳐 `iframe`을 동적으로 생성하는 방법도 실패했다.

결론은 드래그 앤 드롭 같은 기능을 구현하려면 `XMLHttpRequest`를 사용해야 하고, 이를 위해서는 반드시 서버에서 CORS 헤더를 추가해주는 조치가 필요하다는 것이었다.

혹시 나처럼 레거시 환경에서 CORS의 늪에 빠진 분이 있다면, 클라이언트 측 코드만 파고들기보다는 요청의 주체가 무엇인지, 그리고 서버의 응답 헤더는 어떻게 오고 있는지 먼저 확인해 보길 바란다.
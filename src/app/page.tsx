import Image from "next/image";

export default function Home() {
  return (
    // article 태그에 prose 클래스를 적용하여 내부의 HTML 요소들에 자동으로 스타일을 입힙니다.
    // dark:prose-invert는 다크 모드일 때 글자색 등을 반전시켜주는 마법 같은 클래스입니다.
    <article className="prose dark:prose-invert">
      <h1>테스트 페이지입니다</h1>
      <p>
        이 페이지는 새로운 경로를 만들고 스타일을 확인하기 위해 만들어졌습니다.
        Tailwind CSS Typography 플러그인이 잘 작동한다면, 이 문단은 넉넉한
        여백과 함께 가독성 좋게 보여야 합니다.
      </p>
      
      <h2>주요 확인 사항</h2>
      <ul>
        <li>전체적인 레이아웃이 중앙에 잘 위치하는가?</li>
        <li>다크 모드 토글이 있다면 잘 작동하는가?</li>
        <li>아래 코드 블록의 스타일이 예쁘게 적용되는가?</li>
      </ul>

      <p>
        인라인 코드는 <code>이렇게</code> 보입니다.
      </p>
      
      <pre>
        <code>
          {`function HelloWorld() {
            console.log("Hello, World!");
          }`}
        </code>
      </pre>

      <p>
        모든 스타일이 의도대로 보인다면, 블로그를 만들 준비가 모두 끝난 것입니다!
      </p>
    </article>
  );
}

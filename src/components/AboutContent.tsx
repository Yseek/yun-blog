import Image from 'next/image';

export function AboutContent() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-16 flex flex-col md:flex-row items-center md:items-start space-y-8 md:space-y-0 md:space-x-12">
          <div className="md:w-2/3">
            <h2 className="text-3xl font-bold text-primary mb-4">안녕하세요, Yun입니다.</h2>
            <div className="prose dark:prose-invert max-w-none text-lg">
              <p>
                저는 웹 기술을 탐구하고 새로운 것을 만들어내는 것을 좋아합니다.
                특히 React와 Next.js 생태계에 깊은 관심을 가지고 있으며,
                사용자에게 더 나은 경험을 제공하는 인터랙티브한 웹 애플리케이션을 만드는 데 집중하고 있습니다.
              </p>
              <p>
                이 블로그는 제가 학습한 내용, 개발 과정에서 겪었던 문제와 해결 과정,
                그리고 개인적인 생각들을 공유하기 위해 만들어졌습니다.
                이 공간을 통해 다른 개발자분들과 지식을 나누고 함께 성장하고 싶습니다.
              </p>
              <h3 className="text-2xl font-bold mt-8 mb-4">기술 스택</h3>
              <ul className="list-disc list-inside">
                <li><strong>Languages:</strong> TypeScript, JavaScript</li>
                <li><strong>Frontend:</strong> Next.js, React, Tailwind CSS</li>
                <li><strong>Backend:</strong> Node.js, Express</li>
                <li><strong>DevOps:</strong> Docker, GitHub Actions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
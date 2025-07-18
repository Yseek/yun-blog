import Link from 'next/link';
import Image from 'next/image';
import profileImage from '../../public/images/profile/profile.png';

export function ProfileCard() {
  return (
    <div className="py-12 flex flex-row items-center text-left">
      <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg mr-8 flex-shrink-0">
        <Image
          src={profileImage}
          alt="Profile Picture"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div>
        <h1 className="text-3xl font-bold">Yun</h1>
        <p className="mt-2 text-muted-foreground">
          끊임없이 배우고 성장하는 것을 즐기는 개발자입니다.
        </p>
        <div className="mt-4 flex items-center space-x-4">
          <Link href="https://github.com/yseek" target="_blank" aria-label="GitHub profile" className="text-muted-foreground hover:text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </Link>
          <Link href="mailto:yun5003@naver.com" aria-label="Email" className="text-muted-foreground hover:text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="20" height="16" x="2" y="4" rx="2"></rect>
              <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
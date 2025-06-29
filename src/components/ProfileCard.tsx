import Link from 'next/link';
import Image from 'next/image';

export function ProfileCard() {
  return (
    <div className="py-12 flex flex-col items-center text-center">
      <div className="relative w-32 h-32 rounded-full overflow-hidden shadow-lg mb-4">
        <Image
          src="https://via.placeholder.com/150" // 나중에 본인의 프로필 이미지로 교체하세요.
          alt="Profile Picture"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <h1 className="text-3xl font-bold">Yun</h1>
      <p className="mt-2 text-muted-foreground">
        끊임없이 배우고 성장하는 것을 즐기는 개발자입니다.
      </p>
      <div className="mt-4 flex space-x-4">
        <Link href="https://github.com/yseek" target="_blank" className="text-muted-foreground hover:text-primary">
          GitHub
        </Link>
        <Link href="mailto:yun5003@naver.com" className="text-muted-foreground hover:text-primary">
          Email
        </Link>
      </div>
    </div>
  );
}
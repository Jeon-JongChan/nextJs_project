import Image from "next/image";
import Link from "next/link";
import MainSlide from "./MainSlide";
import MainLoginForm from "./MainLoginForm";
import MainAudioPlayer from "./MainAudioPlayer";

export default function Home() {
  return (
    <>
      <div className="grid grid-cols-6" style={{height: "400px"}}>
        <div className="login col-span-2 max-h-full mr-4" style={{height: "inherit"}}>
          <div className="img-login-bg max-h-full flex flex-col items-center">
            {/* 로고 */}
            <div className="text-white w-full py-4 px-28 " style={{height: "248px"}}>
              <div className="relative w-full h-3/4 top-10">
                <Image src="/images/home/01_butterfly.webp" alt="login logo" fill={true} />
              </div>
              {/* <img src="https://via.placeholder.com/300x300?text=login" alt="로고" className="w-full max-h-full" /> */}
            </div>
            {/* 로그인 폼 */}
            <MainLoginForm />
          </div>
        </div>
        <div className="col-span-4 max-h-full" style={{height: "inherit"}}>
          <MainSlide />
        </div>
      </div>
      <div className="grid grid-cols-6  w-full mt-8" style={{height: "400px"}}>
        <div className="col-span-2 mr-4 px-2">
          <MainAudioPlayer />
        </div>
        <div className="col-span-4 grid grid-cols-3 gap-x-3">
          <Link className="col-span-1 relative main-button" href="/main">
            <Image src="/images/home/01_home_button01.png" alt="Shineseeker" fill={true} />
          </Link>
          <Link className="col-span-1 relative main-button" href="/main">
            <Image src="/images/home/01_home_button02.png" alt="Shineseeker" fill={true} />
          </Link>
          <Link className="col-span-1 relative main-button" href="/main">
            <Image src="/images/home/01_home_button03.png" alt="Shineseeker" fill={true} />
          </Link>
        </div>
      </div>
    </>
  );
}

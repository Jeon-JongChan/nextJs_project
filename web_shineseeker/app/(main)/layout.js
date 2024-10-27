// import {Inter} from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import BackgroundCanvas from "/_custom/components/BackgroundCanvas";

// const inter = Inter({subsets: ["latin"]});

export const metadata = {
  title: "Shineseeker",
  description: "Lee ju eun's community website.",
};

const navSize = " ";

export default function Layout({children}) {
  const linkStyle = "text-white hover:text-gray-300 px-3 pb-2 pt-8 top-1 col-span-1 text-center relative img-nav-btn-init hover:text-[#806FAF] focus:text-[#806FAF]";
  return (
    <>
      <div className="flex flex-col justify-center p-10 items-center h-screen img-home-bg">
        <main className="relative flex flex-col items-center justify-between p-24 img-home-frame-bg" style={{width: "1051px", height: "560px", zIndex: "2"}}>
          <nav className="relative w-full flex flex-row justify-center" style={{width: "1021px", height: "59px"}}>
            <div className="relative inline-block w-fit" style={{minWidth: "282px", bottom: "16px"}}>
              <Link href="/main" className="block relative w-full h-full">
                <Image src="/images/home/01_home_title_homebutton.png" width={282} height={53} />
              </Link>
            </div>
            <div className="relative grid grid-cols-5 items-center gap-x-4 img-nav-bg" style={{minWidth: "687px"}}>
              <div className="relative col-span-5 grid grid-cols-5 items-center gap-x-1" style={{top: "-18px", fontSize: "18px"}}>
                <Link href="/world" className={linkStyle + navSize}>
                  세계관
                </Link>
                <Link href="/read" className={linkStyle + navSize}>
                  필독
                </Link>
                <Link href="/member" className={linkStyle + navSize}>
                  멤버란
                </Link>
                <Link href="/battle" className={linkStyle + navSize}>
                  샤인시커
                </Link>
                <Link href="/market" className={linkStyle + navSize}>
                  교환소
                </Link>
              </div>
            </div>
          </nav>
          {children}
        </main>
        <BackgroundCanvas objCount="20" />
      </div>
    </>
  );
}

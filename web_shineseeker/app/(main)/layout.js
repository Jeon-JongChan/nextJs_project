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
  const linkStyle = "text-white hover:text-gray-300 px-3 pb-2 pt-8 top-1 col-span-1 text-center relative img-nav-btn-init ";
  return (
    <>
      <div className="flex flex-col justify-center p-10 items-center h-screen img-home-bg">
        <main className="flex flex-col items-center justify-between p-24 img-home-frame-bg" style={{width: "1600px", height: "900px", zIndex: "2"}}>
          <nav className="p-4 mb-8 w-full flex flex-row relative">
            <div className="inline-block relative w-1/3 h-[79px] t-[-10px]">
              <Link href="/main" className="block relative w-full h-full">
                <Image src="/images/home/01_home_title_homebutton.png" fill={true} />
              </Link>
            </div>
            <div className="grid grid-cols-5 items-center gap-x-4 img-nav-bg relative w-[1028px] h-[86px] px-4 top-[-4px]">
              <div className="col-span-5 grid grid-cols-5 items-center gap-x-3 relative" style={{top: "-5px"}}>
                <Link href="/world" className={linkStyle + "img-nav-world" + navSize}></Link>
                <Link href="/read" className={linkStyle + "img-nav-read" + navSize}></Link>
                <Link href="/member" className={linkStyle + "img-nav-member" + navSize}></Link>
                <Link href="/battle" className={linkStyle + "img-nav-shineseek" + navSize}></Link>
                <Link href="/market" className={linkStyle + "img-nav-shop" + navSize}></Link>
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

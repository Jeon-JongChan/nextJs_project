// import {Inter} from "next/font/google";
import Image from "next/image";
import BackgroundCanvas from "/_custom/components/BackgroundCanvas";
import Nav from "./Nav";
import Link from "next/link";

// const inter = Inter({subsets: ["latin"]});

export const metadata = {
  title: "Shineseeker",
  description: "Lee ju eun's community website.",
};

export default function Layout({children}) {
  return (
    <>
      <div className="flex flex-col justify-center p-10 items-center h-screen img-home-bg">
        <main className="relative flex flex-col items-center justify-between p-12 img-home-frame-bg" style={{width: "1051px", height: "560px", zIndex: "2"}}>
          <nav className="relative w-full flex flex-row justify-center" style={{width: "1021px", height: "59px"}}>
            <div className="relative inline-block w-fit" style={{minWidth: "282px", bottom: "16px"}}>
              <Link href="/main" className="block relative w-full h-full">
                <Image src="/images/home/01_home_title_homebutton.png" width={282} height={53} />
              </Link>
            </div>
            <Nav />
          </nav>
          {children}
        </main>
        <BackgroundCanvas objCount="20" />
      </div>
    </>
  );
}

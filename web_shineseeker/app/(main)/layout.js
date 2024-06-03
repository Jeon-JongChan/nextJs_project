import {Inter} from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import BackgroundCanvas from "/_custom/components/BackgroundCanvas";

const inter = Inter({subsets: ["latin"]});

export const metadata = {
  title: "Shineseeker",
  description: "Lee ju eun's community website.",
};

export default function Layout({children}) {
  const linkStyle = "text-white hover:text-gray-300 px-3 pb-2 pt-8 top-1 col-span-1 text-center relative img-nav-btn-init ";
  return (
    <>
      <div className="flex flex-col justify-center p-10 items-center h-screen img-home-bg">
        <main className="flex flex-col items-center justify-between p-24 img-home-frame-bg" style={{width: "1600px", height: "900px", zIndex: "2"}}>
          <nav className="block p-4 mb-8 w-full img-nav-bg">
            <div className="grid grid-cols-6 items-center gap-x-4">
              <Link href="/main" className="col-span-2"></Link>
              <div className="col-span-4 grid grid-cols-5 items-center gap-x-5">
                <Link href="/world" className={linkStyle + "img-nav-world"}></Link>
                <Link href="/read" className={linkStyle + "img-nav-read"}></Link>
                <Link href="/member" className={linkStyle + "img-nav-member"}></Link>
                <Link href="/battle" className={linkStyle + "img-nav-shineseek"}></Link>
                <Link href="/market" className={linkStyle + "img-nav-shop"}></Link>
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

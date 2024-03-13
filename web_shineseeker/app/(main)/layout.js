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
  return (
    <>
      <div className="flex flex-col justify-center p-10 items-center h-screen">
        <main className="flex min-h-screen flex-col items-center justify-between p-24" style={{width: "1600px", height: "900px"}}>
          <nav className="block bg-gray-800 p-4 mb-8 w-full">
            <div className="grid grid-cols-6 items-center gap-x-4">
              <Link href="/main">
                <Image src="https://via.placeholder.com/800x400?text=Slide%201" alt="Shineseeker" width={100} height={50} />
              </Link>
              <Link href="/intro" className="text-white hover:text-gray-300 px-3 py-2 col-span-1">
                세계관
              </Link>
              <Link href="/require" className="text-white hover:text-gray-300 px-3 py-2 col-span-1">
                필독
              </Link>
              <Link href="/member" className="text-white hover:text-gray-300 px-3 py-2 col-span-1">
                멤버란
              </Link>
              <Link href="/battle" className="text-white hover:text-gray-300 px-3 py-2 col-span-1">
                전투
              </Link>
              <Link href="/market" className="text-white hover:text-gray-300 px-3 py-2 col-span-1">
                상점
              </Link>
            </div>
          </nav>
          {children}
        </main>
        <BackgroundCanvas objCount="20" />
      </div>
    </>
  );
}

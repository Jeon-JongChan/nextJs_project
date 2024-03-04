import {Inter} from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const inter = Inter({subsets: ["latin"]});

export const metadata = {
  title: "Shineseeker",
  description: "Lee ju eun's community website.",
};

export default function Layout({children}) {
  return (
    <>
      <nav className="bg-gray-800 p-4">
        <div className="grid grid-cols-6 items-center gap-x-4">
          <Image src="https://via.placeholder.com/800x400?text=Slide%201" alt="Shineseeker" width={100} height={50} />
          <Link href="/intro" className="text-white hover:text-gray-300 px-3 py-2 col-span-1">
            세계관
          </Link>
          <Link href="/require" className="text-white hover:text-gray-300 px-3 py-2 col-span-1">
            필독
          </Link>
          <Link href="/member" className="text-white hover:text-gray-300 px-3 py-2 col-span-1">
            멤버란
          </Link>
          <Link href="/raid" className="text-white hover:text-gray-300 px-3 py-2 col-span-1">
            전투
          </Link>
          <Link href="/market" className="text-white hover:text-gray-300 px-3 py-2 col-span-1">
            상점
          </Link>
        </div>
      </nav>
      {children}
    </>
  );
}

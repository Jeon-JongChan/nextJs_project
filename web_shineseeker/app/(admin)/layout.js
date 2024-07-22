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
      <div className="flex flex-col justify-center p-10 items-center h-screen">
        <main className="flex flex-col items-center justify-between p-24">{children}</main>
      </div>
    </>
  );
}

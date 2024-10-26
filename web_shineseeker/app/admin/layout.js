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
      <main>
        <div className="flex flex-col justify-center p-2 items-center h-fit">
          <div className="flex flex-col items-center justify-between p-2 w-full h-fit">{children}</div>
        </div>
      </main>
    </>
  );
}

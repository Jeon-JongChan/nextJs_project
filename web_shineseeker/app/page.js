import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import imgTitle from "/public/images/00_title.png";
import imgTitleCircle1 from "/public/images/00_title_circle1.png";
import imgTitleCircle2 from "/public/images/00_title_circle2.png";
import imgTitleCircle3 from "/public/images/00_title_circle3.png";
import imgTitleCircle4 from "/public/images/00_title_circle4.png";

export default function Home() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center p-24" style={{backgroundImage: "url('/images/00_title_bg.png')"}}>
      <div className="w-full flex justify-center">
        <div className="w-9/12 h-9/12">
          <Link href="/main" className="relative w-full flex justify-center items-center">
            <Image src={imgTitle} className="absolute z-50 rotating-right-5" />
            <Image src={imgTitleCircle1} className="relative z-40 rotating-right-10 title-circle-1" />
            <Image src={imgTitleCircle2} className="absolute z-30 rotating-right-20" />
            <Image src={imgTitleCircle3} className="absolute z-20 rotating-left-10" />
            <Image src={imgTitleCircle4} className="absolute z-10 rotating-right-20" />
          </Link>
        </div>
      </div>
    </main>
  );
}

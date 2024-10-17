import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import imgTitle from "/public/images/_redraw/00_title.webp";
import imgTitleCircle1 from "/public/images/00_title_circle1.png";
import imgTitleCircle2 from "/public/images/00_title_circle2.png";
import imgTitleCircle3 from "/public/images/00_title_circle3.png";
import imgTitleCircle4 from "/public/images/00_title_circle4.png";

export default function Home() {
    return (
        <main className="init-main flex h-screen flex-col items-center justify-center p-24" style={{backgroundImage: "url('/images/_redraw/00_title_bg.webp')"}}>
            <Link href="/main" className="max-w-full flex justify-center items-center">
                <div className="fixed flex justify-center items-center h-screen z-50">
                    <Image src={imgTitle} alt={"로고"} className="max-w-fit" style={{width: "30vw"}} />
                </div>
                <div className="relative init-title">
                    <Image src={imgTitleCircle1} alt={"로고 회전1"} className="absolute z-40 rotating-right-10 title-circle-1" style={{width: "12vw"}} />
                </div>

                <Image src={imgTitleCircle2} alt={"로고 회전2"} className="fixed z-30 rotating-right-20" style={{width: "23vw"}} />
                <Image src={imgTitleCircle3} alt={"로고 회전3"} className="fixed z-20 rotating-left-10" style={{width: "25vw"}} />
                <Image src={imgTitleCircle4} alt={"로고 회전4"} className="fixed z-10 rotating-right-20" style={{width: "36vw"}} />
            </Link>
        </main>
    );
}

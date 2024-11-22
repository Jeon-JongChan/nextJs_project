"use client";
// import {Inter} from "next/font/google";
import {usePathname} from "next/navigation";

// const inter = Inter({subsets: ["latin"]});

export default function Layout({children}) {
  const pathname = usePathname();

  return (
    <>
      <div className="flex flex-col justify-center p-10 items-center h-screen img-raid-bg">
        <main className="relative flex flex-col items-center justify-between p-12" style={{width: "1051px", height: "560px", zIndex: "2"}}>
          {children}
        </main>
      </div>
    </>
  );
}

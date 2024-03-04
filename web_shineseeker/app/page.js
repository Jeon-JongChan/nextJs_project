import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Link href="/main">
        <svg height="100%" width="100%">
          <defs>
            <filter x="-18" y="-18" width="323" height="295" filterUnits="userSpaceOnUse" id="comp-lsswp8ga-shadow_comp-lsswp8ga" colorInterpolationFilters="sRGB">
              <feComponentTransfer result="srcRGB"></feComponentTransfer>
              <feGaussianBlur stdDeviation="6" in="SourceAlpha"></feGaussianBlur>
              <feOffset dx="0" dy="0"></feOffset>
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 1
0 0 0 0 0.5098039215686274
0 0 0 0 0.9725490196078431
0 0 0 0.82 0"
              ></feColorMatrix>
              <feMerge>
                <feMergeNode></feMergeNode>
                <feMergeNode in="SourceGraphic"></feMergeNode>
              </feMerge>
              <feComponentTransfer></feComponentTransfer>
            </filter>
          </defs>
          <g filter="url(#comp-lsswp8ga-shadow_comp-lsswp8ga)">
            <svg
              preserveAspectRatio="none"
              data-bbox="20.5 28.5 159 143"
              viewBox="20.5 28.5 159 143"
              height="100%"
              width="100%"
              xmlns="http://www.w3.org/2000/svg"
              data-type="shape"
              role="presentation"
              aria-hidden="true"
              aria-label=""
            >
              <g>
                <path d="M166.655 38.469c-9.299-7.81-18.359-9.983-30.39-9.969-12.771 1.106-23.826 7.345-36.266 23.11C87.56 35.845 76.505 29.606 63.734 28.5c-12.031-.014-21.092 2.159-30.391 9.969C27.331 43.52 20.5 56.93 20.5 69.71c.16 25.712 18.072 64.364 76.958 100.312l2.431 1.478.111-.066.111.066 2.431-1.478c58.886-35.948 76.798-74.6 76.958-100.312 0-12.78-6.832-26.19-12.845-31.241z"></path>
              </g>
            </svg>
          </g>
        </svg>
        {/* <Image className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert" src="/next.svg" alt="Next.js Logo" width={180} height={37} priority /> */}
      </Link>
    </main>
  );
}

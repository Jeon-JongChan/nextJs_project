import {Inter} from "next/font/google";
import "./globals.css";
const inter = Inter({subsets: ["latin"]});
/*
export const metadata = {
  title: "Shineseeker",
  description: "Lee ju eun's community website.",
};
*/
export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <div className="fixed bottom-2 right-0 bg-orange-100 p-4 border-t border-gray-300" style={{width: "30vw", height: "30vw"}}>
          <h3>개발 중 노트</h3>
          {/* prettier-ignore */}
          <p>
          <span>현재 멤버 상세 페이지 개발중 <br /></span>
          <span>- 스탯페이지 프레임 구현<br /></span>
          <span>- 인벤토리 프레임 구현 중<br /></span>
        </p>
        </div>
      </body>
    </html>
  );
}

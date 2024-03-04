import {Inter} from "next/font/google";
import "./globals.css";
import BackgroundCanvas from "/_custom/components/BackgroundCanvas";
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
        <BackgroundCanvas objCount="20" />
        {children}
      </body>
    </html>
  );
}

import {Inter} from "next/font/google";
import "./globals.css";
import DevelopModal from "/_custom/components/DevelopModal";
const inter = Inter({subsets: ["latin"]});

export const metadata = {
  title: "Shineseeker",
  description: "Lee ju eun's community website.",
};

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <DevelopModal />
      </body>
    </html>
  );
}

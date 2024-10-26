// import {Inter} from "next/font/google";
import "./globals.css";
import DevelopModal from "/_custom/components/_common/DevelopModal";
import {AuthProvider} from "./AuthContext";
const inter = Inter({subsets: ["latin"]});

export const metadata = {
  title: "Shineseeker",
  description: "Lee ju eun's community website.",
};

export default function RootLayout({children}) {
  return (
    <html lang="en">
      {/* <body className={inter.className}> */}
      <body className="font-dnf">
        <AuthProvider>{children}</AuthProvider>
        <DevelopModal />
      </body>
    </html>
  );
}

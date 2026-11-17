import "./globals.css";
import { Geist } from "next/font/google";
import FloatingHeaderControls from "../components/FloatingHeaderControls";
import ToTopButton from "../components/ToTopButton";
import AiChatWidget from "@/components/AiChatWidget";

export const metadata = {
  title: "Gachaverse.id",
  description: "Komunitas game gacha Indonesia",
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="bg-black">
      <body className={`${geist.className} antialiased text-white selection:bg-blue-600 selection:text-white`}>
        <FloatingHeaderControls hideOnHome={true} containerMax="max-w-6xl" topOffsetRem={1.5} />
        {children}
        <ToTopButton threshold={400} />
        <AiChatWidget />
      </body>
    </html>
  );
}
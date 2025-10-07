// app/layout.js
import "./globals.css";
import { Poppins } from "next/font/google";
import FloatingHeaderControls from "../components/FloatingHeaderControls";
import ToTopButton from "../components/ToTopButton"; // ← tambahkan ini

export const metadata = {
  title: "Gachaverse.id",
  description: "Komunitas game gacha Indonesia",
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="bg-black">
      <body className={`${poppins.className} antialiased text-white selection:bg-blue-600 selection:text-white`}>
        {/* Tombol back & home global */}
        <FloatingHeaderControls hideOnHome={true} containerMax="max-w-6xl" topOffsetRem={1.5} />

        {children}

        {/* To Top global untuk SEMUA halaman */}
        <ToTopButton threshold={400} />
        {/* jika perlu geser posisinya:
        <ToTopButton className="bottom-24 right-6 md:bottom-10" />
        */}
      </body>
    </html>
  );
}

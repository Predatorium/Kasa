import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Kasa",
    template: "%s | Kasa",
  },
  description: "...",
};

export default function RootLayout({ children }) {

  return (
    <html lang="fr" className={`${inter.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}

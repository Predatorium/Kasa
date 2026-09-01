import { Inter } from "next/font/google";
import "./globals.css";
import AppProviders from "@/contexts/AppProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Abricot",
    template: "%s | Abricot",
  },
  description: "...",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${inter.variable}`}>
      <body>
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  );
}

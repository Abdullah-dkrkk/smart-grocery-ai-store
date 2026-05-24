import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
})

export const metadata: Metadata = {
  title: "SmartGrocery — Design System",
  description: "SmartGrocery Design System — Brand guidelines, components, and patterns",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bricolageGrotesque.variable}`}>
      <body className="min-h-dvh flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}

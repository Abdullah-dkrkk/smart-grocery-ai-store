import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers"
import { LayoutWrapper } from "@/components/layout/layout-wrapper"

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
  title: "SmartGrocery — AI-Powered Grocery Store",
  description: "Fresh groceries delivered to your door. AI-powered recommendations, health profiles, and smart shopping.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${bricolageGrotesque.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh flex flex-col bg-background text-foreground">
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}

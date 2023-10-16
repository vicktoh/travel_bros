import { Header } from "@/components/common/Header";
import "./globals.css";
import Script from "next/script";
// import { Inter } from 'next/font/google'

// const inter = Inter({ subsets: ['latin'] })
import { Work_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
const wfont = Work_Sans({
  subsets: ["latin"],
  variable: "--font-wfont",
});
export const metadata = {
  title: "Travel Bros",
  description: "Experience, safe, convienient and luxurious road travel",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href="/images/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
      </head>
      <body className={`${wfont.className} overflow-x-hidden relative`}>
        {children}
        <Toaster />
      </body>
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-RRBWN49908"
      ></Script>
      <Script>
        {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-RRBWN49908');`}
      </Script>
    </html>
  );
}

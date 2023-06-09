import { Header } from '@/components/common/Header'
import './globals.css'
import Script from 'next/script'
// import { Inter } from 'next/font/google'

// const inter = Inter({ subsets: ['latin'] })
import {Work_Sans} from 'next/font/google'
const wfont = Work_Sans({
  subsets:['latin'],
  variable:'--font-wfont'
})
export const metadata = {
  title: 'TravleBros',
  description: 'Experience, safe, convienient and luxurious road travel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${wfont.className} overflow-x-hidden relative`}>
        <Header />
        {children}</body>
<Script async src="https://www.googletagmanager.com/gtag/js?id=G-RRBWN49908"></Script>
<Script>
  {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-RRBWN49908');`}
</Script>
    </html>
  )
}

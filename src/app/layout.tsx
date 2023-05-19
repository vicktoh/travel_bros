import { Header } from '@/components/common/Header'
import './globals.css'
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
      <body className={wfont.className}>
        <Header />
        {children}</body>
    </html>
  )
}

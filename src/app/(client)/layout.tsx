import { Header } from '@/components/common/Header'
import React, { FunctionComponent, ReactNode } from 'react'

export default function ClientLayout({children}: {children: ReactNode}) {
  return (
    <div className="flex flex-col">
        <Header />
        {children}
    </div>
  )
}

import React from 'react'
import { Button } from '../ui/button'
import { LucideBell } from 'lucide-react'

export default function TopNav() {
  return (
   <div className="flex flex-row sticky">
      <Button className='ml-auto' size="icon" ><LucideBell /></Button>
   </div>
  )
}

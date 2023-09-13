'use client'
import { Empty } from '@/components/drivers/empty-state'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React from 'react'

export default function HistoryPage() {
   
  return (
   <div className='flex flex-col px-1 lg:px-5'>

    <Card>
      <CardHeader>
         <CardTitle className='text-lg'>Trip history</CardTitle>
         <CardDescription>Find the details of all the trips you have been on</CardDescription>
      </CardHeader>
      <CardContent>
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Earned</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               <TableRow>
                  <TableHead colSpan={4}>
                     <Empty title='No trips yet' description='You do not have any trips yet!' />
                  </TableHead>
               </TableRow>
            </TableBody>
         </Table>
      </CardContent>
    </Card>
    </div>
  )
}

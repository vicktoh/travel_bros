'use client';
import { Empty } from '@/components/drivers/empty-state'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import React from 'react'

export default function HistoryPage() {
   
  return (
   <div className='flex flex-col px-1 lg:px-5'>

    <Card>
      <CardHeader>
         <CardTitle className='text-lg'>Payout History</CardTitle>
         <CardDescription>Here you will find all your earnings from trips you completed</CardDescription>
      </CardHeader>
      <CardContent>
         <Table>
            <TableHeader>
               <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Bank Name</TableHead>
                  <TableHead>Account Number</TableHead>
                  <TableHead>Amount</TableHead>
               </TableRow>
            </TableHeader>
            <TableBody>
               <TableRow>
                  <TableHead colSpan={4}>
                  <Empty title='No Payouts' description='You do not have any Payouts yet!' />
                     
                  </TableHead>
               </TableRow>
            </TableBody>
         </Table>
      </CardContent>
    </Card>
    </div>
  )
}

import { SeatInfo } from '@/types/Booking'
import { table } from 'console'
import React, { FC } from 'react'
type SelectedSeatsTableProps = {
   selectedSeats:  Record<string, SeatInfo | undefined>
}
export const SelectedSeatsTable: FC<SelectedSeatsTableProps> = ({selectedSeats}) => {
  return (
    <table className='border-collapse w-full'>
      <thead>
         <tr>
            <th className='font-bold text-sm text-primary text-left'>S/N</th>
            <th className='font-bold text-sm text-primary text-left'>Person</th>
            <th className='font-bold text-sm text-primary'>SeatNumber</th>
         </tr>
      </thead>
      <tbody>
         {
            Object.entries(selectedSeats).map(([key, value], i) => (
               <tr key={`seats-table-${key}`} className='py-3 border-b-primary-light border-b-[1px] text-black'>
                  <td className=''>{i+1}</td>
                  <td className='py-3'>
                     <div className="flex gap-2 flex-col">
                        <p className="text-base text-primary font-medium">{value?.name}</p>
                        <p className="text-xs text-slate-500">{value?.gender}</p>
                     </div>
                  </td>
                  <td className='text-center'>
                     <p className="text-base text-primary font-medium">{`Seat ${key}`}</p>
                  </td>
               </tr>
            ))
         }
      </tbody>
    </table>
  )
}

"use client"
import { useDriverStore } from '@/states/drivers'
import { Driver, DriverStatus, InfoStatus } from '@/types/Driver'
import { CheckCircle, LucideBadgeCheck, LucideCar, LucideCheckCheck, LucideClock2, LucideDollarSign, LucideMinusCircle, LucideStar } from 'lucide-react'
import React, { FunctionComponent, ReactNode, useMemo } from 'react'


const AccountStatusIcon: Record<DriverStatus, ReactNode> = {
   'active': <LucideBadgeCheck className='w-4 h-4 text-green-500' />,
   'onboarded': <LucideMinusCircle className='w-4 h-4 text-orange-300' />,
   'pending': <LucideClock2 className='w-4 h-4 text-orange-300' />,
   'completed': <LucideCheckCheck className='w-4 h-4 text-blue-400' />,
}
export const DashboardMatrix: FunctionComponent = () => {
  const {driver} = useDriverStore();
  const boxes = useMemo(() => {
   return [
      {
         title: "Account Status",
         icon:  AccountStatusIcon[driver?.status || "onboarded"],
         value: driver?.status || "onboarded",
      },
      {
         title: "Total Trips",
         icon: <LucideCar className='w-4 h-4' />,
         value: driver?.totalTrips || 0,
      },
      {
         title: "Total Earned",
         icon: <LucideDollarSign className='w-4 h-4' />,
         value: driver?.totalEarned || 0,
      },
      {
         title: "Rating",
         icon: <LucideStar className='h-4 w-4' />,
         value: driver?.rating || 0
      }
   ]
  }, [driver])
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-5">
      {
         boxes.map(({icon, title, value}) => (
            <div className="relative border rounded-md p-4">
               <div className="flex flex-col gap-0">
                  <p className="text-sm">{title}</p>
                  <p className="text-lg font-bold">{value}</p>
               </div>
               <div className="absolute top-5 right-5">
                  {icon}
               </div>
            </div>
         ))
      }
    </div>
  )
}

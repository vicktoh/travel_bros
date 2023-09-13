import React from 'react'
import SetupChecklist from '@/components/drivers/setup-checklist';
import { DashboardMatrix } from '@/components/drivers/dashboard-matrix';
import { UpcomingTrips } from '@/components/drivers/upcoming-trips';

export default async function DriverHome() {
  return (
    <div className='flex flex-col px-1 lg:px-5'>
     <SetupChecklist />
     <DashboardMatrix />
     <UpcomingTrips />
    </div>
  )
}

import { Player } from '@lottiefiles/react-lottie-player'
import React from 'react'

export const Success = () => {
  return (
    <div className='flex flex-col items-center p-8 min-w-[400px]'>
      <Player
  autoplay
  loop
  src="https://assets7.lottiefiles.com/private_files/lf30_uw1ao4fr.json"
  style={{ height: '300px', width: '242' }}
>
</Player>
      <p className="text-2xl font-bold text-primary text-center w-[70%] mt-5 mb-3">Your have successfully booked your trip</p>
      <p className='text-base w-[60%] text-slate-400 text-center'>You have succesfully booked your trip  here is your reference number</p>

    </div>
  )
}

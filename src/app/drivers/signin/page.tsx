import React from 'react'
import SignupForm from './signin-form'
import { getAuth } from 'firebase/auth'
import { app } from '@/firebase'
import { redirect } from 'next/navigation'

const redirectToHome = () => {
   const auth = getAuth(app);
   if(auth.currentUser){
      redirect('/drivers');
   }
}
export default function Signup() {
   redirectToHome();
  return (
    <div className='h-screen w-screen bg-driver-image md:bg-gradient-linear'>
      <div className="grid grid-cols-1 md:grid-cols-2 h-screen">
         <div className="w-full flex flex-col items-center justify-center">

            <SignupForm />

         </div>
         <div className="hidden w-full bg-driver-image bg-center md:flex md:flex-col justify-end h-screen px-6 pb-6">

            <p className="text-7xl font-bold text-white max-w-[466px]">
            Where Quality Drivers Find Their <span className="text-brand">Luxury</span> Journey
            </p>
         </div>

      </div>

    </div>
  )
}

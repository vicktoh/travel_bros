import AdminSigninForm from '@/components/admin/signin-form'
import React from 'react'
const appEnv = process.env.NEXT_APP_ENV!
console.log({ appEnv });
export default function AdminSignin() {
  return (
    <div className="flex flex-col w-screen h-screen items-center justify-center">
      <AdminSigninForm />
    </div>
  )
}

import React from 'react'
const appEnv = process.env.NEXT_APP_ENV!
 console.log({appEnv})
export default function AdminDashboard() {
  return <div className="flex flex-col border border-bg-foreground rounded-md min-h-[calc(100vh-16px)] py-3 px-5">AdminDashboard</div>;
}

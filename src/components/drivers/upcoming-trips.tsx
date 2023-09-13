'use client'
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Empty } from './empty-state'

export const UpcomingTrips = () => {
  return (
    <Card className="mt-5">
      <CardHeader>
        <CardTitle className="text-lg">Upcoming Trips</CardTitle>
        <CardDescription>Your upcoming trips shows up here</CardDescription>
      </CardHeader>
      <CardContent>
        <Empty
          title="No Upcoming trips"
          description="You will recieve trips once your registration is complete"
        />
      </CardContent>
    </Card>
  );
}

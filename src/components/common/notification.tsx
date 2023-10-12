import { updateDocument } from '@/services/drivers'
import { useAuthStore } from '@/states/drivers'
import { NotificationWithId } from '@/types/System'
import { format } from 'date-fns'
import React, { FunctionComponent } from 'react'
import { useToast } from '../ui/use-toast'
type NotificationComponentProps = {
   notification: NotificationWithId
}
export const NotificationComponent: FunctionComponent<NotificationComponentProps> = ({notification}) => {
   const {user}= useAuthStore();
   const { toast} = useToast();
   const markAsRead = async () => {
      if(!user?.uid || notification.read) return;
      
      try {
         const path = `drivers/${user.uid}/notifications/${notification.id}`;
      await updateDocument(path, { read: true})
      } catch (error) {
         console.log("Failed to mark as read")
         toast({title: "Could not read notification", variant: "destructive"});
      }
   }
  return (
    <div onClick={markAsRead} className={`flex flex-col gap-5 py-5 px-3 rounded-md border border-primary-light w-[300px] ${!notification.read ? 'bg-primary-light cursor-pointer': ''}`}>
      <div className="flex flex-row text-brand justify-between items-center">
         <p className="font-bold text-base">{notification.title}</p>
         <p className="font-medium text-amber-500 text-sm">{format(notification.timestamp, "dd MMM @hh:mm")}</p>
      </div>
      <p className="text-sm">
         {notification.description}
      </p>
    </div>
  )
}

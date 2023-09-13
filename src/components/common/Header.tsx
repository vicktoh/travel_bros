'use client'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelectedLayoutSegment } from 'next/navigation'
import React from 'react'
type MenuType = {
   title: string;
   path: string;
   segment: string | null;
 
  }
 const MenuItems: MenuType[] = [
     {
         title: 'Home',
         path: '/',
         segment: null,

     },
     {
         title: 'Bookings',
         path: '#bookings',
         segment: 'bookings',
     },
     {
         title: 'Driver Signup',
         path: '/drivers/signup',
         segment: 'drivers',
     },
    //  {
    //      title: 'Terminals',
    //      path: '/terminals',
    //      segment: 'bookings',
    //  },
 ];
export const Header = () => {
   const activeSegment  = useSelectedLayoutSegment();
   
  return (
      <div className="w-screen flex z-30 py-2 pl-3 pr-6 sticky top-0 -m-6 justify-between left-0 right-0 items-center">
          <h3 className="text-xl md:text-2xl text-white font-bold">TravelBros</h3>
          <div className="flex-row flex">
              {MenuItems.map(({ path, title, segment }, key) => (
                  <Link
                      key={`navigationLink-${key}`}
                      className={`${
                          segment === activeSegment
                              ? 'text-white font-bold'
                              : 'text-red-50'
                      } text-md md:text-base ml-3`}
                      href={path}
                  >
                      {title}
                  </Link>
              ))}
          </div>
      </div>
  );
}

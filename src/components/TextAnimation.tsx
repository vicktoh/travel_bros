"use client";
import { Transition, TransitionClasses } from '@headlessui/react'
import React, { HTMLAttributes, useState } from 'react'
type TransitionDescription = Record<keyof TransitionClasses, HTMLAttributes<HTMLDivElement>["className"]>

const heroTextTransitionDescription : TransitionDescription = {
   enterFrom: ' scale-0 opacity-0',
   enter: 'transition ease-in delay duration-300 delay-75',
   enterTo: 'scale-100 opacity-100',
   leave: 'transition ease-out',
   leaveFrom: 'scale-100 opacity-100',
   leaveTo: 'scale-0 opacity-0',
   entered: 'transition ease-out'
   }
export const TextAnimation = () => {
   const [showButton, setShowButton] = useState(true);
  const [isShowing, setIsShowing] = useState(false);
  return (
   <Transition 
   {...heroTextTransitionDescription}
   appear={true}
   show={isShowing}
        beforeEnter={() => setIsShowing(true)}
        
   >
   <p className="md:text-5xl text-2xl text-white font-bold text-center mt-8 md:mt-0">
       Experience safe, convenient and luxurious Travel{' '}
   </p>

   </Transition>
  )
}

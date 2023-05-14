'use client';

import { ButtonHTMLAttributes, FC } from "react";
type ButtonSizes = 'sm' | 'md' | 'lg';
type ButtonVariants = 'outline' | 'solid'
export interface  ButtonProps extends  ButtonHTMLAttributes<HTMLButtonElement>  {
   title: string;
   variant?: ButtonVariants
   size?: ButtonSizes, 
}

const ButtonSizeMap: Record<ButtonSizes, string> = {
   'sm': `py-1 px-3 text-sm font-medium rounded-md`,
   'md': `py-3 px-5 text-base font-medium rounded-xl`,
   'lg': `py-4 px-6 text-xl font-bold rounded-2xl`,
   
}
const ButtonVariantMap: Record<ButtonVariants, string> = {
   'outline': `hover:bg-primary-light text-primary border-2 border-primary`,
   'solid': `hover:bg-red-800 bg-primary bg text-white border-r border-primary hover:border-2 :hover:border-primary`,
}
export const Button:FC<ButtonProps> = ({ title, size = 'md', variant='solid', className, ...props }) => {


    
   return (
       <button
           form=""
           {...props}
           className={`flex  focus:outline-2 focus:outline-blue-500 flex-row align-middle justify-center ${
               ButtonSizeMap[size]
           } ${ButtonVariantMap[variant]} ${className || ''}`}
       >
           {title}
       </button>
   );
}
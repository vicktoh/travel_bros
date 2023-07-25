import React from 'react'
import { BsFacebook, BsInstagram, BsTwitter } from 'react-icons/bs'
const icons = [
   BsFacebook,
   BsInstagram,
   BsTwitter
]
const contactInformation = [
   {
      label: 'Email',
      value: 'travelbrosng@gmail.com'
   },
   {
      label: 'Phone Numbers',
      value: '+234 706 647 5316, +234 906 335 2617, +234 806 855 7467'
   }
]
const terminals = [
   {
      label: 'Warri Terminal',
      value: 'No 5, Asokoro Drive assokoro disstrict, in the house'
   },
   {
      label: 'Abuja Office',
      value: 'House FO2, 442 Crescent Citec Villas Gwarimpa'
   },
   
]
const FooterItem = ({value} : {value: typeof contactInformation[0]}) => {
   return (
      <div className="flex flex-col gap-[2px]">
         <p className="text-sm font-bold text-primary">{value.label}</p>
         <p className="text-sm  text-slate-500 max-w-[252px]">{value.value}</p>
      </div>
   )
}
export const Footer = () => {
  return (
    <div className='py-10 px-10 bg-primary-light flex flex-col md:flex-row justify-between'>
      <div className="flex flex-col gap-3">
         <p className="text-xl text-slate-900 font-bold">TravelBros</p>
         <p className="text-sm text-slate-900">Checkout our Socials</p>
         <div className="flex flex-row gap-3">
            {
               icons.map((Icon, i)=> <Icon size={18} className='text-slate-800' key={`social-icon-${i}`} />)
            }
         </div>
      </div>
      <div className="flex flex-col gap-3">
         <p className="text-lg text-slate-900 font-bold">Contact Information</p>
         <div className="flex flex-col gap-2">
            {
               contactInformation.map((value)=> <FooterItem key={`footer-${value.label}`} value={value} />)
            }
         </div>
      </div>
      <div className="flex flex-col gap-3">
         <p className="text-lg text-slate-900 font-bold">Terminals</p>
         <div className="flex flex-col gap-2">
            {
               terminals.slice(0, 3).map((value)=> <FooterItem key={`footer-${value.label}`} value={value} />)
            }
         </div>
      </div>
    </div>
  )
}

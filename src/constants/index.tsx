import { BsCalendarHeart, BsClock, BsHeadset } from 'react-icons/bs'
import { AiFillCar } from 'react-icons/ai'
export const  FEATURELIST =  [
{
   icon: <BsCalendarHeart size={32} className='text-primary'/>,
   title: 'Convenience',
   description: 'We provide world class transportation service with our fully air conditioned and travel worthy vehicles '
},
{
   icon: <AiFillCar size={32} className='text-primary'/>,
   title: 'Vetted Vehicles',
   description: 'We professionally vet all vehicles before the journey, to make sure vehicles are in perfect working conditions'
},
{
   icon: <BsClock size={32} className='text-primary' />,
   title: 'Timely',
   description: 'We are respectful of our client’s time and we start each trip exactly at the stipulated time'
},
{
   icon: <BsHeadset size={32} className='text-primary' />,
   title: 'Customer Support',
   description: 'Having any issues, or complaints? Our excellent custormer support is at your service, via chat or phone call'
},
]
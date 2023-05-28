import { fetchVehicles } from "@/services/search";
import { BookingManager } from "./BookingManger";
import { AvailableVehicles } from "./AvailableVehicles";

function getVehicles(){
   return  fetchVehicles();
}



export default async function Booking (){
   const vehicles = await getVehicles();
   return (
     <div className="flex flex-col min-h-screen bg-white">
       <div className="flex border-2 relative flex-col md:min-h-[200px] items-start px-6 justify-center bg-hero-image bg-cover bg-center bg-opacity-60 bg-gray-800">
         <div className="bg-black bg-opacity-40 absolute left-0 right-0 top-0 bottom-0 "></div>
         <h3 className="text-2xl text-white font-bold">Manage Booking</h3>
       </div>
       <BookingManager vehicles={vehicles} />
     </div>
   );

}
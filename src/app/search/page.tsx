import { fetchVehicles } from "@/services/search";
import { AvailableVehicles } from "./AvailableVehicles";

function getVehicles(){
   return  fetchVehicles();
}

export default async function Search (){
   const vehicles = await getVehicles();
   return(
      <div className="flex flex-col">
         <AvailableVehicles vehicles={vehicles} />
      </div>
   )

}
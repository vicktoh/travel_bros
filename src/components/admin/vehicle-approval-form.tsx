import React, { FunctionComponent, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ApproveRegParams, RegistrationInfoWithId } from "@/types/Admin";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { DEPARTURE_TIMES } from "@/services/constants";
import STATES from "@/constants/states.json";
import { Button } from "../ui/button";
import { LucideLoader2 } from "lucide-react";
import { approveRegistration } from "@/services/admin";
import { useToast } from "../ui/use-toast";
const vehicleApprovalFormSchema = z.object({
  time: z.string().min(0, "Time must be included"),
  price: z.string(),
  to: z.string(),
  from: z.string(),
  noOfSeats: z.string(),
});
type VehicleApprovalFormProps = {
  registration: RegistrationInfoWithId;
  onCloseModal?: () => void;
};
export const VehicleApprovalForm: FunctionComponent<
  VehicleApprovalFormProps
> = ({ registration, onCloseModal }) => {
  const [submitting, setSubmiting] = useState(false);
  const form = useForm<z.infer<typeof vehicleApprovalFormSchema>>({
    resolver: zodResolver(vehicleApprovalFormSchema),
  });
  const {toast} = useToast();

  

  const onApproveRegistration = async ( values: z.infer<typeof vehicleApprovalFormSchema>,) => {
    try {
       setSubmiting(true);
       const param: ApproveRegParams = {
        reg: registration,
        from: values.from,
        to: values.to,
        noOfSeats: Number(values.noOfSeats),
        price: Number(values.price)
       };
       const {data} = await approveRegistration(param);
       if(data.status === 200){
        onCloseModal && onCloseModal();
        toast({
          title: "Registration approved",
        });
       } else{
        toast({
          title: data.message || "Unknown Error",
          variant: 'destructive',
        });
       }
       /// call function
    } catch (error) {
       const err: any = error;
       toast({
          title: "Could not approve registration",
          variant: "destructive",
          description: err.message || "unknown error occurred",
       });
    } finally {
       setSubmiting(false);
    }
 }

  return (
    <div className="flex flex-col">
      <h3 className="text-lg font-bold">Vehicle Approval Form</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onApproveRegistration)}>
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem className="mb-5">
                <FormLabel>Departure time</FormLabel>
                <Select onValueChange={field.onChange} {...field}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a departure time" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {DEPARTURE_TIMES.map((time) => (
                      <SelectItem key={`user-${time}`} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="tex-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="mb-5">
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="pl-5"
                      placeholder="3 or 5"
                      {...field}
                      type="number"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="noOfSeats"
            render={({ field }) => (
              <FormItem className="mb-5">
                <FormLabel>Number of Passenger</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="pl-5"
                      placeholder="10,000"
                      {...field}
                      type="number"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-5 mb-5">
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>From</FormLabel>
                  <Select {...field} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select From location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    <div className="flex flex-col overflow-y-scroll max-h-[300px]">

                      {STATES.map((time) => (
                        <SelectItem key={`from-${time}`} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                      </div>
                    </SelectContent>
                  </Select>
                  <FormMessage className="tex-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel>To</FormLabel>
                  <Select onValueChange={field.onChange} {...field}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select to location" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                     <div className="flex flex-col overflow-y-scroll max-h-[300px]">

                      {STATES.map((time) => (
                         <SelectItem key={`to-${time}`} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                      </div>
                    </SelectContent>
                  </Select>
                  <FormMessage className="tex-xs" />
                </FormItem>
              )}
            />
          </div>

          <Button
            size="lg"
            className="text-white w-full"
            type="submit"
            disabled={submitting}
          >
            {submitting ? (
              <LucideLoader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              "Approve"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

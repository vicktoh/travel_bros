"use client";
import { useDriverStore, useRegistrationStore } from "@/states/drivers";
import React, { useMemo, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { isRegistrationComplete } from "@/services/utils";
import { LucideInfo, LucideLoader, LucideRocket } from "lucide-react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import { sendRegForApproval } from "@/services/drivers";

export default function RegistrationAlert() {
  const { driver } = useDriverStore();
  const [sending, setSending] = useState<boolean>(false);
  const {toast} = useToast();
  const isComplete = useMemo(() => {
    if (!driver) return false;
    return isRegistrationComplete(driver).isComplete;
  }, [driver]);

  const sendRegistrationForApproval = async () => {
   try {
      setSending(true);
      const res = await sendRegForApproval();
      if(res.data.status === 200){
         toast({
            title: "Request sent",
            description: res.data.message
            
         })
         return;
      }
      toast({
         title: res.data.message
      })
   } catch (error) {
      const err: any = error;
      toast({
         title: "Could not sumbit",
         description: err?.message || "unknown error",
         variant: "destructive"
      })
   } finally{
      setSending(false);
   }
  }
  return (
    <Alert className="mb-5 mx-8 self-center" variant="info">
      {isComplete ? (
        <LucideRocket  />
      ) : (
        <LucideInfo  />
      )}
      <AlertTitle>
        {isComplete ? "Ready for review" : "Incomplete Registration"}
      </AlertTitle>
      <AlertDescription>
        {isComplete
          ? "You have completed all forms of registration, click submit to send your registration for approval"
          : "Please complete all forms of registration to send your registration for approval"}

        {isComplete ? (
          <Button
            size="sm"
            className="border-primary self-end text-primary ml-5"
            variant="outline"
            onClick={sendRegistrationForApproval}
            disabled={sending}
          >
            {
               sending ? <LucideLoader className="h-2 w-2 animate-spin" /> : "Submit for Approval"
            }
            
          </Button>
        ) : null}
      </AlertDescription>
    </Alert>
  );
}

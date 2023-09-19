"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { auth } from "@/firebase";
import { errorMap } from "@/services/constants";
import { AuthError, sendPasswordResetEmail } from "firebase/auth";
import { LucideArrowLeft, LucideLoader2 } from "lucide-react";
import React, { useState } from "react";

type ForgotPasswordProps = {
  gotoLogin: () => void;
};
export default function ForgotPassword({gotoLogin}: ForgotPasswordProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();
  const onResetPassword = async () => {
    if (!email) return;
    try {
      setIsSending(true);
      await sendPasswordResetEmail(auth, email);
      setShowSuccess(true);
    } catch (error) {
      const err = error as AuthError;
      const errorCode = err.code;
      toast({
        title: "Could not send password reset email",
        description: errorMap[errorCode] || "Unknown error occurred",
        variant: "destructive",
      });
    } finally{
      setIsSending(false);
    }
  };
  return (
    <Card className="flex flex-col max-w-[450px]">
      {showSuccess ? null : <CardHeader>
        <CardTitle className="text-primary text-2xl">
          Forgot your Password?
        </CardTitle>
        <CardDescription>
          Enter your email below and we will send you steps to reset your
          password
        </CardDescription>
      </CardHeader>}
      <CardContent>
        {showSuccess ? (
          <div className="flex flex-col items-center px-5">
            <img
              className="my-3 "
              src="https://firebasestorage.googleapis.com/v0/b/travel-bros.appspot.com/o/Cashback%20Activation%20Animation.gif?alt=media&token=adf14fcd-030b-498a-93a1-49841df69ab3"
              alt="Check Icon"
            />
            <h3 className="text-xl font-bold mb-3">Check your Inbox</h3>
            <p className="text-base">
              A password reset email has been sent to your email kindly follow
              the link to reset your password
            </p>
            <Button className="text-white mt-5" onClick={gotoLogin} type="button">Got it</Button>
          </div>
        ) : (
          <>
            <div className="">
              <Label>Email</Label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                className="mt-2"
              />
            </div>
            <Button
              className="text-white mt-5 w-full"
              disabled={isSending}
              type="button"
              onClick={onResetPassword}
            >
              {isSending ? (
                <LucideLoader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                "Reset Password"
              )}
            </Button>

            <div className="flex items-center mt-5 justify-center text-sm cursor-pointer" onClick={gotoLogin}>
               <LucideArrowLeft className="w-4 h-4 mr-2" /> Go back to Login
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

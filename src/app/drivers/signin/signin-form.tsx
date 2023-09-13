"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { LucideEye, LucideEyeOff, LucideLoader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { createDBDriver, onRegisterDriver, signIndriver } from "@/services/drivers";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { errorMap } from "@/services/constants";
import { AuthError } from "firebase/auth";
const signinFormSchema = z
  .object({
    email: z.string().email("Must be a valid email address"),
    password: z
      .string()
      .min(5, { message: "Password must be at least 5 characters" }),
  })

export type SigninField = z.infer<typeof signinFormSchema>;
export default function SigninForm() {
  const form = useForm<z.infer<typeof signinFormSchema>>({
    resolver: zodResolver(signinFormSchema),
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();
  const onSignup = async (driver: z.infer<typeof signinFormSchema>) => {
   try {
      setSubmitting(true);
      const {user} = await signIndriver(driver);
      setSubmitting(false);
      router.push('/drivers');

   } catch (error) {
      const err = error as AuthError;

      console.log({err});
      const mess = errorMap[err.code]
      toast({
         title: "Could not login",
         description: mess || "Unknown error please try again",
         variant: 'destructive',
      })
   } finally{
      setSubmitting(false);
   }
  };
  return (
    <Card className="min-w-[40px]">
      <CardHeader>
        <CardTitle className="text-brand">
          Welcome!
        </CardTitle>
        <CardDescription>
          Signin to your account to manage your road experience
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSignup)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="youremail@example.com" {...field} />
                  </FormControl>
                  <FormMessage className="tex-xs" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        className="pl-5"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        {...field}
                      />
                      <Button
                        onClick={() => setShowPassword((curr) => !curr)}
                        size="icon"
                        className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2"
                        variant="ghost"
                      >
                        {!showPassword ? <LucideEyeOff /> : <LucideEye />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            

            <Button
              size="lg"
              className="text-white w-full"
              type="submit"
              disabled={submitting || !form.formState.isValid}
            >
              {submitting ? (
                <LucideLoader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                "Login"
              )}
            </Button>
          </form>
          <p className="text-sm mt-5 text-center">
            Don't have an account{" "}
            <Link href="/drivers/signup" className="text-primary">
              Sign Up
            </Link>
          </p>
        </Form>
      </CardContent>
    </Card>
  );
}

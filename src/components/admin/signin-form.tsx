"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { LucideEye, LucideEyeOff, LucideLoader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { AuthError } from "firebase/auth";
import { signInAdmin } from "@/services/admin";
const signinFormSchema = z
  .object({
    email: z.string().email("Must be a valid email address"),
    password: z
      .string()
      .min(5, { message: "Password must be at least 5 characters" }),
  })

export type SigninField = z.infer<typeof signinFormSchema>;
export type SignFormProps = {
}
export default function AdminSigninForm() {
  const form = useForm<z.infer<typeof signinFormSchema>>({
    resolver: zodResolver(signinFormSchema),
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();
  const onSignin = async ({email, password}: z.infer<typeof signinFormSchema>) => {
   try {
      setSubmitting(true);
      const user = await signInAdmin(email, password);
      setSubmitting(false);
      router.push('/admin');

   } catch (error) {
      const err = error as AuthError;

      toast({
         title: "Could not login",
         description: err?.message || "Unknown error please try again",
         variant: 'destructive',
      })
   } finally{
      setSubmitting(false);
   }
  };
  return (
    <Card className="min-w-[400px]">
      <CardHeader>
        <CardTitle className="text-brand">
          Travel Bros Admin
        </CardTitle>
      </CardHeader>
      <CardContent className="">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSignin)}>
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
                        type="button"
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
        </Form>
      </CardContent>
    </Card>
  );
}

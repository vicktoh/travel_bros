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
import { createDBDriver, onRegisterDriver } from "@/services/drivers";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";
import { FirebaseError } from "firebase/app";
import { AuthError } from "firebase/auth";
import { errorMap } from "@/services/constants";
const signupFormSchema = z.object({
  fullname: z
    .string()
    .min(5, { message: "Name must be at least 5 characters" }),
  email: z.string().email("Must be a valid email address"),
  phone: z.string().regex(/^\d{11}$/, "Must be a valid phone number"),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters" }),
  terms: z.literal(true, {
    errorMap: () => ({ message: "Please accept the terms and conditions" }),
  }),
});

export type SignupField = z.infer<typeof signupFormSchema>;
export default function SignupForm() {
  const form = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const { toast } = useToast();
  const onSignup = async (driver: z.infer<typeof signupFormSchema>) => {
    try {
      setSubmitting(true);
      const { user } = await onRegisterDriver(driver);
      if (user) {
        await createDBDriver(user.uid, driver);
      }
      setSubmitting(false);
      router.push("/drivers");
    } catch (error) {
      const err = error as AuthError;
      const mess = errorMap[err?.code] || "Unknown error";
      console.log({ err });
      toast({
        title: "Could not register",
        description: mess || "Unknown error please try again",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Card className="min-w-[40px]">
      <CardHeader>
        <div className="flex items-center">
          <img src="/images/logo.jpeg" alt="logo" className="w-[80px]" />
          <div className="flex flex-col gap-2">
            <CardTitle className="text-brand">
              Signup to Travel Bros Driver
            </CardTitle>
            <CardDescription>
              Turn Your Car into a Luxury Experience
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSignup)}>
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Fullname</FormLabel>
                  <FormControl>
                    <Input placeholder="John doe" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
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
              name="phone"
              render={({ field }) => (
                <FormItem className="mb-5">
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      max={10}
                      type="text"
                      placeholder="John doe"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
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
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        className="text-white"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        id="terms2"
                      />
                      <label
                        htmlFor="terms2"
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the{" "}
                        <Link
                          href="/drivers/terms/"
                          className="text-bold text-primary"
                        >
                          Terms of Service and Privacy Policy
                        </Link>
                      </label>
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
                "Create my account"
              )}
            </Button>
          </form>
          <p className="text-sm mt-5 text-center">
            Already have an account?{" "}
            <Link href="/drivers/signin" className="text-primary">
              Sign In
            </Link>
          </p>
        </Form>
      </CardContent>
    </Card>
  );
}

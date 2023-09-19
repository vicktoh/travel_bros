"use client";
import React, { useState } from "react";
import ForgotPassword from "./forgot-password";
import SigninForm from "./signin-form";

export default function FormContainer() {
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  if (showForgotPassword) {
    return <ForgotPassword gotoLogin={() => setShowForgotPassword(false)} />;
  }

  return <SigninForm gotoForgotPassword={() => setShowForgotPassword(true)} />;
}

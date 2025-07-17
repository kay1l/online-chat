"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema } from "@/lib/validations/registerSchema";
import { useState } from "react";
// import { supabase } from "@/lib/supaBaseClient";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setErrorMsg(null);
  //   setSuccessMsg(null);

  //   const result = registerSchema.safeParse(formData);
  //   if (!result.success) {
  //     const firstError = result.error.errors[0]?.message;
  //     setErrorMsg(firstError || "Invalid input");
  //     return;
  //   }

  //   const { username, email, password } = result.data;
  //   const { error } = await supabase.auth.signUp({
  //     email,
  //     password,
  //     options: {
  //       data: { username }
  //     }
  //   });

  //   if (error) {
  //     setErrorMsg(error.message);
  //   } else {
  //     setSuccessMsg("Success! Check your email to confirm your account.");
  //     setFormData({
  //       username: "",
  //       email: "",
  //       password: "",
  //       confirmPassword: ""
  //     });
  //   }
  // };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-balance">
                  Join our chat app to start messaging.
                </p>
              </div>

              {errorMsg && (
                <p className="text-sm text-red-600 text-center">{errorMsg}</p>
              )}
              {successMsg && (
                <p className="text-sm text-green-600 text-center">
                  {successMsg}
                </p>
              )}

              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  
                  className="h-12 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  
                  className="h-12 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  
                  className="h-12 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  
                  className="h-12 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
              </div>

              <Button type="submit" className="w-full cursor-pointer">
                Sign up
              </Button>

              <div className="text-center text-sm mt-1">
                Already have an account?{" "}
                <a href="/" className="underline underline-offset-4">
                  Log in
                </a>
              </div>
            </div>
          </form>

          <div className="relative hidden md:block">
            <img
              src="/images/icon.jpeg"
              alt="Image"
              className="h-full w-full object-contain dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

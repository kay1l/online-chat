"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema } from "@/lib/validations/registerSchema";
import { register } from "@/helpers/auth";
import { getErrorMessage } from "@/lib/axios";
import { useAuth } from "@/custom_components/app_wrapper";

export function RegisterForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter();
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const parsed = registerSchema.safeParse(formData);
    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setSubmitting(true);
    try {
      const { user } = await register({
        name: parsed.data.username,
        email: parsed.data.email,
        password: parsed.data.password,
        password_confirmation: parsed.data.confirmPassword,
      });
      setUser(user);
      toast.success("Account created");
      router.push("/chats");
    } catch (err) {
      setErrorMsg(getErrorMessage(err, "Registration failed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-balance">
                  Join our chat app to start messaging.
                </p>
              </div>

              {errorMsg && (
                <p className="text-sm text-destructive text-center">{errorMsg}</p>
              )}

              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="h-12"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="h-12"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="h-12"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="h-12"
                />
              </div>

              <Button type="submit" className="w-full cursor-pointer bg-brand text-brand-foreground hover:bg-brand/90" disabled={submitting}>
                {submitting ? "Creating account..." : "Sign up"}
              </Button>

              <div className="text-center text-sm mt-1">
                Already have an account?{" "}
                <Link href="/" className="underline underline-offset-4">
                  Log in
                </Link>
              </div>
            </div>
          </form>

          <div className="relative hidden md:block">
            <Image
              src="/images/icon.jpeg"
              alt="NexChat"
              width={600}
              height={600}
              className="h-full w-full object-contain dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

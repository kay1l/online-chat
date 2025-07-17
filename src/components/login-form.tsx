"use client"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { setAuthToken } from "@/lib/axios"; 
import { loginSchema } from "@/lib/validations/loginSchema"
import { useRouter } from "next/navigation"
import { endpoints } from "@/lib/endpoints";
import {API, } from "@/lib/axios"


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" })
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value
    }))
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      loginSchema.parse(formData);
  
      const response = await API.post(endpoints.auth.login, formData);
  
      const token = response.data?.token; 
  
      if (token) {
        localStorage.setItem("token", token); 
        setAuthToken(token); 
      }
  
      setSuccessMsg("Login successful!");
      setErrorMsg(null);
      router.push("/chats");
    } catch (err: any) {
      if (err.response) {
        setErrorMsg(err.response.data.message || "Login failed");
      } else {
        setErrorMsg(err.message || "Something went wrong");
      }
      setSuccessMsg(null);
    }
  };
  

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit} >
            <div className="flex flex-col gap-4">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Login to your NexChat account
                </p>
              </div>

              {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
              {successMsg && <p className="text-sm text-green-600">{successMsg}</p>}

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="h-12 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="h-12 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
              </div>

              <Button type="submit" className="w-full">
                Login
              </Button>

              <div className="text-center text-sm mt-1">
                Don&apos;t have an account?{" "}
                <a href="/register" className="underline underline-offset-4">
                  Sign up
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
  )
}

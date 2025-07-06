import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
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

              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  required
                  className="h-12 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="h-12 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  className="h-12 transition-all duration-300 ease-in-out focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
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

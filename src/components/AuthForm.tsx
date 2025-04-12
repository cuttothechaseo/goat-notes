"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { CardContent, CardFooter } from "./ui/card";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { loginAction, signUpAction } from "@/users";

type Props = {
  type: "login" | "signup";
};

function AuthForm({ type }: Props) {
  const isLoginForm = type === "login";
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      let result;
      let title;
      let description;

      if (isLoginForm) {
        result = await loginAction(email, password);
        title = "Login";
        description = "You have been logged in successfully";
      } else {
        result = await signUpAction(email, password);
        title = "Sign Up";
        description = "Check your email for a confirmation link";
      }

      if (!result?.errorMessage) {
        toast.success(title, {
          description: description,
          duration: 3000,
        });
        if (isLoginForm) {
          router.replace("/");
        }
      } else {
        toast.error(title, {
          description: result.errorMessage,
        });
      }
    });
  };

  return (
    <form action={handleSubmit}>
      <CardContent className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="Enter your email"
            type="email"
            required
            disabled={isPending}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            placeholder="Enter your password"
            type="password"
            required
            disabled={isPending}
          />
        </div>
      </CardContent>
      <CardFooter className="mt-8 flex flex-col gap-6">
        <Button className="w-full" disabled={isPending}>
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <>{isLoginForm ? "Login" : "Sign Up"}</>
          )}
        </Button>
        <p className="text-xs">
          {isLoginForm
            ? "Don't have an account? "
            : "Already have an account? "}{" "}
          <Link
            href={isLoginForm ? "/signup" : "/login"}
            className={`text-blue-500 underline ${isPending ? "pointer-events-none opacity-50" : ""}`}
          >
            {isLoginForm ? "Sign Up" : "Login"}
          </Link>
        </p>
      </CardFooter>
    </form>
  );
}

export default AuthForm;

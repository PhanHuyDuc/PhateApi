"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignIn } from "@/lib/actions/user.actions";
import { signInDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";

export default function CredentialsSigninForm() {
  const [data, action] = useActionState(SignIn, {
    success: false,
    message: "",
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // Redirect on successful sign-in
  useEffect(() => {
    if (data.success) {
      router.push(callbackUrl);
    }
  }, [data.success, router, callbackUrl]);

  const SignInButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button className="w-full" variant={"default"} disabled={pending}>
        {pending ? "Signing In..." : "Sign In"}
      </Button>
    );
  };
  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={signInDefaultValues.email}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="password"
            defaultValue={signInDefaultValues.password}
          />
        </div>
        <div>
          <SignInButton />
        </div>
        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}
        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="link" target="_self">
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  );
}

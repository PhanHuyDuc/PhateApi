"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SignUp } from "@/lib/actions/user.actions";
import { signUpDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";

export default function SignUpForm() {
  const [data, action] = useActionState(SignUp, {
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

  const SignUpButton = () => {
    const { pending } = useFormStatus();
    return (
      <Button className="w-full" variant={"default"} disabled={pending}>
        {pending ? "Submitting..." : "Sign Up"}
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
            defaultValue={signUpDefaultValues.email}
          />
        </div>
        <div>
          <Label htmlFor="displayName">Display Name</Label>
          <Input
            id="displayName"
            name="displayName"
            type="text"
            required
            autoComplete="displayName"
            defaultValue={signUpDefaultValues.displayName}
          />
        </div>
        <div>
          <Label htmlFor="Bio">Bio</Label>
          <Select required name="bio">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="--Select Bio--" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            defaultValue={signUpDefaultValues.password}
          />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="confirmPassword"
            defaultValue={signUpDefaultValues.confirmPassword}
          />
        </div>
        <div>
          <SignUpButton />
        </div>
        {data && !data.success && (
          <div className="text-center text-destructive">
            {typeof data.message === "string" ? data.message : ""}
          </div>
        )}
        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="link" target="_self">
            Sign In
          </Link>
        </div>
      </div>
    </form>
  );
}

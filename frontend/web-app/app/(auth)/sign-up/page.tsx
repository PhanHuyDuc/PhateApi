import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import { Link } from "lucide-react";
import Image from "next/image";
import SignUpForm from "./sign-up-form";

export const metadata = {
  title: "Sign Up",
};

export default function SignUp() {
  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href={"/"} className="flex-center">
            <Image
              src={"/images/logo.svg"}
              alt={`${APP_NAME} logo`}
              width={100}
              height={100}
              priority
            />
          </Link>
          <CardTitle className="text-center">Create Account</CardTitle>
          <CardDescription className="text-center">
            Fill your information below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <SignUpForm />
        </CardContent>
      </Card>
    </div>
  );
}

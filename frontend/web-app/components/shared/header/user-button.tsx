import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserIcon } from "lucide-react";
import Link from "next/link";

export default async function UserButton() {
  const session = await auth();
  console.log(session);
  if (!session) {
    return (
      <Button asChild>
        <Link href={"/sign-in"}>
          <UserIcon /> Sign In
        </Link>
      </Button>
    );
  }

  const firstInitial =
    session.user?.displayName?.charAt(0).toUpperCase() ?? "U";
  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            <Button
              variant={`ghost`}
              className="relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-200"
            >
              {firstInitial}
            </Button>
          </div>
        </DropdownMenuTrigger>
      </DropdownMenu>
    </div>
  );
}

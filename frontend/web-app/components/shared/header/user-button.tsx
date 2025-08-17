import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getCurrentUser } from "@/lib/actions/authActions";
import { SignOut } from "@/lib/actions/user.actions";
import { UserIcon } from "lucide-react";
import Link from "next/link";

type UserInfo = {
  displayName?: string;
  email?: string;
  roles: string[];
};

export default async function UserButton() {
  const userInfo = (await getCurrentUser()) as UserInfo | null;

  const admin = userInfo?.roles.includes("Admin");
  const manager = userInfo?.roles.includes("Manager");
  if (!userInfo) {
    return (
      <Button asChild>
        <Link href={"/sign-in"}>
          <UserIcon /> Sign In
        </Link>
      </Button>
    );
  }

  const firstInitial = userInfo.displayName?.charAt(0).toUpperCase() ?? "U";
  return (
    <div className="flex gap-2 items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center">
            <Button
              variant={`ghost`}
              className="relative w-8 h-8 rounded-full ml-2 flex items-center justify-center bg-gray-500"
            >
              {firstInitial}
            </Button>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <div className="text-sm font-medium leading-none">
                {userInfo.displayName}
              </div>
              <div className="text-sm text-muted-foreground leading-none">
                {userInfo.email}
              </div>
            </div>
          </DropdownMenuLabel>
          {(admin || manager) && (
            <DropdownMenuItem>
              <Link href={"/admin/overview"} className="w-full">
                Admin
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="p-0 mb-1">
            <form action={SignOut} className="w-full">
              <Button
                className="w-full py-4 px-2 h-4 justify-start"
                variant={"ghost"}
              >
                Sign Out
              </Button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

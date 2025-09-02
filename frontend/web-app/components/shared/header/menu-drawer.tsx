import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { getCurrentUser } from "@/lib/actions/authActions";
import { getAllMenu, menuTree } from "@/lib/actions/menu.actions";
import { MenuIcon } from "lucide-react";
import Link from "next/link";
import RenderMenu from "../menu/render-menu";

export default async function MenuDrawer() {
  //check admin role
  const currentUser = await getCurrentUser();

  const userRoles =
    currentUser && Array.isArray((currentUser as any).roles)
      ? (currentUser as any).roles.join(";")
      : (currentUser as any)?.role ?? "";

  const parsedRoles = userRoles
    .toString()
    .split(";")
    .map((r: string) => r.trim());
  const role = parsedRoles.includes("Admin");
  // load menu data
  const menuData = await getAllMenu();

  const menu = await menuTree(Array.isArray(menuData) ? menuData : [menuData]);
  return (
    <>
      <Drawer direction="left">
        <DrawerTrigger asChild>
          <Button variant="outline">
            <MenuIcon />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Select menu</DrawerTitle>
            <div className="space-y-1 mt-4">
              {/* Loop menu here */}
              <RenderMenu menu={menu} />
              {role && (
                <Button
                  asChild
                  variant="ghost"
                  className="w-full justify-start"
                >
                  <DrawerClose asChild>
                    <Link href={"/contents"}>Contents List</Link>
                  </DrawerClose>
                </Button>
              )}
              {/* End loop menu */}
            </div>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </>
  );
}

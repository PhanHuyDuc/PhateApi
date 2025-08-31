import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

export default function MenuDrawer() {
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
              <Button asChild variant="ghost" className="w-full justify-start">
                <DrawerClose asChild>
                  <Link href={""}>Template menu</Link>
                </DrawerClose>
              </Button>
              <Button asChild variant="ghost" className="w-full justify-start">
                <DrawerClose asChild>
                  <Link href={""}>Template menu 2</Link>
                </DrawerClose>
              </Button>
              {/* End loop menu */}
            </div>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </>
  );
}

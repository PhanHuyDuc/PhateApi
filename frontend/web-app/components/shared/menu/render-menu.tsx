"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DrawerClose } from "@/components/ui/drawer";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Menu } from "@/types";

function RenderMenu({ menu }: { menu: Menu[] }) {
  return (
    <div className="ml-2 space-y-1">
      {menu.map((item) => (
        <MenuItem key={item.id} item={item} />
      ))}
    </div>
  );
}

function MenuItem({ item }: { item: Menu }) {
  const [open, setOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div className="ml-1">
      <div className="flex items-center">
        <Button
          asChild={!hasChildren} // if no children, link directly
          variant="ghost"
          className="w-full justify-between"
          onClick={() => hasChildren && setOpen(!open)}
        >
          {hasChildren ? (
            <div className="flex items-center justify-between w-full">
              <span>{item.name}</span>
              {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </div>
          ) : (
            <DrawerClose asChild>
              <Link href={item.url}>{item.name}</Link>
            </DrawerClose>
          )}
        </Button>
      </div>

      {/* Render children only when open */}
      {hasChildren && open && (
        <div className="ml-4 mt-1 border-l pl-2">
          <RenderMenu menu={item.children!} />
        </div>
      )}
    </div>
  );
}

export default RenderMenu;

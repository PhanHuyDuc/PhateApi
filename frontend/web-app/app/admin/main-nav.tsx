"use client";

import { getCurrentUser } from "@/lib/actions/authActions";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  {
    title: "Overview",
    href: "/admin/overview",
  },
  {
    title: "Products",
    href: "/admin/products",
  },
  {
    title: "Banners",
    href: "/admin/banners",
  },
  {
    title: "Banner Categories",
    href: "/admin/bannerCats",
  },
  {
    title: "Menus",
    href: "/admin/menus",
  },
  {
    title: "Contacts",
    href: "/admin/contacts",
  },
  {
    title: "Infos",
    href: "/admin/infos",
  },
  // Only for Admin role
  {
    title: "Artists",
    href: "/admin/artists",
    adminOnly: true,
  },
  {
    title: "Contents",
    href: "/admin/contents",
    adminOnly: true,
  },
];

export default function MainNav({
  className,
  ...props
}: React.HtmlHTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchRoles = async () => {
      const currentUser = await getCurrentUser();

      const userRoles =
        currentUser && Array.isArray((currentUser as any).roles)
          ? (currentUser as any).roles.join(";")
          : (currentUser as any)?.role ?? "";

      const parsedRoles = userRoles
        .toString()
        .split(";")
        .map((r: string) => r.trim());

      setRoles(parsedRoles);
      setLoading(false);
    };

    fetchRoles();
  }, []);

  const filteredLinks = links.filter((link) => {
    if (link.adminOnly) {
      return roles.includes("Admin");
    }
    return true;
  });

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {loading ? (
        <span>Loading...</span>
      ) : (
        filteredLinks.map((item) => (
          <Link
            href={item.href}
            key={item.title}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname.startsWith(item.href) ? "" : "text-muted-foreground"
            )}
          >
            {item.title}
          </Link>
        ))
      )}
    </nav>
  );
}

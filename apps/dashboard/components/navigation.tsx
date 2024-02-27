"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";
import { LucideIcon } from "lucide-react";

export type NavLink = {
  id: number;
  name: string;
  value: string;
};

type NavigationProps = {
  links: NavLink[];
};

export function Navigation({ links }: NavigationProps) {
  const pathname = usePathname();

  return (
    <div className=" flex flex-col p-2 gap-2 w-full">
      {links.map((link) => (
        <Link href={`${link.value}`} key={link.id} className=" w-full">
          <Button
            key={link.id}
            variant={pathname.includes(link.value) ? "default" : "outline"}
            className=" w-full"
          >
            {link.name}
          </Button>
        </Link>
      ))}
    </div>
  );
}

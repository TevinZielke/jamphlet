"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "./ui/button";

const navLinks = [
  {
    id: 1,
    name: "Clients",
    value: "/clients",
  },
  {
    id: 2,
    name: "Items",
    value: "/items",
  },
  {
    id: 3,
    name: "Project",
    value: "/project",
  },
  {
    id: 4,
    name: "Organization",
    value: "/organization",
  },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <div className=" flex flex-col p-2 gap-2">
      {navLinks.map((link) => (
        <Link href={`${link.value}`} key={link.id} className=" w-full">
          <Button
            key={link.id}
            variant={pathname === link.value ? "default" : "outline"}
            className=" w-full"
          >
            {link.name}
          </Button>
        </Link>
      ))}
    </div>
  );
}

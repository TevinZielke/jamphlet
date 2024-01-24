"use client";

import { useMenuAtom } from "lib/use-menu";
import { Button } from "./ui/button";

const navLinks = [
  {
    id: 1,
    name: "Clients",
    value: "clients",
  },
  {
    id: 2,
    name: "Items",
    value: "items",
  },
  {
    id: 3,
    name: "Project",
    value: "project",
  },
  {
    id: 4,
    name: "Organization",
    value: "organization",
  },
];

export function Navigation() {
  const [menuAtom, setMenuAtom] = useMenuAtom();
  return (
    <div className=" flex flex-col p-2 gap-2">
      {navLinks.map((link) => (
        <Button
          key={link.id}
          variant={menuAtom === link.value ? "default" : "outline"}
          onClick={() => setMenuAtom(link.value)}
        >
          {link.name}
        </Button>
      ))}
    </div>
  );
}

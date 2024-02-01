import { LogoutLink } from "@jamphlet/auth";
import { ProjectSelector } from "./project-selector";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Navigation } from "./navigation";

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

export async function Sidebar() {
  return (
    <div className=" h-full flex flex-col">
      <div className="flex h-[52px] items-center justify-center px-2">
        <ProjectSelector />
      </div>
      <Separator />
      <Navigation links={navLinks} />
      <Separator />
      <div className=" flex flex-col flex-auto place-content-end p-2 gap-2">
        <Button variant="outline">
          <LogoutLink>Log Out</LogoutLink>
        </Button>
      </div>
    </div>
  );
}

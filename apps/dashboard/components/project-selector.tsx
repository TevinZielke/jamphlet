"use client";

import { getProjectsByUserId } from "@jamphlet/database";
import { useQuery } from "@tanstack/react-query";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ProjectSelector() {
  const userId = 1;
  const { data } = useQuery({
    queryKey: ["projects"],
    queryFn: () => getProjectsByUserId(userId),
  });

  const lastVisitedProject = data ? data?.at(0)?.name : "Select a project";

  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={lastVisitedProject} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Projects</SelectLabel>
          {data?.map((project) => (
            <SelectItem key={project.id} value={project.name}>
              {project.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

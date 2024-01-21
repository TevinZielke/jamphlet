// "use client";

import { getProjectsByUserId } from "@jamphlet/database";
import { useQuery } from "@tanstack/react-query";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export async function ProjectSelector() {
  const testUserId = 3;
  // const { data } = useQuery({
  //   queryKey: ["projects", testUserId],
  //   queryFn: () => getProjectsByUserId(testUserId),
  // });

  const data = await getProjectsByUserId(4);

  const lastVisitedProject = data ? data?.at(0)?.name : "Select a project";

  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={lastVisitedProject} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
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

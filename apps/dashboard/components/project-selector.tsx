import {
  getProjectsByUserId,
  getUserByKindeId,
  setCurrentProjectAction,
} from "@jamphlet/database";
import { useQuery } from "@tanstack/react-query";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authenticateUser, getAuthenticatedUser } from "@jamphlet/auth";
import { redirect } from "next/navigation";
import ProjectSelectorItem from "./project-selector-item";

export async function ProjectSelector() {
  // const { data } = useQuery({
  //   queryKey: ["projects", testUserId],
  //   queryFn: () => getProjectsByUserId(testUserId),
  // });

  const isLoggedIn = await authenticateUser();

  if (!isLoggedIn) {
    redirect("/api/auth/login");
  }

  const kindeUser = await getAuthenticatedUser();

  if (!kindeUser || kindeUser == null || !kindeUser.id || !kindeUser.email) {
    throw new Error("Authentication failed for: " + kindeUser);
  }

  const dbUser = await getUserByKindeId(kindeUser.id);
  const projectId = dbUser?.currentProjectId;

  if (!dbUser?.id) {
    throw new Error("Error fetching dbUser.");
  } else if (!projectId) {
    throw new Error("Error fetching project.");
  }

  const data = await getProjectsByUserId(dbUser.id);

  const lastVisitedProject = data ? data?.at(0)?.name : "Select a project";

  async function handleSelectProject(userId: number, projectId: number) {
    const result = await setCurrentProjectAction(userId, projectId);
  }

  return (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={lastVisitedProject} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {data?.map((project) => (
            <SelectItem
              key={project.id}
              value={project.name}
              // onClick={() => handleSelectProject(dbUser.id, project.id)}
            >
              {project.name}
            </SelectItem>
            // <ProjectSelectorItem
            //   projectId={project.id}
            //   projectName={project.name}
            //   userId={dbUser.id}
            // />
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

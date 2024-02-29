import { ProjectStructure } from "@/components/project-structure";
import { authenticateUser, getAuthenticatedUser } from "@jamphlet/auth";
import { getUserByKindeId } from "@jamphlet/database";
import { redirect } from "next/navigation";

export default async function ProjectMembers() {
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
  }
  if (!projectId) {
    throw new Error("Error fetching project.");
  }

  return (
    <div>
      <ProjectStructure projectId={projectId} />
    </div>
  );
}

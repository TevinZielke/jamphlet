import {
  authenticateUser,
  getAuthenticatedUser,
  LogoutLink,
} from "@jamphlet/auth";

import styles from "./page.module.css";
import { redirect } from "next/navigation";
import {
  addKindeUser,
  getClientsByUserId,
  getProjectsByUserId,
  getUserByKindeId,
  NewUser,
} from "@jamphlet/database";

const projectId = 1;
const organizationId = 1;

export default async function Page(): Promise<JSX.Element> {
  const isLoggedIn = await authenticateUser();

  if (!isLoggedIn) {
    redirect("/api/auth/login");
  }

  const user = await getAuthenticatedUser();
  console.log("user: ", user);

  if (!user || user == null || !user.id || !user.email) {
    throw new Error("Authentication failed for: " + user);
  }

  const dbUser = await getUserByKindeId(user.id);

  if (!dbUser) {
    const newUser: NewUser = {
      kindeId: user.id,
      name: user.given_name + " " + user.family_name,
      email: user.email,
    };
    addKindeUser(newUser, projectId, organizationId);
  }

  if (!dbUser?.id) {
    throw new Error("Error fetching dbUser.");
  }

  const projects = await getProjectsByUserId(dbUser?.id);
  const clients = await getClientsByUserId(3);

  return (
    <main className={styles.main}>
      <h1>Helloo, welcome to Jamphlet!</h1>
      <div>
        <span>Projects: </span>
        {projects.map((project, i) => {
          return <span key={i}>{JSON.stringify(project.name)}</span>;
        })}
      </div>
      <div>
        <span>Clients: </span>
        {clients.map((client, i) => {
          return <span key={i}>{JSON.stringify(client.name)}</span>;
        })}
      </div>
      <LogoutLink>Log Out</LogoutLink>
    </main>
  );
}

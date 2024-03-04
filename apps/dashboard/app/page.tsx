import { redirect } from "next/navigation";

import { authenticateUser, getAuthenticatedUser } from "@jamphlet/auth";
import { addKindeUser, getUserByKindeId, NewUser } from "@jamphlet/database";

import styles from "./page.module.css";

// const projectId = 1;
const organizationId = 1;

export default async function Page(): Promise<JSX.Element> {
  // noStore();

  const isLoggedIn = await authenticateUser();

  if (!isLoggedIn) {
    redirect("/api/auth/login");
  } else {
    redirect("/clients");
  }

  // const kindeUser = await getAuthenticatedUser();

  // if (!kindeUser || kindeUser == null || !kindeUser.id || !kindeUser.email) {
  //   throw new Error("Authentication failed for: " + kindeUser);
  // }

  // const dbUser = await getUserByKindeId(kindeUser.id);
  // const projectId = dbUser?.currentProjectId || 1;

  // console.log("kindeUser: ", kindeUser);

  // let newDbUser;

  // if (projectId && !dbUser) {
  //   const newUser: NewUser = {
  //     kindeId: kindeUser.id,
  //     name: kindeUser.given_name + " " + kindeUser.family_name,
  //     email: kindeUser.email,
  //     currentProjectId: projectId,
  //   };
  //   newDbUser = await addKindeUser(newUser, projectId, organizationId);

  //   newDbUser && console.log("new: ", newDbUser);

  //   if (!newDbUser) {
  //     throw new Error("Error fetching dbUser.");
  //   }
  // }

  return <main className={styles.main}>Hello</main>;
}

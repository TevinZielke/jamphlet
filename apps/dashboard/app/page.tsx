import { authenticateUser, LogoutUser } from "@jamphlet/auth";

import styles from "./page.module.css";
import { redirect } from "next/navigation";
import { getProjectUsers } from "@jamphlet/database";
import { Button } from "../../../packages/ui/src/button";

export default async function Page(): Promise<JSX.Element> {
  const isLoggedIn = await authenticateUser();

  if (!isLoggedIn) {
    redirect("/api/auth/login");
  } else {
    console.log("Authentication successful!");
  }
  const projectUsers = await getProjectUsers(1);

  return (
    <main className={styles.main}>
      <h1>Welcome to Jamphlet!</h1>
      {projectUsers.map((pu, id) => {
        return <span key={id}>{JSON.stringify(pu.users.name)}</span>;
      })}

      {/* <button onClick={LogoutUser}>Log Out</button> */}
      <Button appName="dashboard">Click</Button>
    </main>
  );
}

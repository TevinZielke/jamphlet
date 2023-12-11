import { authenticateUser } from "@jamphlet/auth";

import styles from "./page.module.css";
import { redirect } from "next/navigation";

export default async function Page(): Promise<JSX.Element> {
  const isLoggedIn = await authenticateUser();

  if (!isLoggedIn) {
    redirect("/api/auth/login");
  } else {
    console.log("Authentication successful!");
  }

  return <main className={styles.main}>Welcome to Jamphlet!</main>;
}

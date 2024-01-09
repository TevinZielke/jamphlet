// "use server";
import { redirect } from "next/navigation";

import {
  authenticateUser,
  getAuthenticatedUser,
  LogoutLink,
} from "@jamphlet/auth";
import {
  addKindeUser,
  getClientsByUserId,
  getProjectsByUserId,
  getUserByKindeId,
  NewUser,
} from "@jamphlet/database";
import { Navigation } from "@/components/navigation";
import styles from "./page.module.css";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  useQuery,
} from "@tanstack/react-query";

const projectId = 1;
const organizationId = 1;

export default async function Page(): Promise<JSX.Element> {
  const isLoggedIn = await authenticateUser();

  if (!isLoggedIn) {
    redirect("/api/auth/login");
  }

  const user = await getAuthenticatedUser();

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

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["projects"],
    queryFn: () => getProjectsByUserId(dbUser.id),
  });

  await queryClient.prefetchQuery({
    queryKey: ["clients"],
    queryFn: () => getClientsByUserId(3),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className={styles.main}>
        <h1>Helloo, welcome to Jamphlet!</h1>
        <Navigation />

        <LogoutLink>Log Out</LogoutLink>
      </main>
    </HydrationBoundary>
  );
}

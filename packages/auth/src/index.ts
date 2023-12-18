import {
  getKindeServerSession,
  LoginLink,
  LogoutLink,
} from "@kinde-oss/kinde-auth-nextjs/server";

import * as dotenv from "dotenv";

export async function authenticateUser() {
  const { isAuthenticated } = getKindeServerSession();

  dotenv.config();

  return await isAuthenticated();
}

export async function getAuthenticatedUser() {
  const { getUser } = getKindeServerSession();

  dotenv.config();

  return await getUser();
}

export { LoginLink, LogoutLink };

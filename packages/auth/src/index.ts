import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

import * as dotenv from "dotenv";

export async function authenticateUser() {
  const { isAuthenticated } = getKindeServerSession();

  dotenv.config();

  console.log(dotenv.config());

  return await isAuthenticated();
}

"use server";

import { auth, signOut } from "@/auth";

export const deleteAccount = async (fd: FormData) => {
  // TODO Rate limit. Don't want an issue with the service to be exploited and send unlimited requests.
  const email = fd.get("email");
  const session = await auth();
  if (!session) throw new Error("User not logged in");
  else if (session.user?.email !== email)
    throw new Error("User not authorized");

  await signOut({ redirectTo: "/" });
  //   TODO Delete account in prisma
  //   Send the account to a temporary delete table, purge accounts after 2 weeks.
  console.log(fd);
};

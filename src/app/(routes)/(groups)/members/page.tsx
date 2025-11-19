import { getMembersNav } from "prisma/lib/members";
import { MembersClient } from "./_components/MembersClient";

export default async function Page() {
  const members = await getMembersNav();
  return <MembersClient members={members} />;
}

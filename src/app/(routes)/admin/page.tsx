import { redirect } from "next/navigation";

export default function Page() {
  if (process.env.NODE_ENV !== "development") redirect("/admmin");
  return <>Admin</>;
}

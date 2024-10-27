import { H1 } from "@/components/headings";
import { SubmissionForm } from "../submission/_components/form";

export default function Page() {
  return (
    <div className="m-16">
      <H1>Admin</H1>
      <div className="flex justify-center">
        <SubmissionForm />
      </div>
    </div>
  );
}

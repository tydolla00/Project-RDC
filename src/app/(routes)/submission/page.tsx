import { H1 } from "@/components/headings";
import { SubmissionForm } from "./_components/form";

export default function Page() {
  return (
    <div className="m-16">
      <H1>Want to help?</H1>
      <div className="flex justify-center">
        <SubmissionForm />
      </div>
    </div>
  );
}

import { H1 } from "@/components/headings";
import { SubmissionForm } from "./_components/form";
import { FeatureFlag } from "@/lib/featureflag";

export default function Page() {
  return (
    <div className="m-16">
      <H1>Want to help?</H1>
      <div className="flex justify-center">
        <FeatureFlag flagName="SUBMISSION_FORM" shouldRedirect={true} user={{}}>
          <SubmissionForm />
        </FeatureFlag>
      </div>
    </div>
  );
}

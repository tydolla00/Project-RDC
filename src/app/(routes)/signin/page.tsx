import { signIn } from "@/auth";
import { H1 } from "@/components/headings";
import { Button } from "@/components/ui/button";
import { domain } from "@/lib/utils";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export default function Page() {
  return (
    <div className="m-10">
      <H1>Sign in Page</H1>
      <div className="text-center">
        In order to submit scores you must be logged in. Please login with one
        of the providers below.
      </div>
      <div className="mx-auto mt-4 w-fit">
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: domain });
          }}
        >
          <Button className="focus-visible:bg-primary/90">
            Sign in with Github <GitHubLogoIcon />
          </Button>
        </form>
      </div>
    </div>
  );
}

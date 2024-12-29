import { H1 } from "@/components/headings";
import { SubmissionForm } from "./_components/form";
import { FeatureFlag } from "@/lib/featureflag";
import { auth } from "@/auth";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllSessions } from "../../../../prisma/lib/admin";
import { Suspense } from "react";

export default async function Page() {
  const session = await auth();
  return (
    <div className="m-16">
      <H1>Want to help?</H1>
      <Suspense>
        <SubmissionTable />
      </Suspense>
      {/* <div className="flex justify-center">
        <FeatureFlag
          flagName="SUBMISSION_FORM"
          shouldRedirect={true}
          user={session}
        >
          <SubmissionForm />
        </FeatureFlag>
      </div> */}
    </div>
  );
}

const SubmissionTable = async () => {
  const sessions = await getAllSessions();

  return (
    <Table>
      <TableCaption>A list of recent submissions</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Session ID</TableHead>
          <TableHead>Session Name</TableHead>
          <TableHead>Game</TableHead>
          <TableHead>Session URL</TableHead>
          <TableHead>Created At</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sessions.map((session) => (
          <TableRow key={session.sessionId}>
            <TableCell>{session.sessionId}</TableCell>
            <TableCell>{session.sessionName}</TableCell>
            <TableCell>{session.Game.gameName}</TableCell>
            <TableCell>{session.sessionUrl}</TableCell>
            <TableCell>{`${session.createdAt}`}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter></TableFooter>
    </Table>
  );
};

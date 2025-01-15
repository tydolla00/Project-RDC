import { H1 } from "@/components/headings";
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
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Page() {
  return (
    <div className="m-16">
      <H1>Sessions</H1>
      <Suspense fallback={<Skeleton className="h-72 w-full" />}>
        <SubmissionTable />
      </Suspense>
    </div>
  );
}

const SubmissionTable = async () => {
  const sessions = await getAllSessions();

  return (
    <>
      <Table>
        <TableCaption>A list of recent submissions</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Session ID</TableHead>
            <TableHead>Session Name</TableHead>
            <TableHead>Game</TableHead>
            <TableHead>Session URL</TableHead>
            <TableHead>Created At (EST)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <TableRow key={session.sessionId}>
              <TableCell>{session.sessionId}</TableCell>
              <TableCell>{session.sessionName}</TableCell>
              <TableCell>{session.Game.gameName}</TableCell>
              <TableCell className="hover:underline">
                <Link href={session.sessionUrl}>{session.sessionUrl}</Link>
              </TableCell>
              <TableCell>{`${new Date(session.createdAt).toLocaleString()}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter></TableFooter>
      </Table>
    </>
  );
};

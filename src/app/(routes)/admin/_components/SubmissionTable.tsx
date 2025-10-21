import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { PaginationButtons } from "../(admin_routes)/submissions/_components/PaginationButtons";
import prisma from "prisma/db";

export const SubmissionTable = async ({
  page = "1",
}: {
  page: string | undefined;
}) => {
  const currentPage = parseInt(page) || 1;
  const pageSize = 25;
  const [sessions, count] = await Promise.all([
    prisma.session.findMany({
      take: pageSize,
      where: { isApproved: false },
      skip: (currentPage - 1) * pageSize,
      select: {
        sessionId: true,
        sessionName: true,
        sessionUrl: true,
        createdAt: true,
        isApproved: true,
        Game: {
          select: { gameName: true },
        },
        sessionEditRequests: {
          select: { id: true },
        },
      },
    }),
    prisma.session.count({ where: { isApproved: false } }),
  ]);

  if (!sessions.length) {
    return <div>No sessions found</div>;
  }

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
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => (
            <TableRow key={session.sessionId}>
              <TableCell>{session.sessionId}</TableCell>
              <TableCell className="hover:underline">
                <Link href={`/admin/submissions/approve/${session.sessionId}`}>
                  {session.sessionName}
                </Link>
              </TableCell>
              <TableCell>{session.Game.gameName}</TableCell>
              <TableCell className="hover:underline">
                <Link
                  href={session.sessionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {session.sessionUrl}
                </Link>
              </TableCell>
              <TableCell>{`${new Date(session.createdAt).toLocaleString()}`}</TableCell>
              <TableCell>
                {session.isApproved ? "Approved" : "Pending"}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger className="cursor-pointer focus:outline-none">
                    <DotsVerticalIcon className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      disabled={session.sessionEditRequests.length === 0}
                      asChild
                    >
                      <Link
                        className="cursor-pointer"
                        href={`/admin/submissions/review/${session.sessionId}`}
                      >
                        Revisions ({session.sessionEditRequests.length})
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        className="cursor-pointer"
                        href={`/admin/submissions/edit/${session.sessionId}`}
                      >
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PaginationButtons page={currentPage} count={count} pageSize={pageSize} />
    </>
  );
};

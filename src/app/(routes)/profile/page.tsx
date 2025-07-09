import { auth } from "@/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Icon from "@/app/favicon.ico";
import { H1 } from "@/components/headings";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Session } from "next-auth";
import { DeleteAccountForm } from "./_components/DeleteAccountForm";

export default async function Page() {
  const session = (await auth()) as Session;
  console.log(session);

  // Mask email for privacy
  const maskedEmail = session?.user?.email
    ? session.user.email.replace(/(.{2}).+(@.+)/, "$1***$2")
    : "";

  return (
    <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-200 p-8 shadow-xl dark:border-[#23232a] dark:from-[#18181b] dark:to-[#23232a]">
      <div className="flex flex-col items-center gap-8 md:flex-row">
        <Avatar className="ring-chart-4 h-40 w-40 shadow-lg ring-4">
          <AvatarImage src={session?.user?.image || Icon.src} />
          <AvatarFallback className="bg-chart-4 text-3xl text-white">
            {session?.user?.name?.[0] || "U"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <H1 className="text-chart-4 mb-2 text-4xl font-bold">
            {session?.user?.name}
          </H1>
          <div className="flex items-center gap-2 text-lg text-slate-600 dark:text-slate-300">
            <span className="font-semibold">Email:</span>
            <span className="rounded bg-slate-100 px-2 py-1 font-mono dark:bg-[#23232a]">
              {maskedEmail}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <TabsDemo email={session.user?.email} />
      </div>
    </div>
  );
}

function TabsDemo({ email }: { email: string | null | undefined }) {
  return (
    <Tabs defaultValue="account" className="bg-transparent">
      <TabsList className="bg-inherit">
        <TabsTrigger
          className="data-[state=active]:bg-chart-4 cursor-pointer"
          value="submissions"
        >
          Submissions
        </TabsTrigger>
        <TabsTrigger
          className="data-[state=active]:bg-chart-4 cursor-pointer"
          value="settings"
        >
          Settings
        </TabsTrigger>
        <TabsTrigger
          className="data-[state=active]:bg-chart-4 cursor-pointer"
          value="favorites"
        >
          Favorites
        </TabsTrigger>
      </TabsList>
      <TabsContent value="submissions">
        <div>Submissions content</div>
      </TabsContent>
      <TabsContent value="settings">
        <div>Settings content</div>
        <DialogDemo email={email} />
      </TabsContent>
      <TabsContent value="favorites">
        <div>Favorites content</div>
      </TabsContent>
    </Tabs>
  );
}

function DialogDemo({ email }: { email: string | null | undefined }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="cursor-pointer" variant="destructive">
          Delete account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription className="select-none">
            We hate to see you go. Are you sure you want to delete your account?
            To confirm please type <b>{email}</b>
          </DialogDescription>
        </DialogHeader>
        <DeleteAccountForm email={email} />
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

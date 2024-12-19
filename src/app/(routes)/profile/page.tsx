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
  return (
    <div className="m-16">
      <div className="flex">
        <Avatar className="h-72 w-72">
          <AvatarImage src={session?.user?.image || Icon.src}></AvatarImage>
          <AvatarFallback>User Icon</AvatarFallback>
        </Avatar>
        <div>
          <H1>{session?.user?.name}</H1>
          {/* TODO Mask Email */}
          <div className="truncate">{session?.user?.email}</div>
        </div>
      </div>
      <TabsDemo email={session.user?.email} />
    </div>
  );
}

function TabsDemo({ email }: { email: string | null | undefined }) {
  return (
    <Tabs defaultValue="account" className="bg-transparent">
      <TabsList className="bg-inherit">
        <TabsTrigger
          className="data-[state=active]:bg-chart-4"
          value="submissions"
        >
          Submissions
        </TabsTrigger>
        <TabsTrigger
          className="data-[state=active]:bg-chart-4"
          value="settings"
        >
          Settings
        </TabsTrigger>
        <TabsTrigger
          className="data-[state=active]:bg-chart-4"
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
        <Button variant="destructive">Delete account</Button>
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

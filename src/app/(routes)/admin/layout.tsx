import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
// import { VersionSwitcher } from "@/components/version-switcher";
import { AdminProvider } from "@/lib/adminContext";
import { Separator } from "@radix-ui/react-separator";
import { Gamepad, Home, Notebook } from "lucide-react";
import { cookies, headers } from "next/headers";
import Link from "next/link";

const items = [
  { label: "Dashboard", icon: Home, href: "/admin" },
  { label: "Submissions", icon: Notebook, href: "/admin/submissions" },
  { label: "Update", icon: Gamepad, href: "/admin/update" },
];

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  const headersList = await headers();
  const pathname = headersList.get("x-invoke-path") || "";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AdminSidebar pathname={pathname} />
      <SidebarInset className="m-16">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">
                  Building Your Application
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <AdminProvider>{children}</AdminProvider>
      </SidebarInset>
    </SidebarProvider>
  );
}

const AdminSidebar = ({
  pathname,
  ...props
}: React.ComponentProps<typeof Sidebar> & { pathname: string }) => (
  <Sidebar {...props}>
    <SidebarHeader>
      {/* <VersionSwitcher
          versions={data.versions}
          defaultVersion={data.versions[0]}
        />
        <SearchForm /> */}
    </SidebarHeader>
    <SidebarContent>
      {/* We create a SidebarGroup for each parent. */}
      {items.map((item) => (
        <SidebarGroup key={item.label}>
          <SidebarGroupLabel>{item.label}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild isActive={pathname === item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </SidebarContent>
    <SidebarRail />
  </Sidebar>
);

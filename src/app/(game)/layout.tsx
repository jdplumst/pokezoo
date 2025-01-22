import { SidebarProvider, SidebarTrigger } from "@/src/components/ui/sidebar";
import { AppSidebar } from "@/src/components/app-sidebar";
import { Toaster } from "@/src/components/ui/toaster";
import Topbar from "../_components/Topbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger className="sticky top-0" />
        <Topbar />
        {children}
      </main>
      <Toaster />
    </SidebarProvider>
  );
}

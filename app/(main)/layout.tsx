import { AppSidebar } from "@/components/sideBar";
import { SidebarProvider } from "@/components/ui/sidebar";


export default function DashLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
          <SidebarProvider>
            <AppSidebar/>
            <main className="h-screen w-full overflow-y-auto">
              {children}
            </main>
          </SidebarProvider>
  );
}

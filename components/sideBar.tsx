import { 
  Table, 
  FileText, 
  MessageSquare, 
  Mail, 
  File, 
  BarChart3, 
  Component, 
  Shield, 
  ChevronDown 
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const mainItems = [
  {
    title: "Tables",
    url: "#",
    icon: Table,
    hasDropdown: true,
  },
  {
    title: "Pages",
    url: "#",
    icon: FileText,
    hasDropdown: true,
  },
]

const supportItems = [
  {
    title: "Messages",
    url: "#",
    icon: MessageSquare,
    badge: "9",
    isPro: true,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Mail,
    isPro: true,
  },
  {
    title: "Invoice",
    url: "#",
    icon: File,
    isPro: true,
  },
]

const otherItems = [
  {
    title: "Charts",
    url: "#",
    icon: BarChart3,
    hasDropdown: true,
  },
  {
    title: "UI Elements",
    url: "#",
    icon: Component,
    hasDropdown: true,
  },
  {
    title: "Authentication",
    url: "#",
    icon: Shield,
    hasDropdown: true,
  },
]

export function AppSidebar() {
  return (
<Sidebar className="w-64 border-r border-gray-200 bg-white">
  <SidebarContent className="px-0">
    <div className="px-6 py-6 border-b border-gray-100">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white rounded-full border-dashed"></div>
        </div>
        <span className="text-xl font-semibold text-gray-900">Care Manage</span>
      </div>
    </div>

    <div className="px-4 py-4">
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {mainItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild className="h-11 px-3 mb-1 hover:bg-gray-100 rounded-lg">
                  <a href={item.url} className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-gray-500 hover:text-black" />
                      <span className="text-gray-700 hover:text-black font-medium">{item.title}</span>
                    </div>
                    {item.hasDropdown && (
                      <ChevronDown className="w-4 h-4 text-gray-400 hover:text-black" />
                    )}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </div>

    <div className="px-4 py-2">
      <SidebarGroup>
        <SidebarGroupLabel className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          SUPPORT
        </SidebarGroupLabel>
        <SidebarGroupContent className="mt-2">
          <SidebarMenu>
            {supportItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild className="h-11 px-3 mb-1 hover:bg-gray-100 rounded-lg">
                  <a href={item.url} className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-gray-500 hover:text-black" />
                      <span className="text-gray-700 hover:text-black font-medium">{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className="w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                          {item.badge}
                        </span>
                      )}
                      {item.isPro && (
                        <span className="px-2 py-1 bg-black text-white text-xs font-medium rounded">
                          Pro
                        </span>
                      )}
                    </div>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </div>

    <div className="px-4 py-2">
      <SidebarGroup>
        <SidebarGroupLabel className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          OTHERS
        </SidebarGroupLabel>
        <SidebarGroupContent className="mt-2">
          <SidebarMenu>
            {otherItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild className="h-11 px-3 mb-1 hover:bg-gray-100 rounded-lg">
                  <a href={item.url} className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5 text-gray-500 hover:text-black" />
                      <span className="text-gray-700 hover:text-black font-medium">{item.title}</span>
                    </div>
                    {item.hasDropdown && (
                      <ChevronDown className="w-4 h-4 text-gray-400 hover:text-black" />
                    )}
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </div>
  </SidebarContent>
</Sidebar>

  )
}
"use client";
import { 
  ChevronDown, 
  X
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
  useSidebar,
} from "@/components/ui/sidebar"
import { mainItems, otherItems, supportItems } from "@/lib/constants"
import Link from "next/link"
import { Button } from "./ui/button"
import { signOut } from "next-auth/react"

export function AppSidebar() {
  const { toggleSidebar, isMobile } = useSidebar()

  return (
    <Sidebar className="w-64 border-r border-gray-200 bg-white">
      <SidebarContent className="px-0">
        <div className="px-6 py-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white rounded-full border-dashed"></div>
              </div>
              <span className="text-xl font-semibold text-gray-900">Care Manage</span>
            </div>
            
            {/* Mobile close button */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="h-8 w-8 rounded-md hover:bg-gray-100 md:hidden"
              >
                <X className="h-4 w-4 text-gray-600" />
                <span className="sr-only">Close sidebar</span>
              </Button>
            )}
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
              Contact
            </SidebarGroupLabel>
            <SidebarGroupContent className="mt-2">
              <SidebarMenu>
                {supportItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="h-11 px-3 mb-1 hover:bg-gray-100 rounded-lg">
                      <Link href={item.url} className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5 text-gray-500 hover:text-black" />
                          <span className="text-gray-700 hover:text-black font-medium">{item.title}</span>
                        </div>
                      </Link>
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
                      <Button onClick={() => signOut()} className="flex bg-neutral-50 shadow-none items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5 text-gray-500 hover:text-black" />
                          <span className="text-gray-700 hover:text-black font-medium">{item.title}</span>
                        </div>
                        {item.hasDropdown && (
                          <ChevronDown className="w-4 h-4 text-gray-400 hover:text-black" />
                        )}
                      </Button>
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
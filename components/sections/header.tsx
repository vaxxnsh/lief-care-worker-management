"use client";
import { Search, Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

import { useSession, signOut} from 'next-auth/react';
import { useSidebar } from '@/components/ui/sidebar';

export function Header() {
    const session = useSession();
    const user = session.data?.user;
    const avatarImage = "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400";
    const { toggleSidebar } = useSidebar();

    return (
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
                {/* Sidebar Trigger */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="h-9 w-9 rounded-md hover:bg-gray-100 transition-colors"
                >
                    <Menu className="h-5 w-5 text-gray-600" />
                    <span className="sr-only">Toggle sidebar</span>
                </Button>

                <div className="flex-1 min-w-0 ml-4">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Dashboard</h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 hidden sm:block">Manage Your Organization here</p>
                </div>

                <div className="flex items-center space-x-2 sm:space-x-4">
                    {/* Search Input - Desktop */}
                    <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search"
                            className="pl-10 w-60 lg:w-80 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                        />
                    </div>

                    {/* Search Button - Mobile */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 md:hidden rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <Search className="h-4 w-4 text-gray-600" />
                    </Button>

                    {/* Notifications */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors relative"
                    >
                        <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                        <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                            3
                        </Badge>
                    </Button>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-auto rounded-full p-0">
                                <div className="flex items-center space-x-2 sm:space-x-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full hover:bg-gray-100 transition-colors">
                                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                                        <AvatarImage src={user?.image ?? avatarImage} alt="John Smith" />
                                        <AvatarFallback className="text-xs sm:text-sm">JS</AvatarFallback>
                                    </Avatar>
                                    
                                    {/* User name and chevron - hidden on mobile */}
                                    <div className="hidden sm:flex items-center space-x-1">
                                        <span className="text-sm font-medium text-gray-900 max-w-24 lg:max-w-none truncate">
                                            {user?.name || "John Smith"}
                                        </span>
                                        <svg
                                            className="h-4 w-4 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{user?.name || "dummy name"}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {user?.email || "dummyEmail@gmail.com"}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => signOut()}>Log out</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ChannelData {
  id: string;
  source: string;
  icon: React.ReactNode;
  visitors: string;
  revenues: string;
  sales: string;
  conversion: string;
}

const channelData: ChannelData[] = [
  {
    id: '1',
    source: 'Google',
    icon: (
      <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center">
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      </div>
    ),
    visitors: '3.5K',
    revenues: '$4,220.00',
    sales: '3456',
    conversion: '2.59%',
  },
  {
    id: '2',
    source: 'X.com',
    icon: (
      <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </div>
    ),
    visitors: '3.5K',
    revenues: '$4,220.00',
    sales: '3456',
    conversion: '2.59%',
  },
  {
    id: '3',
    source: 'Github',
    icon: (
      <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
      </div>
    ),
    visitors: '3.5K',
    revenues: '$4,220.00',
    sales: '3456',
    conversion: '2.59%',
  },
  {
    id: '4',
    source: 'Vimeo',
    icon: (
      <div className="w-8 h-8 rounded-full bg-[#1ab7ea] flex items-center justify-center">
        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
          <path d="M23.977 6.416c-.105 2.338-1.739 5.543-4.894 9.609-3.268 4.247-6.026 6.37-8.29 6.37-1.409 0-2.578-1.294-3.553-3.881L5.322 11.4C4.603 8.816 3.834 7.522 3.01 7.522c-.179 0-.806.378-1.881 1.132L0 7.197a315.065 315.065 0 0 0 4.192-3.729C5.978 2.4 7.333 1.718 8.222 1.718c2.166-.183 3.518 1.291 4.06 4.413.584 3.376.988 5.473 1.214 6.286.678 3.047 1.424 4.572 2.24 4.572.63 0 1.579-.996 2.847-2.991 1.268-1.993 1.95-3.512 2.05-4.558.198-1.762-.505-2.637-2.111-2.637-.75 0-1.524.229-2.324.687 1.544-5.056 4.493-7.510 8.848-7.364 3.232.103 4.753 2.184 4.574 6.24z"/>
        </svg>
      </div>
    ),
    visitors: '3.5K',
    revenues: '$4,220.00',
    sales: '3456',
    conversion: '2.59%',
  },
  {
    id: '5',
    source: 'Facebook',
    icon: (
      <div className="w-8 h-8 rounded-full bg-[#1877f2] flex items-center justify-center">
        <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      </div>
    ),
    visitors: '3.5K',
    revenues: '$4,220.00',
    sales: '3456',
    conversion: '2.59%',
  },
];

export function TopChannels() {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-xl font-semibold">Top Channels</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Export Data</DropdownMenuItem>
            <DropdownMenuItem>Refresh</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="space-y-4">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-500 uppercase tracking-wide pb-2 border-b border-gray-100">
            <div className="col-span-3">SOURCE</div>
            <div className="col-span-2 text-center">VISITORS</div>
            <div className="col-span-2 text-center">REVENUES</div>
            <div className="col-span-2 text-center">SALES</div>
            <div className="col-span-3 text-center">CONVERSION</div>
          </div>

          {/* Table Rows */}
          <div className="space-y-3">
            {channelData.map((channel) => (
              <div
                key={channel.id}
                className="grid grid-cols-12 gap-4 items-center py-3 hover:bg-gray-50 rounded-lg transition-colors duration-150"
              >
                <div className="col-span-3 flex items-center space-x-3">
                  {channel.icon}
                  <span className="font-medium text-gray-900">{channel.source}</span>
                </div>
                <div className="col-span-2 text-center font-medium text-gray-900">
                  {channel.visitors}
                </div>
                <div className="col-span-2 text-center font-semibold text-green-600">
                  {channel.revenues}
                </div>
                <div className="col-span-2 text-center font-medium text-gray-900">
                  {channel.sales}
                </div>
                <div className="col-span-3 text-center font-medium text-gray-900">
                  {channel.conversion}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
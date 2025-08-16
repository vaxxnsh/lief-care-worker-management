'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MoreHorizontal, Clock, MapPin, User, Calendar, Loader2, AlertTriangle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useQuery } from '@apollo/client';
import { GET_CLOCKED_IN_EMPLOYEES } from '@/lib/graphql';

interface ClockInEmployee {
  id: string;
  date: string;
  clockInLat: number;
  clockInLng: number;
  clockOutLat: number | null;
  clockOutLng: number | null;
  status: string;
  clockInAt: string;
  clockOutAt: string | null;
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: string | null;
    image: string | null;
  };
}

export interface GetClockInEmployeesData {
  getClockInEmployees: ClockInEmployee[];
}

export interface GetClockInEmployeesVars {
  orgId: string;
}



export default function ClockedInEmployees({orgId} : {orgId : string}) {
  const { data, loading, error, refetch } = useQuery<GetClockInEmployeesData, GetClockInEmployeesVars>(GET_CLOCKED_IN_EMPLOYEES, {
    variables: { orgId },
    fetchPolicy: 'network-only',
  });

  const employees = data?.getClockInEmployees ?? [];



  return (
  <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-gray-100">
        <div>
          <CardTitle className="flex items-center text-gray-900">
            <Clock className="w-5 h-5 mr-2 text-gray-600" />
            Today&apos;s Attendance
          </CardTitle>
          <p className="text-sm text-gray-500 mt-1">
            {employees.length} employee{employees.length !== 1 ? 's' : ''} currently working
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => refetch()}>Refresh Data</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent>
        {loading && (
          <div className="flex items-center justify-center py-12 text-gray-500">
            <Loader2 className="animate-spin w-6 h-6 mr-2" />
            Loading employees...
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-600">
            <AlertTriangle className="w-8 h-8 mb-2" />
            <p className="font-medium">Failed to load employees</p>
            <Button variant="outline" size="sm" className="mt-2" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        )}

        {!loading && !error && employees.length === 0 && (
          <div className="text-center py-12 px-6">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No employees clocked in</h3>
            <p className="text-gray-500">
              All employees are currently offline or haven&apos;t clocked in yet today.
            </p>
          </div>
        )}

        {!loading && !error && employees.length > 0 && (
          <div className="overflow-x-auto">
            {/* Mobile View */}
            <div className="block md:hidden">
              {employees.map((employee) => (
                <div key={employee.id} className="p-4 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar>
                      <AvatarFallback className="bg-gray-100 text-gray-600 font-semibold">
                        {getInitials(employee.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{employee.user.name}</p>
                      <p className="text-sm text-gray-500 truncate">{employee.user.email}</p>
                    </div>
                    {/* <Badge className={getStatusBadge(employee.status)}>
                      {employee.status}
                    </Badge> */}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Clock In</span>
                      <div className="font-medium text-gray-900">{formatTime(employee.clockInAt)}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Working Time</span>
                      <div className="font-semibold text-gray-900">{calculateWorkingHours(employee.clockInAt)}</div>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Location</span>
                      <div className="flex items-center text-gray-600 font-mono text-xs">
                        <MapPin className="w-3 h-3 mr-1" />
                        {employee.clockInLat.toFixed(2)}, {employee.clockInLng.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden md:block">
              <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wide bg-gray-50 border-b border-gray-100">
                <div className="col-span-4">Employee</div>
                <div className="col-span-2 text-center">Status</div>
                <div className="col-span-2 text-center">Clock In</div>
                <div className="col-span-2 text-center">Working Time</div>
                <div className="col-span-2 text-center">Location</div>
              </div>

              {employees.map((employee) => (
                <div
                  key={employee.id}
                  className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="col-span-4 flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-gray-100 text-gray-600 font-semibold">
                        {getInitials(employee.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate">{employee.user.name}</p>
                      <p className="text-sm text-gray-500 truncate">{employee.user.email}</p>
                    </div>
                  </div>

                  <div className="col-span-2 flex justify-center">
                    {/* <Badge className={getStatusBadge(employee.status)}>
                      {employee.status}
                    </Badge> */}
                  </div>

                  <div className="col-span-2 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-medium text-gray-900">
                        {formatTime(employee.clockInAt)}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatDate(employee.date)}
                      </span>
                    </div>
                  </div>

                  <div className="col-span-2 text-center">
                    <div className="flex flex-col items-center">
                      <span className="font-semibold text-gray-900">
                        {calculateWorkingHours(employee.clockInAt)}
                      </span>
                      <span className="text-xs text-gray-500">and counting</span>
                    </div>
                  </div>

                  <div className="col-span-2 text-center">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="font-mono text-xs">
                          {employee.clockInLat.toFixed(2)}, {employee.clockInLng.toFixed(2)}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 mt-1">Still active</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
  </Card>
  );
}


  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const calculateWorkingHours = (clockInAt: string) => {
    const clockIn = new Date(clockInAt);
    const now = new Date();
    const diff = now.getTime() - clockIn.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

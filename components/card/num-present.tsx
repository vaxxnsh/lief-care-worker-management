'use client';

import { useQuery } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Users, Calendar, UserCheck, UserX } from 'lucide-react';
import { GET_CLOCKED_IN_EMPLOYEES } from '@/lib/graphql';
import { GetClockInEmployeesData, GetClockInEmployeesVars } from './clocked-in-emp';

interface Attendance {
  id: string;
  date: string;
  clockInAt: string;
  clockOutAt: string | null;
  status: string;
  user: { id: string; name: string };
}


function getDailyAttendanceCount(attendances: Attendance[]) {
  const dailyData: Record<
    string,
    { present: Set<string>; absent: Set<string>; late: Set<string> }
  > = {};

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return formatLocalDate(d); // local date, not UTC
  });

  last7Days.forEach((date) => {
    dailyData[date] = { present: new Set(), absent: new Set(), late: new Set() };
  });

  attendances.forEach((attendance) => {
    const attendanceDate = formatLocalDate(new Date(attendance.date));
    if (!dailyData[attendanceDate]) return;

    const userId = attendance.user.id;

    switch (attendance.status) {
      case "PRESENT":
        dailyData[attendanceDate].present.add(userId);
        break;
      case "CHECKED_OUT":
        dailyData[attendanceDate].present.add(userId);
        dailyData[attendanceDate].late.add(userId);
        break;
      case "ABSENT":
        dailyData[attendanceDate].absent.add(userId);
        break;
    }
  });

  return last7Days.map((date) => {
    const data = dailyData[date];
    return {
      date,
      dayName: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
      fullDate: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      present: data.present.size,
      late: data.late.size,
      absent: data.absent.size,
      total: data.present.size + data.absent.size,
    };
  });
}

function formatLocalDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getWeekStats(
  data: { present: number; absent: number; late: number; total: number }[]
) {
  const totalPresent = data.reduce((sum, d) => sum + d.present, 0);
  const totalAbsent = data.reduce((sum, d) => sum + d.absent, 0);
  const totalLate = data.reduce((sum, d) => sum + d.late, 0);
  const avgDaily = data.reduce((sum, d) => sum + d.total, 0) / (data.length || 1);
  const bestDay = Math.max(...(data.map((d) => d.present) as number[]), 0);

  return {
    totalPresent,
    totalAbsent,
    totalLate,
    avgDaily: Math.round(avgDaily * 10) / 10,
    bestDay,
    attendanceRate:
      totalPresent + totalAbsent > 0
        ? Math.round((totalPresent / (totalPresent + totalAbsent)) * 100)
        : 0,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;

    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg min-w-[180px]">
        <p className="font-semibold text-gray-900 mb-3">{data.fullDate}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="text-sm text-gray-600">Present:</span>
            </div>
            <span className="font-bold text-green-600">{data.present}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};



interface EmployeeAttendanceChartProps {
  orgId: string;
}

export default function EmployeeAttendanceChart({
  orgId,
}: EmployeeAttendanceChartProps) {
  const { data, loading, error } = useQuery<
    GetClockInEmployeesData,
    GetClockInEmployeesVars
  >(GET_CLOCKED_IN_EMPLOYEES, {
    variables: { orgId },
  });

  if (loading) {
    return (
      <Card className="hover:shadow-sm transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            <span className="text-lg font-semibold text-gray-900">Loading attendance data...</span>
          </div>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="text-gray-500">
            Analyzing employee attendance patterns...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="hover:shadow-sm transition-shadow border-gray-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Error Loading Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
            Error: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = getDailyAttendanceCount(data?.getClockInEmployees || []);
  const weekStats = getWeekStats(chartData);

  return (
<Card className="hover:shadow-sm transition-shadow w-full pb-0 gap-0">
<CardHeader className="border-b border-gray-100 pb-3">
 <div className="flex items-center space-x-3">
   <div className="p-1.5 bg-gray-100 rounded-lg">
     <Users className="w-5 h-5 text-gray-600" />
   </div>
   <div>
     <CardTitle className="text-lg font-semibold text-gray-900">
       Daily Attendance
     </CardTitle>
     <p className="text-xs text-gray-500 mt-0.5">
       Employee presence over the last 7 days
     </p>
   </div>
 </div>

 <div className="mt-4">
   <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
     <div className="text-center">
       <div className="text-xl font-bold text-gray-900">{weekStats.totalPresent}</div>
       <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
         Total Present
       </div>
     </div>
     <div className="text-center">
       <div className="text-xl font-bold text-gray-900">
         {weekStats.attendanceRate}%
       </div>
       <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
         Attendance Rate
       </div>
     </div>
     <div className="text-center">
       <div className="text-xl font-bold text-gray-900">{weekStats.avgDaily}</div>
       <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Avg Daily</div>
     </div>
     <div className="text-center">
       <div className="text-xl font-bold text-gray-900">{weekStats.bestDay}</div>
       <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Best Day</div>
     </div>
   </div>
 </div>

 {/* Performance Indicators */}
 <div className="flex flex-wrap items-center gap-3 mt-4 pt-3 border-t border-gray-100">
   <div className="flex items-center space-x-1.5">
     <Calendar className="w-3.5 h-3.5 text-gray-400" />
     <span className="text-xs text-gray-600">Last 7 days tracking</span>
   </div>
   <div className="flex items-center space-x-1.5">
     <UserCheck className="w-3.5 h-3.5 text-gray-400" />
     <span className="text-xs text-gray-600">{weekStats.totalLate} late arrivals</span>
   </div>
   <div className="flex items-center space-x-1.5">
     <UserX className="w-3.5 h-3.5 text-gray-400" />
     <span className="text-xs text-gray-600">{weekStats.totalAbsent} absences</span>
   </div>
   <Badge
     className={`text-xs ${
       weekStats.attendanceRate >= 90
         ? 'bg-green-100 text-green-800'
         : weekStats.attendanceRate >= 75
         ? 'bg-yellow-100 text-yellow-800'
         : 'bg-red-100 text-red-800'
     }`}
   >
     {weekStats.attendanceRate >= 90
       ? 'Excellent Attendance'
       : weekStats.attendanceRate >= 75
       ? 'Good Attendance'
       : 'Needs Improvement'}
   </Badge>
 </div>
</CardHeader>

 <CardContent className="px-4 pt-6 pb-4">
   <div className="h-[320px]">
     <ResponsiveContainer width="100%" height="100%">
       <BarChart data={chartData} barCategoryGap="25%">
         <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
         <XAxis
           dataKey="dayName"
           axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
           tickLine={{ stroke: '#d1d5db' }}
           tick={{ fontSize: 12, fill: '#6b7280' }}
         />
         <YAxis
           axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
           tickLine={{ stroke: '#d1d5db' }}
           tick={{ fontSize: 12, fill: '#6b7280' }}
           label={{
             value: 'Number of Employees',
             angle: -90,
             position: 'insideLeft',
             style: { textAnchor: 'middle', fill: '#6b7280', fontSize: '12px' },
           }}
         />
         <Tooltip content={<CustomTooltip />} />

         {/* Single bar for PRESENT only */}
         <Bar
           dataKey="present"
           fill="#10b981"
           radius={[6, 6, 0, 0]}
           name="Present"
         />
       </BarChart>
     </ResponsiveContainer>
   </div>
 </CardContent>
</Card>
  );
}

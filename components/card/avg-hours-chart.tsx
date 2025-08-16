'use client';

import { useQuery } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { TrendingUp, Calendar, Target, Activity } from 'lucide-react';
import { GET_CLOCKED_IN_EMPLOYEES } from '@/lib/graphql';
import { GetClockInEmployeesData, GetClockInEmployeesVars } from './clocked-in-emp';

interface Attendance {
  id: string;
  date: string;
  clockInAt: string;
  clockOutAt: string | null;
  user: { id: string; name: string };
}

export default function WeeklyAvgHoursChart({ orgId }: { orgId: string }) {
  const { data, loading, error } = useQuery<GetClockInEmployeesData, GetClockInEmployeesVars>(GET_CLOCKED_IN_EMPLOYEES, {
    variables: { orgId },
  });

  if (loading) {
    return (
      <Card className="hover:shadow-sm transition-shadow">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            <span className="text-lg font-semibold text-gray-900">Loading weekly attendance...</span>
          </div>
        </CardHeader>
        <CardContent className="h-[400px] flex items-center justify-center">
          <div className="text-gray-500">Analyzing last 7 days of attendance data...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
    <Card className="hover:shadow-sm transition-shadow border-gray-200">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Error Loading Data</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-200">
          Error: {error.message}
        </div>
      </CardContent>
    </Card>
    );
  }

  const chartData = getDailyAverageHours(data?.getClockInEmployees || []);
  const weekStats = getWeekStats(chartData);

  return (
<Card className="hover:shadow-sm transition-shadow w-full">
 <CardHeader className="border-b border-gray-100 pb-4">
   <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
     <div className="flex items-center space-x-3">
       <div className="p-2 bg-gray-100 rounded-lg">
         <Activity className="w-6 h-6 text-gray-600" />
       </div>
       <div>
         <CardTitle className="text-lg font-semibold text-gray-900">Weekly Average Hours</CardTitle>
         <p className="text-sm text-gray-500 mt-1">Daily productivity trends over the last 7 days</p>
       </div>
     </div>
     
     <div className="grid grid-cols-3 gap-4">
       <div className="text-center">
         <div className="text-2xl font-bold text-gray-900">{weekStats.weeklyAvg}h</div>
         <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Weekly Avg</div>
       </div>
       <div className="text-center">
         <div className="text-2xl font-bold text-gray-900">{weekStats.bestDay}h</div>
         <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Best Day</div>
       </div>
       <div className="text-center">
         <div className="text-2xl font-bold text-gray-900">{weekStats.totalShifts}</div>
         <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">Total Shifts</div>
       </div>
     </div>
   </div>

   <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-gray-100">
     <div className="flex items-center space-x-2">
       <Calendar className="w-4 h-4 text-gray-400" />
       <span className="text-sm text-gray-600">Last 7 days</span>
     </div>
     <div className="flex items-center space-x-2">
       <Target className="w-4 h-4 text-gray-400" />
       <span className="text-sm text-gray-600">Target: 8 hours/day</span>
     </div>
     <div className="flex items-center space-x-2">
       <TrendingUp className="w-4 h-4 text-gray-400" />
       <Badge className="text-xs bg-gray-100 text-gray-700">
         Avg {weekStats.avgEmployees} employees/day
       </Badge>
     </div>
     <div className="flex items-center space-x-2">
       <Badge 
         className={`text-xs ${
           weekStats.weeklyAvg >= 8 ? 'bg-green-100 text-green-800' : 
           weekStats.weeklyAvg >= 6 ? 'bg-yellow-100 text-yellow-800' : 
           'bg-red-100 text-red-800'
         }`}
       >
         {weekStats.weeklyAvg >= 8 ? 'Excellent' : 
          weekStats.weeklyAvg >= 6 ? 'Good' : 
          'Needs Improvement'}
       </Badge>
     </div>
   </div>
 </CardHeader>

 <CardContent className="p-6">
   <div className="h-[350px] w-full">
     <ResponsiveContainer width="100%" height="100%">
       <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
         <defs>
           <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
             <stop offset="0%" stopColor="#6b7280" stopOpacity={0.3} />
             <stop offset="100%" stopColor="#6b7280" stopOpacity={0.1} />
           </linearGradient>
         </defs>
         
         <CartesianGrid 
           strokeDasharray="3 3" 
           className="opacity-20" 
           stroke="#e5e7eb"
         />
         
         <XAxis 
           dataKey="dayName"
           tick={{ fontSize: 11, fill: '#6b7280' }}
           axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
           tickLine={{ stroke: '#d1d5db' }}
         />
         
         <YAxis 
           tick={{ fontSize: 11, fill: '#6b7280' }}
           axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
           tickLine={{ stroke: '#d1d5db' }}
           label={{ 
             value: 'Average Hours', 
             angle: -90, 
             position: 'insideLeft',
             style: { textAnchor: 'middle', fill: '#6b7280', fontSize: '12px' }
           }}
           domain={[0, 'dataMax + 1']}
         />
         
         {/* Target line at 8 hours */}
         <ReferenceLine 
           y={8} 
           stroke="#ef4444" 
           strokeDasharray="5 5" 
           strokeWidth={2}
           label={{ 
             value: "Daily Target: 8h", 
             position: "insideTopRight",
             style: { fill: '#ef4444', fontSize: '11px', fontWeight: 'bold' }
           }}
         />
         
         <Tooltip content={<CustomTooltip />} />
         
         <Area
           type="monotone"
           dataKey="avgHours"
           stroke="#6b7280"
           strokeWidth={3}
           fill="url(#areaGradient)"
           dot={{ 
             fill: '#6b7280', 
             strokeWidth: 2, 
             stroke: '#ffffff',
             r: 5 
           }}
           activeDot={{ 
             r: 7, 
             stroke: '#6b7280', 
             strokeWidth: 2,
             fill: '#ffffff'
           }}
         />
       </AreaChart>
     </ResponsiveContainer>
   </div>
 </CardContent>
</Card>
  );
}

function getDailyAverageHours(attendances: Attendance[]) {
 
  const dailyData: Record<string, { totalHours: number; employeeCount: number; completedShifts: number }> = {};


  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return formatLocalDate(date); 
  });


  last7Days.forEach(date => {
    dailyData[date] = { totalHours: 0, employeeCount: 0, completedShifts: 0 };
  });

  attendances.forEach(attendance => {
   
    const attendanceDate = formatLocalDate(new Date(attendance.date));
    if (!dailyData[attendanceDate]) return;

    dailyData[attendanceDate].employeeCount += 1;

    if (attendance.clockOutAt) {
      const hours =
        (new Date(attendance.clockOutAt).getTime() -
          new Date(attendance.clockInAt).getTime()) /
        (1000 * 60 * 60);
      dailyData[attendanceDate].totalHours += hours;
      dailyData[attendanceDate].completedShifts += 1;
    }
  });

  return last7Days.map(date => {
    const data = dailyData[date];
    const avgHours =
      data.completedShifts > 0
        ? Number((data.totalHours / data.completedShifts).toFixed(2))
        : 0;

    return {
      date,
      dayName: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
      fullDate: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      avgHours,
      totalEmployees: data.employeeCount,
      completedShifts: data.completedShifts,
    };
  });
}


function formatLocalDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}



function getWeekStats(data: { avgHours: number; totalEmployees: number; completedShifts: number }[]) {
  if (data.length === 0) {
    return { weeklyAvg: 0, bestDay: 0, totalShifts: 0, avgEmployees: 0 };
  }

  const hours = data.map(d => d.avgHours); 
  const totalShifts = data.reduce((sum, d) => sum + d.completedShifts, 0);
  const totalEmployeeCount = data.reduce((sum, d) => sum + d.totalEmployees, 0);

  return {
    weeklyAvg: Number((hours.reduce((a, b) => a + b, 0) / data.length).toFixed(2)), 
    bestDay: Math.max(...hours), 
    totalShifts,
    avgEmployees: Number((totalEmployeeCount / data.length).toFixed(1)),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const hours = payload[0].value;
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg min-w-[200px]">
        <p className="font-semibold text-gray-900 mb-2">{data.fullDate}</p>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Average Hours:</span>
            <span className="font-bold text-blue-600">
              {hours > 0 ? `${wholeHours}h ${minutes}m` : 'No data'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Total Employees:</span>
            <span className="font-medium text-gray-900">{data.totalEmployees}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Completed Shifts:</span>
            <span className="font-medium text-gray-900">{data.completedShifts}</span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t text-xs text-gray-500">
          {hours >= 8 ? '✅ Great performance' : hours >= 6 ? '⚠️ Moderate performance' : hours > 0 ? '🔴 Below target' : '⭕ No completed shifts'}
        </div>
      </div>
    );
  }
  return null;
};


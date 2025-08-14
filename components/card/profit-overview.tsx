'use client';

import { useQuery } from '@apollo/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import { TrendingUp, Calendar, Target, Activity } from 'lucide-react';
import { GET_CLOCKED_IN_EMPLOYEES } from '@/lib/graphql';
import { GetClockInEmployeesData, GetClockInEmployeesVars } from './present-employees';

interface Attendance {
  id: string;
  date: string;
  clockInAt: string;
  clockOutAt: string | null;
  user: { id: string; name: string };
}

function getDailyAverageHours(attendances: Attendance[]) {
  // Group by date
  const dailyData: Record<string, { totalHours: number; employeeCount: number; completedShifts: number }> = {};

  // Get last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  // Initialize all days
  last7Days.forEach(date => {
    dailyData[date] = { totalHours: 0, employeeCount: 0, completedShifts: 0 };
  });

  attendances.forEach(attendance => {
    const attendanceDate = attendance.date.split('T')[0];
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
      dayName: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      fullDate: new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      avgHours,
      totalEmployees: data.employeeCount,
      completedShifts: data.completedShifts, // ✅ return this so week stats works
    };
  });
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

const CustomLegend = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 mt-6 p-4 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-sm"></div>
        <span className="text-sm font-medium text-gray-700">Daily Average Hours</span>
      </div>
      <div className="flex items-center space-x-2">
        <div className="w-4 h-2 bg-red-400 rounded-sm"></div>
        <span className="text-sm font-medium text-gray-700">Target: 8h</span>
      </div>
      <div className="flex items-center space-x-4 text-xs text-gray-600">
        <span>✅ ≥8h (Great)</span>
        <span>⚠️ 6-8h (Moderate)</span>
        <span>🔴 &lt;6h (Below target)</span>
      </div>
    </div>
  );
};

export default function WeeklyAvgHoursChart({ orgId }: { orgId: string }) {
  const { data, loading, error } = useQuery<GetClockInEmployeesData, GetClockInEmployeesVars>(GET_CLOCKED_IN_EMPLOYEES, {
    variables: { orgId },
  });

  if (loading) {
    return (
      <Card className="hover:shadow-lg transition-shadow duration-200 gap-0 p-0">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg font-semibold">Loading weekly attendance...</span>
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
      <Card className="hover:shadow-lg transition-shadow duration-200 border-red-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-red-600">Error Loading Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500 bg-red-50 p-4 rounded-lg">
            Error: {error.message}
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = getDailyAverageHours(data?.getClockInEmployees || []);
  const weekStats = getWeekStats(chartData);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 overflow-hidden gap-0 p-0">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">Weekly Average Hours</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Daily productivity trends over the last 7 days</p>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{weekStats.weeklyAvg}h</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Weekly Avg</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{weekStats.bestDay}h</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Best Day</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{weekStats.totalShifts}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Total Shifts</div>
            </div>
          </div>
        </div>


        <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-blue-100">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">Last 7 days</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">Target: 8 hours/day</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-gray-600" />
            <Badge variant="secondary" className="text-xs">
              Avg {weekStats.avgEmployees} employees/day
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Badge 
              variant="secondary" 
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
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#06b6d4" />
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
                stroke="url(#lineGradient)"
                strokeWidth={3}
                fill="url(#areaGradient)"
                dot={{ 
                  fill: '#3b82f6', 
                  strokeWidth: 2, 
                  stroke: '#ffffff',
                  r: 5 
                }}
                activeDot={{ 
                  r: 7, 
                  stroke: '#3b82f6', 
                  strokeWidth: 2,
                  fill: '#ffffff'
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Custom Legend */}
        <CustomLegend />
      </CardContent>
    </Card>
  );
}
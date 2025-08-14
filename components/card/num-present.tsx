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
import { GetClockInEmployeesData, GetClockInEmployeesVars } from './present-employees';

interface Attendance {
  id: string;
  date: string;
  clockInAt: string;
  clockOutAt: string | null;
  status: string;
  user: { id: string; name: string };
}

/**
 * Build last-7-days daily counts.
 * We only SHOW "present" bars in the chart,
 * but we still compute late/absent for the summary stats.
 */
function getDailyAttendanceCount(attendances: Attendance[]) {
  const dailyData: Record<
    string,
    { present: Set<string>; absent: Set<string>; late: Set<string> }
  > = {};

  // Last 7 days in YYYY-MM-DD
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().split('T')[0];
  });

  // Init
  last7Days.forEach((date) => {
    dailyData[date] = {
      present: new Set(),
      absent: new Set(),
      late: new Set(),
    };
  });

  // Fill sets
  attendances.forEach((attendance) => {
    const attendanceDate = attendance.date.split('T')[0];
    if (!dailyData[attendanceDate]) return;

    const userId = attendance.user.id;

    switch (attendance.status) {
      case 'PRESENT': {
        // Count as present
        dailyData[attendanceDate].present.add(userId);
        break;
      }
      case 'CHECKED_OUT': {
        // Consider checked-out as present for that day
        dailyData[attendanceDate].present.add(userId);
        // Keep "late" for stats if you were using it previously
        dailyData[attendanceDate].late.add(userId);
        break;
      }
      case 'ABSENT': {
        dailyData[attendanceDate].absent.add(userId);
        break;
      }
      default:
        break;
    }
  });

  // Map to chart rows
  return last7Days.map((date) => {
    const data = dailyData[date];
    const presentCount = data.present.size;
    const absentCount = data.absent.size;
    const lateCount = data.late.size;

    return {
      date,
      dayName: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      fullDate: new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
      // Chart will only use this:
      present: presentCount,
      // Still return these for the weekly stats section:
      late: lateCount,
      absent: absentCount,
      total: presentCount + absentCount,
    };
  });
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

const PresentLegend = () => (
  <div className="flex items-center justify-center space-x-6 mb-6 p-4 bg-gray-50 rounded-lg">
    <div className="flex items-center space-x-2">
      <div className="w-3 h-3 rounded-full bg-green-500" />
      <span className="text-sm text-gray-600 font-medium">Present</span>
    </div>
  </div>
);

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
      <Card className="hover:shadow-lg transition-shadow duration-200 gap-0 p-0">
        <CardHeader className="pt-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-lg font-semibold">Loading attendance data...</span>
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
      <Card className="hover:shadow-lg transition-shadow duration-200 border-red-200 gap-0 p-0">
        <CardHeader className="pt-4">
          <CardTitle className="text-xl font-semibold text-red-600">
            Error Loading Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-red-500 bg-red-50 p-4 rounded-lg">Error: {error.message}</div>
        </CardContent>
      </Card>
    );
  }

  const chartData = getDailyAttendanceCount(data?.getClockInEmployees || []);
  const weekStats = getWeekStats(chartData);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 overflow-hidden gap-0 p-0">
      {/* Header */}
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b pt-4">
        <div className="flex flex-row items-center justify-between py-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-900">
                Daily Attendance
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Employee presence over the last 7 days
              </p>
            </div>
          </div>

          {/* Removed the Select/monthly range per your request */}
        </div>

        {/* Weekly Stats Summary */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{weekStats.totalPresent}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Total Present
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {weekStats.attendanceRate}%
              </div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">
                Attendance Rate
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{weekStats.avgDaily}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Avg Daily</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{weekStats.bestDay}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide">Best Day</div>
            </div>
          </div>
        </div>

        {/* Performance Indicators */}
        <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-blue-100">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-600">Last 7 days tracking</span>
          </div>
          <div className="flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-green-600" />
            <span className="text-sm text-gray-600">{weekStats.totalLate} late arrivals</span>
          </div>
          <div className="flex items-center space-x-2">
            <UserX className="w-4 h-4 text-red-600" />
            <span className="text-sm text-gray-600">{weekStats.totalAbsent} absences</span>
          </div>
          <Badge
            variant="secondary"
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
        {/* Legend updated to a single "Present" key */}
        <PresentLegend />

        <div className="h-[280px]">
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

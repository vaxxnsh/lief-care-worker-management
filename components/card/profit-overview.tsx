'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { month: 'Jan', primary: 10, secondary: 15 },
  { month: 'Feb', primary: 20, secondary: 25 },
  { month: 'Mar', primary: 35, secondary: 30 },
  { month: 'Apr', primary: 45, secondary: 35 },
  { month: 'May', primary: 35, secondary: 45 },
  { month: 'Jun', primary: 55, secondary: 65 },
  { month: 'Jul', primary: 65, secondary: 75 },
  { month: 'Aug', primary: 50, secondary: 70 },
  { month: 'Sep', primary: 70, secondary: 85 },
  { month: 'Oct', primary: 75, secondary: 90 },
  { month: 'Nov', primary: 60, secondary: 75 },
  { month: 'Dec', primary: 75, secondary: 80 },
];

export function PaymentsOverview() {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 gap-0 pt-4">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-xl font-semibold">Payments Overview</CardTitle>
        <Select defaultValue="monthly">
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="daily">Daily</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="primary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="secondary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <Area
                type="monotone"
                dataKey="secondary"
                stackId="1"
                stroke="#06b6d4"
                strokeWidth={2}
                fill="url(#secondary)"
              />
              <Area
                type="monotone"
                dataKey="primary"
                stackId="1"
                stroke="#8b5cf6"
                strokeWidth={2}
                fill="url(#primary)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
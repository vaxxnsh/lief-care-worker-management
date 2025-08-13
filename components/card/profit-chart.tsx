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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { day: 'Mon', Sales: 45, Revenue: 10 },
  { day: 'Tue', Sales: 65, Revenue: 15 },
  { day: 'Wed', Sales: 40, Revenue: 18 },
  { day: 'Thu', Sales: 55, Revenue: 20 },
  { day: 'Fri', Sales: 25, Revenue: 8 },
  { day: 'Sat', Sales: 45, Revenue: 25 },
  { day: 'Sun', Sales: 65, Revenue: 15 },
];

const CustomLegend = () => (
  <div className="flex items-center justify-start space-x-6 mb-6">
    <div className="flex items-center space-x-2">
      <div className="w-3 h-3 rounded-full bg-[#8b5cf6]"></div>
      <span className="text-sm text-gray-600">Sales</span>
    </div>
    <div className="flex items-center space-x-2">
      <div className="w-3 h-3 rounded-full bg-[#06b6d4]"></div>
      <span className="text-sm text-gray-600">Revenue</span>
    </div>
  </div>
);

export function ProfitChart() {
  return (
<Card className="hover:shadow-lg transition-shadow duration-200">
  <CardHeader className="flex flex-row items-center justify-between py-0 px-4">
    <CardTitle className="text-lg font-semibold">Profit this week</CardTitle>
    <Select defaultValue="thisweek">
      <SelectTrigger className="w-[120px] h-8 text-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="thisweek">This Week</SelectItem>
        <SelectItem value="lastweek">Last Week</SelectItem>
        <SelectItem value="thismonth">This Month</SelectItem>
      </SelectContent>
    </Select>
  </CardHeader>
  <CardContent className="px-4 pt-2 pb-3">
    <CustomLegend />
    <div className="h-[240px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="20%">
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#6b7280' }}
          />
          <Bar
            dataKey="Sales"
            stackId="a"
            fill="#8b5cf6"
            radius={[0, 0, 4, 4]}
          />
          <Bar
            dataKey="Revenue"
            stackId="a"
            fill="#06b6d4"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </CardContent>
</Card>

  );
}
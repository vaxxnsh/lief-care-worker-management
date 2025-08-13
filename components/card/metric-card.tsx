import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ReactNode;
  iconBgColor: string;
}

export function MetricCard({
  title,
  value,
  change,
  isPositive,
  icon,
  iconBgColor,
}: MetricCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 p-2">
      <CardContent className="px-6 py-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div
              className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center mb-4',
                iconBgColor
              )}
            >
              {icon}
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
              <p className="text-sm text-gray-500">{title}</p>
            </div>
          </div>
          <div
            className={cn(
              'flex items-center space-x-1 text-sm font-medium',
              isPositive ? 'text-green-600' : 'text-red-600'
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span>{change}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
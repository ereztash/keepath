import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { cn, formatCurrency, formatNumber, formatPercentage } from '../lib/utils';

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  trend?: number;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  format?: 'number' | 'currency' | 'percentage' | 'none';
}

const colorClasses = {
  primary: 'text-purple-600 bg-purple-100',
  success: 'text-green-600 bg-green-100',
  warning: 'text-orange-600 bg-orange-100',
  danger: 'text-red-600 bg-red-100',
};

export function StatCard({ icon: Icon, label, value, trend, color = 'primary', format = 'number' }: StatCardProps) {
  const formattedValue = React.useMemo(() => {
    if (typeof value === 'string') return value;

    switch (format) {
      case 'currency':
        return formatCurrency(value);
      case 'percentage':
        return formatPercentage(value);
      case 'number':
        return formatNumber(value);
      default:
        return value;
    }
  }, [value, format]);

  const trendPositive = trend !== undefined && trend > 0;
  const trendNegative = trend !== undefined && trend < 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <div className={cn('p-2 rounded-full', colorClasses[color])}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        {trend !== undefined && (
          <div className="flex items-center mt-1">
            {trendPositive && <TrendingUp className="h-4 w-4 text-green-600 mr-1" />}
            {trendNegative && <TrendingDown className="h-4 w-4 text-red-600 mr-1" />}
            <span className={cn('text-xs', trendPositive && 'text-green-600', trendNegative && 'text-red-600')}>
              {formatPercentage(Math.abs(trend))}
            </span>
            <span className="text-xs text-muted-foreground ml-1">from last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

'use client';

import { ChartContainer, ChartTooltip, type ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Cell } from 'recharts';

type TopMunicipalityMonthlyBarProps = {
    chartData: {
        month: string; // e.g. "Jan – Cebu City"
        municipality: string; // e.g. "Cebu City"
        total: number;
    }[];
};

const chartConfig: ChartConfig = {
    total: {
        label: 'Total Incidents',
        color: 'var(--chart-2)',
    },
};

// Gradient colors for bars
const barColors = [
    'var(--chart-1)',
    'var(--chart-2)', 
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
];

export default function TopMunicipalityMonthlyBar({ chartData }: TopMunicipalityMonthlyBarProps) {
    const hasData = chartData && chartData.length > 0

    if (!hasData) {
        return (
            <div className="flex h-80 w-full items-center justify-center bg-muted/10">
                <div className="text-center">
                    <p className="text-muted-foreground text-sm">No municipality data available for the selected period.</p>
                    <p className="text-muted-foreground mt-1 text-xs">Try selecting a different year.</p>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full">
            <ChartContainer config={chartConfig} className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                        <defs>
                            {barColors.map((color, idx) => (
                                <linearGradient key={idx} id={`barGradient${idx}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor={color} stopOpacity={0.9}/>
                                    <stop offset="100%" stopColor={color} stopOpacity={0.6}/>
                                </linearGradient>
                            ))}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.3} />

                        {/* X-Axis: Short label with municipality */}
                        <XAxis 
                            dataKey="month" 
                            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                            tickLine={false} 
                            axisLine={false} 
                            tickMargin={8} 
                        />

                        <YAxis 
                            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} 
                            tickLine={false} 
                            axisLine={false} 
                            tickMargin={8} 
                        />

                        {/* Enhanced Tooltip */}
                        <ChartTooltip
                            cursor={{ fill: 'hsl(var(--muted) / 0.1)' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length > 0) {
                                    const data = payload[0].payload;

                                    return (
                                        <div className="bg-background rounded-lg border shadow-lg p-3">
                                            <div className="mb-2 text-sm font-semibold">{data.month}</div>
                                            <div className="text-muted-foreground space-y-1 text-xs">
                                                <div className="flex justify-between gap-6">
                                                    <span>Municipality:</span>
                                                    <span className="text-foreground font-semibold">{data.municipality}</span>
                                                </div>
                                                <div className="flex justify-between gap-6">
                                                    <span>Reports:</span>
                                                    <span className="text-foreground font-semibold">{data.total}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />

                        <Bar dataKey="total" radius={[8, 8, 0, 0]} maxBarSize={60}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={`url(#barGradient${index % barColors.length})`} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    );
}

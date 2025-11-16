'use client';

import { ChartContainer, ChartTooltip, type ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';

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
                    <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} barSize={24}>
                        <CartesianGrid strokeDasharray="4 4" />

                        {/* X-Axis: Short label with municipality */}
                        <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickMargin={10} />

                        <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickMargin={10} />

                        {/* Enhanced Tooltip */}
                        <ChartTooltip
                            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length > 0) {
                                    const data = payload[0].payload;

                                    return (
                                        <div className="bg-background rounded-lg border p-3 shadow-sm">
                                            <div className="mb-1 text-sm font-medium">{data.month}</div>
                                            <div className="text-muted-foreground space-y-1 text-xs">
                                                <div className="flex justify-between gap-4">
                                                    <span>Municipality:</span>
                                                    <span className="text-foreground font-medium">{data.municipality}</span>
                                                </div>
                                                <div className="flex justify-between gap-4">
                                                    <span>Reports:</span>
                                                    <span className="text-foreground font-medium">{data.total}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />

                        <Bar dataKey="total" fill={chartConfig.total.color} radius={[6, 6, 0, 0]} maxBarSize={48} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    );
}

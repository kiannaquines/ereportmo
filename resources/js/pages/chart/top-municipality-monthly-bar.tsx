'use client';

import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';

type TopMunicipalityMonthlyBarProps = {
    chartData: {
        month: string;
        municipality: string;
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
    return (
        <div className="w-full">
            <ChartContainer config={chartConfig} className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }} barSize={24}>
                        <CartesianGrid strokeDasharray="4 4" />
                        <XAxis dataKey="month" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickMargin={10} />
                        <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickMargin={10} />
                        <ChartTooltip
                            cursor={{ fill: 'transparent' }}
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    const value = payload[0].value;
                                    return (
                                        <ChartTooltipContent indicator="dashed" label={label}>
                                            <div className="text-xs">{`${value} reports`}</div>
                                        </ChartTooltipContent>
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

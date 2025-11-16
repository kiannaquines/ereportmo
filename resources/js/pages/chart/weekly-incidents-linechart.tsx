"use client"

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts"

type WeeklyIncidentsLineChartProps = {
    chartData: { week?: string; month?: string; total: number }[]
}

const chartConfig: ChartConfig = {
    total: {
        label: "Total Incidents",
        color: "var(--chart-2)", // consistent with bar chart palette
    },
}

export default function WeeklyIncidentsLineChart({
    chartData,
}: WeeklyIncidentsLineChartProps) {
    const hasData = chartData && chartData.length > 0

    if (!hasData) {
        return (
            <div className="flex h-80 w-full items-center justify-center bg-muted/10">
                <div className="text-center">
                    <p className="text-muted-foreground text-sm">No data available for the selected period.</p>
                    <p className="text-muted-foreground mt-1 text-xs">Try selecting a different year or period.</p>
                </div>
            </div>
        )
    }

    return (
        <ChartContainer
            config={chartConfig}
            className="h-80 w-full" // fits nicely inside your card
        >
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={chartConfig.total.color} stopOpacity={0.8}/>
                            <stop offset="95%" stopColor={chartConfig.total.color} stopOpacity={0.1}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" />
                    <XAxis
                        dataKey={chartData[0]?.week ? "week" : "month"}
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                    />
                    <YAxis axisLine={false} tickLine={false} tickMargin={10} />
                    <ChartTooltip
                        cursor={{ strokeDasharray: "4 4" }}
                        content={<ChartTooltipContent indicator="dot" />}
                    />
                    <Area
                        type="monotone"
                        dataKey="total"
                        stroke={chartConfig.total.color}
                        strokeWidth={2.5}
                        fill="url(#colorTotal)"
                        fillOpacity={1}
                        dot={{
                            r: 4,
                            fill: "#ffffff", // white center (hollow look)
                            stroke: chartConfig.total.color,
                            strokeWidth: 2,
                        }}
                        activeDot={{
                            r: 6,
                            fill: chartConfig.total.color, // fill on hover
                            stroke: "hsl(var(--background))",
                            strokeWidth: 2,
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </ChartContainer>
    )
}

"use client"

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import {
    LineChart,
    Line,
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
    return (
        <ChartContainer
            config={chartConfig}
            className="h-80 w-full" // fits nicely inside your card
        >
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
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
                        content={<ChartTooltipContent indicator="line" />}
                    />
                    <Line
                        type="monotone"
                        dataKey="total"
                        stroke={chartConfig.total.color}
                        strokeWidth={2.5}
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
                </LineChart>
            </ResponsiveContainer>
        </ChartContainer>
    )
}

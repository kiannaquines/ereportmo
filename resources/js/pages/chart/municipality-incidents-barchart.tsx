"use client"

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import {
    PieChart,
    Pie,
    Cell,
    Legend,
    ResponsiveContainer,
} from "recharts"

type ChartInput = Record<string, { municipality: string; total: number }[]>

type IncidentsPerMunicipalityPieChartProps = {
    chartData: ChartInput
}

// Flatten data into [{ municipality, total }]
const transformIntoPieData = (chartData: ChartInput) => {
    const mergedMap: Record<string, number> = {}

    for (const [, entries] of Object.entries(chartData)) {
        for (const { municipality, total } of entries) {
            mergedMap[municipality] = (mergedMap[municipality] || 0) + total
        }
    }

    return Object.entries(mergedMap).map(([municipality, total]) => ({
        name: municipality,
        value: total,
    }))
}

const generateChartConfig = (): ChartConfig => {
    const colors = [
        "var(--chart-1)",
        "var(--chart-2)",
        "var(--chart-3)",
        "var(--chart-4)",
        "var(--chart-5)",
        "var(--chart-6)",
    ]

    return colors.reduce((acc, color, idx) => {
        acc[`slice-${idx}`] = { label: `Slice ${idx + 1}`, color }
        return acc
    }, {} as ChartConfig)
}

const IncidentsPerMunicipalityPieChart = ({
    chartData,
}: IncidentsPerMunicipalityPieChartProps) => {
    const pieData = transformIntoPieData(chartData)
    const chartConfig = generateChartConfig()

    return (
        <div className="w-full border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-6 bg-background h-96 flex flex-col">
            <div className="mb-4">
                <h2 className="text-lg font-semibold">Incidents per Municipality</h2>
                <p className="text-sm text-muted-foreground">
                    Distribution of reported incidents across municipalities (combined by year).
                </p>
            </div>

            <ChartContainer config={chartConfig} className="h-[calc(100%-56px)]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <ChartTooltip
                            cursor={{ fill: "transparent" }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0]
                                    return (
                                        <ChartTooltipContent indicator="dot" label={data.name}>
                                            <div className="text-xs">{`${data.value} reports`}</div>
                                        </ChartTooltipContent>
                                    )
                                }
                                return null
                            }}
                        />

                        <Legend
                            verticalAlign="bottom"
                            iconType="circle"
                            height={36}
                            wrapperStyle={{ fontSize: "12px" }}
                        />

                        <Pie
                            data={pieData}
                            dataKey="value"
                            nameKey="name"
                            outerRadius="80%"
                            labelLine={false}
                            label={({ name, value }) => `${name} (${value})`}
                            isAnimationActive
                        >
                            {pieData.map((_, i) => (
                                <Cell
                                    key={`cell-${i}`}
                                    fill={`var(--chart-${(i % 6) + 1})`}
                                    stroke="transparent"
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    )
}

export default IncidentsPerMunicipalityPieChart

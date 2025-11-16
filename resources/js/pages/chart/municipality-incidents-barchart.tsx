"use client"

import {
    ChartContainer,
    ChartTooltip,
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

    return Object.entries(mergedMap)
        .map(([municipality, total]) => ({
            name: municipality,
            value: total,
        }))
        .sort((a, b) => b.value - a.value) // Sort by value descending
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

// Gradient colors for pie slices
const pieColors = [
    'var(--chart-1)',
    'var(--chart-2)',
    'var(--chart-3)',
    'var(--chart-4)',
    'var(--chart-5)',
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
}: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // Only show label if percentage is >= 5%
    if (percent < 0.05) return null;

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? 'start' : 'end'}
            dominantBaseline="central"
            className="font-semibold text-xs drop-shadow-lg"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

const IncidentsPerMunicipalityPieChart = ({
    chartData,
}: IncidentsPerMunicipalityPieChartProps) => {
    const pieData = transformIntoPieData(chartData)
    const chartConfig = generateChartConfig()
    const hasData = Object.keys(chartData).length > 0 && pieData.length > 0

    return (
        <div className="w-full relative overflow-hidden bg-background h-80 flex flex-col">
            {!hasData ? (
                <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                        <p className="text-muted-foreground text-sm">No municipality data available.</p>
                        <p className="text-muted-foreground mt-1 text-xs">Try selecting a different year or period.</p>
                    </div>
                </div>
            ) : (
            <ChartContainer config={chartConfig} className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <defs>
                            {pieColors.map((color, idx) => (
                                <radialGradient key={idx} id={`pieGradient${idx}`}>
                                    <stop offset="0%" stopColor={color} stopOpacity={1}/>
                                    <stop offset="100%" stopColor={color} stopOpacity={0.7}/>
                                </radialGradient>
                            ))}
                        </defs>
                        <ChartTooltip
                            cursor={{ fill: "transparent" }}
                            content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                    const data = payload[0].payload
                                    const percentage = ((data.value / pieData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)
                                    return (
                                        <div className="rounded-lg border bg-background p-3 shadow-lg">
                                            <div className="font-semibold text-sm mb-2">{data.name}</div>
                                            <div className="space-y-1 text-xs text-muted-foreground">
                                                <div className="flex justify-between gap-6">
                                                    <span>Reports:</span>
                                                    <span className="font-semibold text-foreground">{data.value}</span>
                                                </div>
                                                <div className="flex justify-between gap-6">
                                                    <span>Percentage:</span>
                                                    <span className="font-semibold text-foreground">{percentage}%</span>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }
                                return null
                            }}
                        />

                        <Legend
                            verticalAlign="bottom"
                            iconType="circle"
                            height={40}
                            wrapperStyle={{ 
                                fontSize: "11px",
                                paddingTop: "10px",
                            }}
                            formatter={(value, entry: any) => {
                                const percentage = ((entry.payload.value / pieData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(0)
                                return `${value} (${percentage}%)`
                            }}
                        />

                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="45%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={90}
                            innerRadius={50}
                            dataKey="value"
                            paddingAngle={2}
                            isAnimationActive
                        >
                            {pieData.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={`url(#pieGradient${index % pieColors.length})`}
                                    stroke="hsl(var(--background))"
                                    strokeWidth={2}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </ChartContainer>
            )}
        </div>
    )
}

export default IncidentsPerMunicipalityPieChart

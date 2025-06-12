import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import {
    BarChart,
    Bar,
    ResponsiveContainer,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
} from "recharts"

type ChartInput = Record<string, { municipality: string; total: number }[]>

type MonthlyIncidentsBarChartProps = {
    chartData: ChartInput
}

const transformIntoChartData = (chartData: ChartInput) => {
    const mergedMap: Record<string, any> = {}

    for (const [year, entries] of Object.entries(chartData)) {
        for (const { municipality, total } of entries) {
            if (!mergedMap[municipality]) {
                mergedMap[municipality] = { municipality }
            }
            mergedMap[municipality][year] = total
        }
    }

    return Object.values(mergedMap)
}

const generateChartConfig = (chartData: ChartInput): ChartConfig => {
    const colors = [
        "var(--chart-1)",
        "var(--chart-2)",
        "var(--chart-3)",
        "var(--chart-4)",
        "var(--chart-5)",
        "var(--chart-6)",
    ]

    return Object.keys(chartData).reduce((acc, year, idx) => {
        acc[year] = { label: year, color: colors[idx % colors.length] }
        return acc
    }, {} as ChartConfig)
}

const MonthlyIncidentsBarChart = ({ chartData }: MonthlyIncidentsBarChartProps) => {
    const transformedData = transformIntoChartData(chartData)
    const chartConfig = generateChartConfig(chartData)

    return (
        <div className="w-full border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-6 bg-background h-96 flex flex-col">
            <div className="mb-4">
                <h2 className="text-lg font-semibold">Incidents per Municipality</h2>
                <p className="text-sm text-muted-foreground">
                    Breakdown of incidents by municipality (by year)
                </p>
            </div>
            <ChartContainer config={chartConfig} className="h-[calc(100%-56px)]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={transformedData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="4 4" />
                        <XAxis dataKey="municipality" tickLine={false} tickMargin={10} axisLine={false} />
                        <YAxis axisLine={false} tickLine={false} tickMargin={10} />
                        <ChartTooltip cursor={{ fill: "transparent" }} content={<ChartTooltipContent indicator="dashed" />} />
                        <Legend verticalAlign="top" height={36} iconType="square" />
                        {Object.keys(chartConfig).map((year) => (
                            <Bar
                                key={year}
                                dataKey={year}
                                fill={chartConfig[year].color}
                                radius={[4, 4, 0, 0]}
                            />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    )
}

export default MonthlyIncidentsBarChart  
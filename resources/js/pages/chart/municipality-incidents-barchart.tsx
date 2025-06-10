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

const chartData = [
    {
        municipality: "Makialala",
        "2023": 186,
        "2024": 198,
    },
    {
        municipality: "Matalam",
        "2023": 305,
        "2024": 312,
    },
    {
        municipality: "Mlang",
        "2023": 237,
        "2024": 245,
    },
    {
        municipality: "Kidapawan",
        "2023": 73,
        "2024": 85,
    },
    {
        municipality: "Midsayap",
        "2023": 209,
        "2024": 220,
    },
    {
        municipality: "Pigcawayan",
        "2023": 214,
        "2024": 235,
    },
    {
        municipality: "Pikit",
        "2023": 300,
        "2024": 340,
    },
]

const BarchartConfig = {
    "2023": { label: "2023", color: "var(--chart-1)" },
    "2024": { label: "2024", color: "var(--chart-2)" },
} satisfies ChartConfig

const MonthlyIncidentsBarChart = () => {
    return (
        <div className="w-full border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-6 bg-background h-96 flex flex-col">
            <div className="mb-4">
                <h2 className="text-lg font-semibold">Incidents per Municipality</h2>
                <p className="text-sm text-muted-foreground">Breakdown of incidents by municipality (2023–2025)</p>
            </div>
            <ChartContainer config={BarchartConfig} className="h-[calc(100%-56px)]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="4 4" />
                        <XAxis
                            dataKey="municipality"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <YAxis axisLine={false} tickLine={false} tickMargin={10} />
                        <ChartTooltip
                            cursor={{ fill: "transparent" }}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Legend verticalAlign="top" height={36} iconType="square" />
                        {Object.keys(BarchartConfig).map((year) => (
                            <Bar
                                key={year}
                                dataKey={year}
                                name={BarchartConfig[year as keyof typeof BarchartConfig].label}
                                fill={BarchartConfig[year as keyof typeof BarchartConfig].color}
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
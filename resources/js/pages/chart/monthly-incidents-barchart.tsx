import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"

const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
    { month: "July", desktop: 300, mobile: 200 },
    { month: "August", desktop: 400, mobile: 250 },
    { month: "September", desktop: 350, mobile: 220 },
    { month: "October", desktop: 450, mobile: 300 },
    { month: "November", desktop: 500, mobile: 350 },
    { month: "December", desktop: 600, mobile: 400 },
]

const BarchartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-1)",
    },
    mobile: {
        label: "Mobile",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig

const MonthlyIncidentsBarChart = () => {
    return (
        <div className="w-full border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-6 bg-background h-96 flex flex-col">
            <div className="mb-4">
                <h2 className="text-lg font-semibold">Incident Types Distribution</h2>
                <p className="text-sm text-muted-foreground">Breakdown of incidents by category (Jan-Jun 2024)</p>
            </div>
            <ChartContainer config={BarchartConfig} className="h-[calc(100%-56px)]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart accessibilityLayer data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="4 4" />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis axisLine={false} tickLine={false} tickMargin={10} />
                        <ChartTooltip
                            cursor={true}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                        <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
                    </BarChart>
                </ResponsiveContainer>
            </ChartContainer>
        </div>
    )
}

export default MonthlyIncidentsBarChart
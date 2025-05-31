import { LineChart, Line, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

const incidentLineChartData = [
    { month: "January", revenue: 4000 },
    { month: "February", revenue: 3000 },
    { month: "March", revenue: 5000 },
    { month: "April", revenue: 4780 },
    { month: "May", revenue: 5890 },
    { month: "June", revenue: 6390 },
    { month: "July", revenue: 7200 },
    { month: "August", revenue: 8100 },
    { month: "September", revenue: 9100 },
    { month: "October", revenue: 10200 },
    { month: "November", revenue: 11300 },
    { month: "December", revenue: 12400 },
]


const incidentLineChartDataConfig = {
    revenue: {
        label: "Revenue",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig


const MonthlyIncidentsLineChart = () => {
  return (
    <div className="w-full border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-6 bg-background h-96 flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Monthly Incidents Reported</h2>
        <p className="text-sm text-muted-foreground">
          Incident trends over the first half of 2024
        </p>
      </div>
      <ChartContainer config={incidentLineChartDataConfig} className="h-[calc(100%-56px)]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={incidentLineChartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="var(--grid-line)" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              tickFormatter={(v) => v.slice(0, 3)}
            />
            <YAxis axisLine={false} tickLine={false} tickMargin={10} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-revenue)"
              strokeWidth={3}
              dot={{ r: 4, stroke: "var(--color-revenue)", strokeWidth: 2, fill: "#fff" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}

export default MonthlyIncidentsLineChart
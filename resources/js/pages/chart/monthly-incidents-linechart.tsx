import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const incidentLineChartData = [
  { month: "January", "2023": 3000, "2024": 4000, "2025": 5000 },
  { month: "February", "2023": 2500, "2024": 3000, "2025": 4500 },
  { month: "March", "2023": 2700, "2024": 5000, "2025": 6200 },
  { month: "April", "2023": 3100, "2024": 4780, "2025": 7000 },
  { month: "May", "2023": 3200, "2024": 5890, "2025": 7500 },
  { month: "June", "2023": 3600, "2024": 6390, "2025": 7800 },
  { month: "July", "2023": 4000, "2024": 7200, "2025": 8000 },
  { month: "August", "2023": 4500, "2024": 8100, "2025": 8800 },
  { month: "September", "2023": 5000, "2024": 9100, "2025": 9200 },
  { month: "October", "2023": 5500, "2024": 10200, "2025": 9900 },
  { month: "November", "2023": 6000, "2024": 11300, "2025": 10500 },
  { month: "December", "2023": 7000, "2024": 12400, "2025": 11200 },
]

const incidentLineChartDataConfig = {
  "2023": { label: "2023", color: "var(--chart-1)" },
  "2024": { label: "2024", color: "var(--chart-2)" },
  "2025": { label: "2025", color: "var(--chart-3)" },
} satisfies ChartConfig

const MonthlyIncidentsLineChart = () => {
  return (
    <div className="w-full border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-6 bg-background h-96 flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Monthly Incidents Reported</h2>
        <p className="text-sm text-muted-foreground">
          Incident trends over 2023–2025
        </p>
      </div>
      <ChartContainer config={incidentLineChartDataConfig} className="h-[calc(100%-56px)]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={incidentLineChartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tickMargin={10}
              tickFormatter={(v) => v.slice(0, 3)}
            />
            <YAxis axisLine={false} tickLine={false} tickMargin={10} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
            <Legend
              verticalAlign="top"
              
              className="text-sm"
              height={25}
              margin={{ top: 10, left: 0, right: 0, bottom: 10 }}
              iconType="square"
              formatter={(value) =>
                incidentLineChartDataConfig[value as keyof typeof incidentLineChartDataConfig]?.label || value
              }
              
            />
            {Object.keys(incidentLineChartDataConfig).map((year) => (
              <Line
                key={year}
                type="monotone"
                dataKey={year}
                stroke={incidentLineChartDataConfig[year as keyof typeof incidentLineChartDataConfig].color}
                strokeWidth={3}
                dot={{
                  r: 4,
                  stroke: incidentLineChartDataConfig[year as keyof typeof incidentLineChartDataConfig].color,
                  strokeWidth: 2,
                  fill: "#fff",
                }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}

export default MonthlyIncidentsLineChart
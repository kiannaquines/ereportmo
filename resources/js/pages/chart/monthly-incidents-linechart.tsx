import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

type ChartInput = Record<string, { month: string; total: number }[]>

type MonthlyIncidentsLineChartProps = {
  chartData: ChartInput
}

const transformIntoChartData = (chartData: ChartInput) => {
  const monthOrder = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const monthMap: Record<string, any> = {}

  for (const [year, reports] of Object.entries(chartData)) {
    for (const { month, total } of reports) {
      if (!monthMap[month]) {
        monthMap[month] = { month }
      }
      monthMap[month][year] = total
    }
  }

  return monthOrder
    .filter(month => monthMap[month])
    .map(month => monthMap[month])
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

const MonthlyIncidentsLineChart = ({ chartData }: MonthlyIncidentsLineChartProps) => {
  const incidentLineChartData = transformIntoChartData(chartData)
  const incidentLineChartDataConfig = generateChartConfig(chartData)
  const hasData = Object.keys(chartData).length > 0 && incidentLineChartData.length > 0

  return (
    <div className="w-full border-sidebar-border/70 dark:border-sidebar-border relative overflow-hidden rounded-xl border p-6 bg-background h-96 flex flex-col">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Monthly Incidents Reported</h2>
        <p className="text-sm text-muted-foreground">
          {hasData ? `Incident trends over ${Object.keys(chartData).join("–")}` : "No data available"}
        </p>
      </div>
      {!hasData ? (
        <div className="flex h-[calc(100%-56px)] items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground text-sm">No incident data available for the selected period.</p>
            <p className="text-muted-foreground mt-1 text-xs">Try selecting a different year or period.</p>
          </div>
        </div>
      ) : (
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
                stroke={incidentLineChartDataConfig[year].color}
                strokeWidth={3}
                dot={{
                  r: 4,
                  stroke: incidentLineChartDataConfig[year].color,
                  strokeWidth: 2,
                  fill: "#fff",
                }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
      )}
    </div>
  )
}

export default MonthlyIncidentsLineChart
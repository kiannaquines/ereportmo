import { Pie, PieChart, ResponsiveContainer, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import AppLayout from "@/layouts/app-layout";
import { BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import { Bar, BarChart, XAxis } from "recharts"
import { Button } from "@/components/ui/button";

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Generate Incident Report",
    href: route("report.incident"),
  },
];

export const description = "A pie chart with a legend"
const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]
const chartConfig = {
  visitors: {
    label: "Domestic violence",
  },
  chrome: {
    label: "Battery",
    color: "var(--chart-1)",
  },
  safari: {
    label: "Assault",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Abuse",
    color: "var(--chart-3)",
  },
  edge: {
    label: "Manipulation",
    color: "var(--chart-4)",
  },
  other: {
    label: "Robbery",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig




export const description1 = "A bar chart"
const chartData1 = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
  { month: "July", desktop: 214 },
  { month: "August", desktop: 214 },
  { month: "September", desktop: 214 },
  { month: "October", desktop: 214 },
  { month: "November", desktop: 214 },
  { month: "December", desktop: 214 },
]
const chartConfig1 = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig


export const description2 = "A horizontal bar chart"
const chartData2 = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 73 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
  { month: "July", desktop: 214 },
  { month: "August", desktop: 214 },
  { month: "September", desktop: 214 },
  { month: "October", desktop: 214 },
  { month: "November", desktop: 214 },
  { month: "December", desktop: 214 },
]
const chartConfig2 = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export default function ReportIncident() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Generate Incident Report" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Summarized Data</h2>
          <Button className="w-fit">Generate Report</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
            <div className="rounded-lg border p-4">
              <h2 className="text-xl font-semibold">Summary Table</h2>
              <p className="text-sm text-muted-foreground mb-4">
                The summary table is a table that shows the summary of the data.
              </p>
              <table className="min-w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-4 py-2 border">Category</th>
                    <th className="px-4 py-2 border">Label</th>
                    <th className="px-4 py-2 border text-right">Count</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Total */}
                  <tr>
                    <td className="px-4 py-2 border">Total Reports</td>
                    <td className="px-4 py-2 border">All Incidents</td>
                    <td className="px-4 py-2 border text-right font-medium">245</td>
                  </tr>

                  {/* Incident Types */}
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 border font-semibold" rowSpan={4}>Incident Types</td>
                    <td className="px-4 py-2 border">Theft</td>
                    <td className="px-4 py-2 border text-right">90</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border">Vandalism</td>
                    <td className="px-4 py-2 border text-right">55</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border">Accident</td>
                    <td className="px-4 py-2 border text-right">30</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border">Assault</td>
                    <td className="px-4 py-2 border text-right">24</td>
                  </tr>

                  {/* Status of Reports */}
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 border font-semibold" rowSpan={4}>Status</td>
                    <td className="px-4 py-2 border">Pending</td>
                    <td className="px-4 py-2 border text-right">75</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border">In Progress</td>
                    <td className="px-4 py-2 border text-right">100</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border">Resolved</td>
                    <td className="px-4 py-2 border text-right">60</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border">Closed</td>
                    <td className="px-4 py-2 border text-right">10</td>
                  </tr>

                  {/* Locations */}
                  <tr className="bg-gray-50">
                    <td className="px-4 py-2 border font-semibold" rowSpan={3}>Locations</td>
                    <td className="px-4 py-2 border">Downtown</td>
                    <td className="px-4 py-2 border text-right">85</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border">Westside</td>
                    <td className="px-4 py-2 border text-right">60</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 border">Riverside</td>
                    <td className="px-4 py-2 border text-right">50</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-col h-full">
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative flex flex-col flex-1 overflow-hidden rounded-xl border p-4">
              <h3 className="font-semibold text-lg">Locations of incidents</h3>
              <p className="text-sm text-muted-foreground mb-4">
                The locations of incidents are distributed as follows:
              </p>
              <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                  <ChartContainer config={chartConfig2} className="h-full w-full">
                    <BarChart
                      accessibilityLayer
                      data={chartData2}
                      layout="vertical"
                      margin={{ left: -20 }}
                    >
                      <XAxis type="number" dataKey="desktop" hide />
                      <YAxis
                        dataKey="month"
                        type="category"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Bar dataKey="desktop" fill="var(--color-desktop)" radius={5} />
                    </BarChart>
                  </ChartContainer>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative h-full overflow-hidden rounded-xl border p-4">
              <h3 className="font-semibold text-lg">Status of reports</h3>
              <p className="text-sm text-muted-foreground mb-4">
                The status of reports are distributed as follows:
              </p>
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <ChartContainer config={chartConfig1}>
                    <BarChart accessibilityLayer data={chartData1}>
                      <XAxis
                        dataKey="month"
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                        tickFormatter={(value) => value.slice(0, 3)}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
                    </BarChart>
                  </ChartContainer>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="border-sidebar-border/70 dark:border-sidebar-border relative h-full overflow-hidden rounded-xl border p-4">
              <h3 className="font-semibold text-lg">Incident Types</h3>
              <p className="text-sm text-muted-foreground mb-4">
                The incident types are distributed as follows:
              </p>
              <div className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[300px]"
                  >
                    <PieChart>
                      <Pie data={chartData} dataKey="visitors" />
                      <ChartLegend
                        content={<ChartLegendContent nameKey="browser" />}
                        className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                      />
                    </PieChart>
                  </ChartContainer>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

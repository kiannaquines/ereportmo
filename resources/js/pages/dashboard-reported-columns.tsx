import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { ReportedIncidentsProps } from "@/types";
import { Badge } from "@/components/ui/badge";


export function getReportedIncidentsColumnsForDashboard(
  incidents: ReportedIncidentsProps[]
): ColumnDef<ReportedIncidentsProps>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all rows"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.getValue("status")}
        </Badge>
      ),
    },
    {
      accessorKey: "source",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          aria-label="Sort by source"
        >
          Source
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("source")}</div>
      ),
    },
    {
      accessorKey: "office",
      header: "Authority",
      cell: ({ row }) => (
        <Badge variant="outline">{row.getValue("office")}</Badge>
      ),
    },
    {
      accessorKey: "incident",
      header: "Incident",
      cell: ({ row }) => (
        <div className="max-w-xs" title={row.getValue("incident")}>
          {row.getValue("incident")}
        </div>
      ),
    },
    {
      accessorKey: "latitude",
      header: "Latitude",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("latitude")}</div>
      ),
    },
    {
      accessorKey: "longitude",
      header: "Longitude",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("longitude")}</div>
      ),
    }
  ];
}

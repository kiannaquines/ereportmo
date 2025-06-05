import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ReportedIncidents, ReportProps } from "@/types";
import { Badge } from "@/components/ui/badge";
import { useState, useCallback } from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  EditIncidentReportDialog,
  EditIncidentReportDialogProps,
} from "@/pages/report/edit-report-form-dialog";

type DialogIsOpenProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  handleAction?: () => void;
  isDeleting?: boolean;
};

function DeleteReportedAlertDialog({
  isOpen,
  setIsOpen,
  handleAction,
  isDeleting,
}: DialogIsOpenProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this reported incident? This action
            cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={handleAction}
            aria-label="Confirm delete reported incident"
          >
            {isDeleting ? "Deleting..." : "Delete Reported Incident"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface ReportActionsCellProps {
  report: ReportedIncidents;
  reportedBy: ReportProps["reportedBy"];
  incidents: ReportProps["incidents"];
}

function ReportActionsCell({
  report,
  reportedBy,
  incidents,
}: ReportActionsCellProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] =
    useState<EditIncidentReportDialogProps["report"]>();

  const handleDelete = useCallback(() => {
    setIsDeleting(true);
    router.delete(route("reports.destroy", { report: report.id }), {
      preserveScroll: true,
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        toast.success("Incident deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete incident");
      },
      onFinish: () => setIsDeleting(false),
    });
  }, [report.id]);

  const openUpdateDialog = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setDropdownOpen(false);
      setIsUpdateDialogOpen(true);
      setSelectedRow({
        id: report.id,
        reported_by: report.source_id,
        incident_id: report.incident_id,
        description: report.description,
        latitude: report.latitude,
        longitude: report.longitude,
      });
    },
    [report]
  );

  const openDeleteDialog = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDropdownOpen(false);
    setIsDeleteDialogOpen(true);
  }, []);

  return (
    <div className="flex justify-end">
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            aria-label="Open actions menu"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Eye className="mr-2 h-4 w-4" />
            View
          </DropdownMenuItem>
          <DropdownMenuItem onClick={openUpdateDialog}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
            onClick={openDeleteDialog}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteReportedAlertDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        handleAction={handleDelete}
        isDeleting={isDeleting}
      />
      <EditIncidentReportDialog
        isOpen={isUpdateDialogOpen}
        setIsOpen={setIsUpdateDialogOpen}
        reportedBy={reportedBy}
        incidents={incidents}
        report={selectedRow}
      />
    </div>
  );
}

export function getReportedIncidentsColumns(
  reportedBy: ReportProps["reportedBy"],
  incidents: ReportProps["incidents"]
): ColumnDef<ReportedIncidents>[] {
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
        <div className="truncate max-w-xs" title={row.getValue("incident")}>
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
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <ReportActionsCell
          report={row.original}
          reportedBy={reportedBy}
          incidents={incidents}
        />
      ),
    },
  ];
}

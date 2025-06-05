import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import { IncidentsProps, OfficeProps } from "@/types";
import { Badge } from "@/components/ui/badge";
import { router } from "@inertiajs/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { EditIncidentFormDialog } from "@/pages/incident/edit-incident-form-dialog";

type DialogIsOpenProps = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  handleAction?: () => void
  isDeleting?: boolean
}

function DeleteIncidentAlertDialog({ isOpen, setIsOpen, handleAction, isDeleting }: DialogIsOpenProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this incident? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={handleAction}
          >
            {isDeleting ? "Deleting..." : "Delete Incident"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface IncidentActionsCellProps {
  offices: OfficeProps[]
  incident: IncidentsProps
}

function IncidentActionsCell({ offices, incident }: IncidentActionsCellProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<IncidentsProps | undefined>();
  const [dropdownOpen, setDropdownOpen] = useState(false);


  const handleDelete = useCallback(() => {
    setIsDeleting(true);
    router.delete(route('incidents.destroy', { incident: incident.id }), {
      preserveScroll: true,
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        toast.success("Incident deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete incident");
      },
      onFinish: () => setIsDeleting(false)
    });
  }, [incident?.id]);


  const openUpdateDialog = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setDropdownOpen(false);
      setIsUpdateDialogOpen(true);
      setSelectedRow({
        id: incident.id,
        office_id: incident.office_id,
        incident: incident.incident,
        office: incident.office,
      });
    },
    [incident]
  );


  const openDeleteDialog = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDropdownOpen(false)
    setIsDeleteDialogOpen(true)
  }, []);

  return (
    <div className="flex justify-end">
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
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

      <DeleteIncidentAlertDialog isOpen={isDeleteDialogOpen} setIsOpen={setIsDeleteDialogOpen} handleAction={handleDelete} isDeleting={isDeleting} />

      {selectedRow && (
        <EditIncidentFormDialog
          isOpen={isUpdateDialogOpen}
          setIsOpen={setIsUpdateDialogOpen}
          offices={offices}
          incident={selectedRow}
        />
      )}
    </div>
  );

}

type OfficeColumnProps = {
  offices: OfficeProps[]
}

export function getIncidentColumns(offices: OfficeColumnProps["offices"]): ColumnDef<IncidentsProps>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
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
      accessorKey: "office",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Office
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.getValue("office")}
        </Badge>
      ),
    },
    {
      accessorKey: "incident",
      header: "Incident Title",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.getValue("incident")}
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return <div> {row.getValue("updated_at")}</div>;
      },
    },
    {
      accessorKey: "updated_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Updated At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        return <div> {row.getValue("updated_at")}</div>;
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <IncidentActionsCell offices={offices} incident={row.original} />
        )
      },
    },
  ];
}
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
import { OfficeProps } from "@/types";
import { Badge } from "@/components/ui/badge";
import { router, Link } from "@inertiajs/react";
import { useState, useCallback } from "react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { EditOfficeFormDialog } from "@/pages/office/edit-office-form-dialog";

type DialogIsOpenProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  handleAction?: () => void;
  isDeleting?: boolean;
}

function DeleteOfficeAlertDialog({
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
            Are you sure you want to delete this office? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={handleAction}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Office"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface OfficeActionsCellProps {
  office: OfficeProps
}

function OfficeActionsCell({ office }: OfficeActionsCellProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<OfficeProps | undefined>();

  const handleDelete = useCallback(() => {
    if (!office?.id) {
      toast.error("Office ID is missing");
      return;
    }

    setIsDeleting(true);
    router.delete(route('offices.destroy', office.id), {
      preserveScroll: true,
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        toast.success("Office deleted successfully");
      },
      onError: (errors) => {
        console.error('Delete error:', errors);
        toast.error("Failed to delete office");
      },
      onFinish: () => setIsDeleting(false)
    });
  }, [office?.id]);

  const openUpdateDialog = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setDropdownOpen(false);
      setIsUpdateDialogOpen(true);
      setSelectedRow({
        id: office.id,
        office: office.office
      });
    },
    [office]
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
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href={`/incidents/${office.id}`}
              className="flex items-center cursor-pointer"
            >
              <Eye className="mr-2 h-4 w-4" />
              View
            </Link>
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

      <DeleteOfficeAlertDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        handleAction={handleDelete}
        isDeleting={isDeleting} 
      />

      {selectedRow && (
        <EditOfficeFormDialog
          isOpen={isUpdateDialogOpen}
          setIsOpen={setIsUpdateDialogOpen}
          office={selectedRow}
        />
      )}
    </div>
  );
}

export function getOfficeColumns(): ColumnDef<OfficeProps>[] {
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
        <Badge variant={'outline'}>{row.getValue("office")}</Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => <div className="lowercase">{row.getValue("created_at")}</div>,
    },
    {
      accessorKey: "updated_at",
      header: "Updated At",
      cell: ({ row }) => <div className="lowercase">{row.getValue("updated_at")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <OfficeActionsCell office={row.original} />
        );
      },
    },
  ]
}
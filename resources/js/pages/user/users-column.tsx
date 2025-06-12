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
import { OfficeDataProps, RoleProps, UsersDataProps } from "@/types";
import { Badge } from "@/components/ui/badge";
import { router } from "@inertiajs/react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { EditIncidentFormDialog } from "@/pages/incident/edit-incident-form-dialog";
import EditUserFormDialog from "./edit-user-form-dialog";

type DialogIsOpenProps = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  handleAction?: () => void
  isDeleting?: boolean
}

function DeleteUserAlertDialog({ isOpen, setIsOpen, handleAction, isDeleting }: DialogIsOpenProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this user? This action cannot be undone.
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

interface UserActionsCellProps {
  user: UsersDataProps
  offices: OfficeDataProps[]
  roles: RoleProps[]
}

function UserActionsCell({ user, offices, roles }: UserActionsCellProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<UsersDataProps | undefined>();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleDelete = useCallback(() => {
    setIsDeleting(true);
    router.delete(route('admin.users.destroy', { id: user.id }), {
      onSuccess: () => {
        setIsDeleting(false);
        setIsDeleteDialogOpen(false);
        toast.success('Horayyy', {
          description: 'You have successfully deleted a user.',
        });
      },
      onError: () => {
        setIsDeleting(false);
        toast.error('Oppss, please try again', {
          description: 'Failed to delete user.',
        });
      },
    });
  }, [user.id, setIsDeleting]);


  const openUpdateDialog = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setDropdownOpen(false);
      setIsUpdateDialogOpen(true);
      setSelectedRow(user);
    },
    [setDropdownOpen, setIsUpdateDialogOpen, user]
  );

  const openDeleteDialog = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDropdownOpen(false)
    setIsDeleteDialogOpen(true)
  }, [setDropdownOpen, setIsDeleteDialogOpen]);

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

      <DeleteUserAlertDialog isOpen={isDeleteDialogOpen} setIsOpen={setIsDeleteDialogOpen} handleAction={handleDelete} isDeleting={isDeleting} />
      <EditUserFormDialog offices={offices} roles={roles} user={user} isOpen={isUpdateDialogOpen} setIsOpen={setIsUpdateDialogOpen} />
    </div>
  );

}

type UserColumnProps = {
  users: UsersDataProps[]
  offices: OfficeDataProps[]
  roles: RoleProps[]
}

export function getUserColumns(users: UserColumnProps["users"], offices: UserColumnProps["offices"], roles: UserColumnProps["roles"]): ColumnDef<UsersDataProps>[] {
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
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.getValue("email")}
        </div>
      ),
    },
    {
      accessorKey: "municipality",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Municipality
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.getValue("municipality")}
        </Badge>
      ),
    },
    {
      accessorKey: "office",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Office / Authority
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
          <UserActionsCell user={row.original} offices={offices} roles={roles} />
        )
      },
    },
  ];
}
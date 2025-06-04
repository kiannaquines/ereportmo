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
import { ReportedIncidents } from "@/types";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { router, Link } from "@inertiajs/react";
import { toast } from 'sonner';
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UserProps } from "@/types";

type DialogIsOpenProps = {
  isOpen: boolean,
  setIsOpen: (open: boolean) => void,
  handleAction?: () => void,
  isDeleting?: boolean,
  isUpdating?: boolean,
  currentData?: Record<string, any>,
  reportedBy?: UserProps[],
}

function UpdateDialog({ isOpen, setIsOpen, handleAction, isUpdating, currentData, reportedBy }: DialogIsOpenProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <form onSubmit={handleAction}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>


          <div className="grid gap-4">
            <Label htmlFor="">Reported by</Label>
            <Select
              value=""
              onValueChange={() => { }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Reported by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kian Naquines">Kian Naquines</SelectItem>
                <SelectItem value="James Naquines">James Naquines</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            <Label htmlFor="">Incident Type</Label>
            <Select
              value=""
              onValueChange={() => { }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Incident Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Kian Naquines">Kian Naquines</SelectItem>
                <SelectItem value="James Naquines">James Naquines</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="image">Image</Label>
            <Input
              id="image"
              type="file"
              placeholder="Upload an image (optional)"
            />
          </div>

          <div className="grid gap-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter report description"
              value={currentData?.description || ""}
              onChange={() => { }}
            />
          </div>

          <div className="grid gap-4">
            <Label htmlFor="latitude">Enter Latitude (Optional)</Label>
            <Input
              id="latitude"
              name="latitude"
              type="text"
              placeholder="Enter latitude"
              value={currentData?.latitude || ""}
              onChange={() => { }}
            />
          </div>

          <div className="grid gap-4">
            <Label htmlFor="longitude">Enter Longitude (Optional)</Label>
            <Input
              id="longitude"
              name="longitude"
              type="text"
              placeholder="Enter longitude"
              value={currentData?.longitude || ""}
              onChange={() => { }}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isUpdating}>{isUpdating ? 'Please wait' : 'Save changes'}</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog >
  );
}


function DeleteReportedAlertDialog({ isOpen, setIsOpen, handleAction, isDeleting }: DialogIsOpenProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this reported incident? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700"
            onClick={handleAction}
          >
            {isDeleting ? "Deleting..." : "Delete Reported Incident"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export const ReportedIncidentsColumns: ColumnDef<ReportedIncidents>[] = [
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={'outline'} className="capitalize">{row.getValue("status")}</Badge>
    ),
  },
  {
    accessorKey: "source",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
    cell: ({ row }) => <Badge variant={'outline'}>{row.getValue("office")}</Badge>,
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
    cell: ({ row }) => <div className="lowercase">{row.getValue("latitude")}</div>,
  },
  {
    accessorKey: "longitude",
    header: "Longitude",
    cell: ({ row }) => <div className="lowercase">{row.getValue("longitude")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const report = row.original;
      const [isDeleting, setIsDeleting] = useState(false);
      const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
      const [dropdownOpen, setDropdownOpen] = useState(false);
      const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
      const [isUpdating, setIsUpdating] = useState(false);

      const handleDelete = () => {
        setIsDeleting(true);
        router.delete(route('reports.destroy', { report: report.id }), {
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
      };

      const handleUpdateAction = () => {
        setIsUpdating(true)
      }

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
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault()
                  setDropdownOpen(false);
                  setIsUpdateDialogOpen(true)
                }}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                onClick={(e) => {
                  e.preventDefault();
                  setDropdownOpen(false);
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DeleteReportedAlertDialog isOpen={isDeleteDialogOpen} setIsOpen={setIsDeleteDialogOpen} handleAction={handleDelete} isDeleting={isDeleting} />
          <UpdateDialog isOpen={isUpdateDialogOpen} setIsOpen={setIsUpdateDialogOpen} isUpdating={isUpdating} handleAction={handleUpdateAction} currentData={report} />
        </div >
      );
    },
  },
];
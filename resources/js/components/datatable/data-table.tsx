import React from "react";
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, Search } from "lucide-react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationLink,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import { FormDialog } from "../dialog/form-dialog";

type DataTableProps<T> = {
    data: T[];
    columns: ColumnDef<T>[];
    filterColumn?: keyof T;
    filterPlaceholder?: string;
    tableTitle?: string;
    tableDescription?: string;
    formDialog?: React.ReactNode;    
};

const DataTable = <T,>({
    data,
    columns,
    filterColumn,
    filterPlaceholder = "Filter...",
    tableTitle = "Data Table",
    tableDescription = "This table displays data with various functionalities such as sorting, filtering, and pagination.",
    formDialog,
}: DataTableProps<T>) => {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    const pageCount = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex;

    const renderPageNumbers = () => {
        const pages = [];

        if (pageCount <= 5) {
            for (let i = 0; i < pageCount; i++) {
                pages.push(i);
            }
        } else {
            pages.push(0);

            if (currentPage > 2) {
                pages.push(-1);
            }

            const startPage = Math.max(1, currentPage - 1);
            const endPage = Math.min(pageCount - 2, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            if (currentPage < pageCount - 3) {
                pages.push(-1);
            }

            pages.push(pageCount - 1);
        }

        return pages.map((page, index) => {
            if (page === -1) {
                return (
                    <PaginationItem key={"ellipsis-" + index}>
                        <PaginationEllipsis />
                    </PaginationItem>
                );
            }
            return (
                <PaginationItem key={page}>
                    <PaginationLink
                        href="#"
                        aria-current={page === currentPage ? "page" : undefined}
                        onClick={(e) => {
                            e.preventDefault();
                            table.setPageIndex(page);
                        }}
                    >
                        {page + 1}
                    </PaginationLink>
                </PaginationItem>
            );
        });
    };

    return (
        <>
            <div className="mb-4 flex ">
                <div className="flex-1">
                    <h2 className="text-lg font-semibold">{tableTitle}</h2>
                    <p className="text-sm text-muted-foreground">{tableDescription}</p>
                </div>
                <div className="flex items-center gap-2">
                    {formDialog && (
                        <>{formDialog}</>
                    )}
                </div>
            </div>
            <div className="flex items-center py-4 gap-2">
                {filterColumn && (
                    <div className="relative max-w-[20%]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder={filterPlaceholder}
                            value={(table.getColumn(filterColumn as string)?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn(filterColumn as string)?.setFilterValue(event.target.value)
                            }
                            className="pl-9"
                        />
                    </div>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto w-[125px]">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                >
                                    {column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex flex-row items-center justify-between py-4 gap-4 w-full">
                <div className="text-muted-foreground text-sm whitespace-nowrap">
                    Page {currentPage + 1} of {pageCount} — {table.getFilteredRowModel().rows.length} results
                </div>

                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    table.previousPage();
                                }}
                                aria-disabled={!table.getCanPreviousPage()}
                                tabIndex={table.getCanPreviousPage() ? 0 : -1}
                            />
                        </PaginationItem>

                        {renderPageNumbers()}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    table.nextPage();
                                }}
                                aria-disabled={!table.getCanNextPage()}
                                tabIndex={table.getCanNextPage() ? 0 : -1}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </>
    );
};

export default DataTable;

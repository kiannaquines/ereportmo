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
import { ChevronDown } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationNext,
    PaginationLink,
    PaginationEllipsis,
} from "@/components/ui/pagination";

type DataTableProps<T> = {
    data: T[];
    columns: ColumnDef<T>[];
    filterColumn?: keyof T;
    filterPlaceholder?: string;
    tableTitle?: string;
    tableDescription?: string;
};

const DataTable = <T,>({
    data,
    columns,
    filterColumn,
    filterPlaceholder = "Filter...",
    tableTitle = "Data Table",
    tableDescription = "This table displays data with various functionalities such as sorting, filtering, and pagination.",
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

    // Compute page numbers for PaginationLinks
    const pageCount = table.getPageCount();
    const currentPage = table.getState().pagination.pageIndex;

    // Helper to generate page buttons (you can customize logic here)
    const renderPageNumbers = () => {
        const pages = [];

        // Simple example: show first page, current page, last page with ellipsis
        if (pageCount <= 5) {
            for (let i = 0; i < pageCount; i++) {
                pages.push(i);
            }
        } else {
            pages.push(0); // first page

            if (currentPage > 2) {
                pages.push(-1); // ellipsis
            }

            const startPage = Math.max(1, currentPage - 1);
            const endPage = Math.min(pageCount - 2, currentPage + 1);

            for (let i = startPage; i <= endPage; i++) {
                pages.push(i);
            }

            if (currentPage < pageCount - 3) {
                pages.push(-1); // ellipsis
            }

            pages.push(pageCount - 1); // last page
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
            <div className="mb-4">
                <h2 className="text-lg font-semibold">{tableTitle}</h2>
                <p className="text-sm text-muted-foreground">
                    {tableDescription || "Manage your data efficiently with this table."}
                </p>
            </div>
            <div className="flex items-center py-4 gap-2">
                {filterColumn && (
                    <Input
                        placeholder={filterPlaceholder}
                        value={(table.getColumn(filterColumn as string)?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn(filterColumn as string)?.setFilterValue(event.target.value)
                        }
                        className="max-w-sm"
                    />
                )}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
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

            <div className="flex items-center justify-evenly py-4 max-w-full gap-4 flex-wrap md:flex-nowrap">
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

                <Select
                    value={String(table.getState().pagination.pageSize)}
                    onValueChange={(value) => {
                        table.setPageSize(Number(value));
                    }}
                >
                    <SelectTrigger className="ml-4 rounded border p-1 w-[180px]">
                        <SelectValue placeholder="Show page size" />
                    </SelectTrigger>
                    <SelectContent>
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <SelectItem key={pageSize} value={String(pageSize)}>
                                Show {pageSize}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

        </>
    );
};

export default DataTable;

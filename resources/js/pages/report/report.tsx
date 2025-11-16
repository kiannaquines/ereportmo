import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, ReportProps } from '@/types';
import { Head } from '@inertiajs/react';
import { ChevronDownIcon, PrinterCheck, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import DataTable from '../datatable/datatable';
import { AddIncidentReportDialog } from './add-report-form-dialog';
import { getReportedIncidentsColumns } from './reported-incidents-columns';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Incidents',
        href: '/incidents',
    },
];
const formatDate = (date: any) => date.toISOString().split('T')[0];

export default function Report({ reportedBy, reportedIncidents, incidents }: ReportProps) {
    const [openFrom, setOpenFrom] = useState(false);
    const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);

    const [openTo, setOpenTo] = useState(false);
    const [dateTo, setDateTo] = useState<Date | undefined>(undefined);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-4 md:min-h-min">
                    <div className="mb-5 flex items-center justify-between">
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row gap-3">
                                <Popover open={openFrom} onOpenChange={setOpenFrom}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" id="date" className="w-48 justify-between font-normal">
                                            {dateFrom ? dateFrom.toLocaleDateString() : 'Date From'}
                                            <ChevronDownIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={dateFrom}
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                setDateFrom(date);
                                                setOpenFrom(false);
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>

                                <Popover open={openTo} onOpenChange={setOpenTo}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" id="date" className="w-48 justify-between font-normal">
                                            {dateTo ? dateTo.toLocaleDateString() : 'Date To'}
                                            <ChevronDownIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={dateTo}
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                setDateTo(date);
                                                setOpenTo(false);
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>

                                <div className="flex flex-row gap-4">
                                    {/* Export by Date Range */}
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            if (!dateFrom || !dateTo) {
                                                toast.error("Please select both 'Date From' and 'Date To'");
                                                return;
                                            }

                                            if (dateFrom > dateTo) {
                                                toast.error("'Date From' must be earlier than 'Date To'");
                                                return;
                                            }

                                            // Build URL with query params
                                            const params = new URLSearchParams({
                                                from: formatDate(dateFrom),
                                                to: formatDate(dateTo),
                                            });

                                            window.location.href = `${route('report.incident.export')}?${params.toString()}`;
                                        }}
                                        className="flex items-center gap-2"
                                    >
                                        <SlidersHorizontal className="h-4 w-4" />
                                        Export by Date Range
                                    </Button>

                                    {/* Export All */}
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            window.location.href = route('report.incident.export');
                                        }}
                                        className="flex items-center gap-2"
                                    >
                                        <PrinterCheck className="h-4 w-4" />
                                        Export All Reports
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <DataTable
                        data={reportedIncidents}
                        columns={getReportedIncidentsColumns(reportedBy, incidents)}
                        filterColumn="source"
                        filterPlaceholder="Filter by source..."
                        tableTitle="Reported Incidents"
                        tableDescription="This table displays reported incidents."
                        addButtonName="Add New Reported Incident"
                        renderAddDialog={({ isOpen, setIsOpen }) => (
                            <AddIncidentReportDialog isOpen={isOpen} setIsOpen={setIsOpen} reportedBy={reportedBy} incidents={incidents} />
                        )}
                    />
                </div>
            </div>
        </AppLayout>
    );
}

import DataTable from '../datatable/datatable';
import { getReportedIncidentsColumns } from './reported-incidents-columns';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, ReportProps } from '@/types';
import { Head } from '@inertiajs/react';
import { AddIncidentReportDialog } from './add-report-form-dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { ChevronDownIcon, PrinterCheck, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Incidents',
        href: '/incidents',
    },
];

export default function Report({ reportedBy, reportedIncidents, incidents }: ReportProps) {

    const [openFrom, setOpenFrom] = useState(false)
    const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)

    const [openTo, setOpenTo] = useState(false)
    const [dateTo, setDateTo] = useState<Date | undefined>(undefined)

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min p-4">
                    <div className='flex justify-between items-center mb-5'>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row gap-3">
                                <Popover open={openFrom} onOpenChange={setOpenFrom}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            id="date"
                                            className="w-48 justify-between font-normal"
                                        >
                                            {dateFrom ? dateFrom.toLocaleDateString() : "Date From"}
                                            <ChevronDownIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={dateFrom}
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                setDateFrom(date)
                                                setOpenFrom(false)
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>

                                <Popover open={openTo} onOpenChange={setOpenTo}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            id="date"
                                            className="w-48 justify-between font-normal"
                                        >
                                            {dateTo ? dateTo.toLocaleDateString() : "Date To"}
                                            <ChevronDownIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={dateTo}
                                            captionLayout="dropdown"
                                            onSelect={(date) => {
                                                setDateTo(date)
                                                setOpenTo(false)
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>

                                <div className="flex flex-row gap-4">
                                    <Button variant={`outline`} onClick={() => {
                                        if (dateFrom && dateTo) {
                                            if (dateFrom > dateTo) {
                                                toast.error("Date from must be less than date to")
                                            } else {
                                                window.location.href = route('report.incident.export')
                                            }
                                        } else {
                                            toast.error("Please select date from and date to")
                                        }
                                    }}>
                                        <SlidersHorizontal />
                                        Export by Date Range
                                    </Button>

                                    <Button variant={`outline`} onClick={() => {
                                        window.location.href = route('report.incident.export')
                                    }}>
                                        <PrinterCheck/>
                                        All Report
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
                            <AddIncidentReportDialog
                                isOpen={isOpen}
                                setIsOpen={setIsOpen}
                                reportedBy={reportedBy}
                                incidents={incidents}
                            />
                        )}
                    />
                </div>
            </div>
        </AppLayout>
    );
}
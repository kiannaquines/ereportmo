import DataTable from '@/components/datatable/datatable';
import { getReportedIncidentsColumns } from '@/components/datatable/report/reported-incidents-columns';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, ReportProps } from '@/types';
import { Head } from '@inertiajs/react';
import { AddIncidentReportDialog } from './add-report-form-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Incidents',
        href: '/incidents',
    },
];

export default function Report({ reportedBy, reportedIncidents, incidents }: ReportProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min p-4">
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
import DataTable from '../datatable/datatable';
import { getOfficeColumns } from '../datatable/office/office-columns';
import AppLayout from '@/layouts/app-layout';
import { OfficeDataProps, type BreadcrumbItem } from '@/types';
import { OfficeFormDialog } from './add-office-form-dialog';
import { Head } from '@inertiajs/react';

export type OfficeProps = {
  offices: OfficeDataProps[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Offices',
    href: '/office',
  },
];

export default function Office({ offices }: OfficeProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Authorities" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min p-4">
          <DataTable
            data={offices}
            columns={getOfficeColumns()}
            filterColumn="office"
            filterPlaceholder="Filter by office..."
            tableTitle="Authorities"
            tableDescription="This table displays authorities."
            addButtonName='Add New Office'
            renderAddDialog={({ isOpen, setIsOpen }) => (
              <OfficeFormDialog
                isOpen={isOpen}
                setIsOpen={setIsOpen}
              />
            )}
          />
        </div>
      </div>
    </AppLayout>
  );
}
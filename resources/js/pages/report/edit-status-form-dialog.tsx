import { useState, useEffect, useCallback } from 'react';
import { useForm, router } from '@inertiajs/react';
import { FormDialog } from '@/pages/dialog/form-dialog';
import { toast } from 'sonner';

export type EditIncidentStatusReport = {
  id: string;
  status: string;
};

export type EditIncidentStatusReportDialogProps = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  report: EditIncidentStatusReport;
};

export function EditIncidentStatusReportDialog({
  isOpen,
  setIsOpen,
  report,
}: EditIncidentStatusReportDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, setData } = useForm({
    id: '',
    status: '',
  });

  useEffect(() => {
    if (report && isOpen) {
      setData({
        id: report.id,
        status: report.status ?? '',
      });
    }
  }, [report, isOpen, setData]);


  const handleStatusUpdate = useCallback(
    (
      formData: Record<string, any>,
      { onSuccess, onError }: { onSuccess: () => void; onError: () => void }
    ) => {
      if (isSubmitting) return;

      if (!report?.id) {
        toast.error('No reported incident ID available');
        onError();
        return;
      }

      setIsSubmitting(true);

      const payload = new FormData();
      payload.append('_method', 'PUT');
      payload.append('status', formData.status);

      router.post(route('reports.status', report.id), payload, {
        forceFormData: true,
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Reported Incident status updated successfully');
          setIsOpen(false);
          onSuccess();
          setIsSubmitting(false);
        },
        onError: (errors) => {
          Object.values(errors).forEach((message) => {
            toast.error('Failed to update reported incident status', {
              description: String(message),
            });
          });
          onError();
          setIsSubmitting(false);
        },
      });
    },
    [isSubmitting, report?.id, setIsOpen]
  );

  return (
    <FormDialog
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title="Edit Reported Incident Status"
      description="Edit reported incident status dialog"
      submitLabel="Update Status"
      fields={[
        {
          id: 'status',
          type: 'select',
          label: 'Incident Status',
          placeholder: 'Select incident status',
          value: data.status,
          options: [
            { label: 'New', value: 'New' },
            { label: 'Assigned', value: 'Assigned' },
            { label: 'In Progress', value: 'In Progress' },
            { label: 'Resolved', value: 'Resolved' },
            { label: 'Closed', value: 'Closed' },
          ],
        },
      ]}
      disabled={isSubmitting}
      onSubmit={handleStatusUpdate}
    />
  );
}

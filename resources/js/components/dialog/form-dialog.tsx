import { ChangeEvent, FormEvent, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormDialogProps } from '@/types';

export function FormDialog({
  title,
  isMultipart,
  description,
  triggerLabel,
  fields,
  onSubmit,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  triggerVariant = "default",
  disabled = false,
  onSuccess,
}: FormDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const getInitialFormData = () =>
    Object.fromEntries(fields.map((field) => [field.id, field.value || field.defaultValue || ""]))

  const [formData, setFormData] = useState<Record<string, string | File | null>>(
    getInitialFormData()
  )

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value, files } = e.target as HTMLInputElement;

    if (type === "file") {
      setFormData((prev) => ({ ...prev, [name]: files && files[0] ? files[0] : null }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise<void>((resolve, reject) => {
        onSubmit(formData, {
          onSuccess: () => {
            onSuccess?.();
            setFormData(getInitialFormData());
            setIsOpen(false);
            resolve();
          },
          onError: () => {
            reject(new Error("Form submission failed"));
          },
        });
      });
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant}>{triggerLabel}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} {...(isMultipart ? { encType: "multipart/form-data" } : {})}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {fields.map((field) => (
              <div key={field.id} className="grid gap-2">
                <Label htmlFor={field.id}>{field.label}</Label>

                {field.type === "textarea" ? (
                  <Textarea
                    id={field.id}
                    name={field.id}
                    placeholder={field.placeholder}
                    value={formData[field.id] as string || ''}
                    onChange={handleChange}
                  />
                ) : field.type === "select" && field.options ? (
                  <Select
                    value={formData[field.id] as string || ''}
                    onValueChange={(val) => handleSelectChange(field.id, val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={field.placeholder || "Select"} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value} title={opt.label}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : field.type === "file" ? (
                  <>
                    <Input
                      id={field.id}
                      name={field.id}
                      type="file"
                      placeholder={field.placeholder}
                      onChange={handleChange}
                    />
                    {formData[field.id] instanceof File && (
                      <img
                        src={URL.createObjectURL(formData[field.id] as File)}
                        alt="Preview"
                        className="mt-2 h-24 w-auto rounded-md object-cover"
                      />
                    )}
                  </>
                ) : (
                  <Input
                    id={field.id}
                    name={field.id}
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    value={formData[field.id] as string || ''}
                    onChange={handleChange}
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                {cancelLabel}
              </Button>
            </DialogClose>
            <Button type="submit" disabled={disabled || isSubmitting}>
              {isSubmitting ? "Submitting..." : submitLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
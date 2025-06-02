import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    type: 'Main Module' | 'Report Module' | 'Settings' | null;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    municipality: string;
    barangay: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
}

export type ReportedIncidents = {
    id: string;
    incident: string;
    description: string;
    office: string;
    source: string;
    image: string;
    status: string | "New" | "Investigating" | "Resolved" | "Closed";
    latitude: string;
    longitude: string;
    created_at: string;
    updated_at: string;
};

export type Incidents = {
    id: string;
    incident: string;
    office: string;
    created_at: string;
    updated_at: string;
};

export type DashboardCard = {
    title: string;
    description: string;
    value: number | string;
    icon: LucideIcon;
}

export type PageProps<T = {}> = T & {
    auth?: any;
    errors?: any;
};

export type Office = {
    id: string;
    office: string;
    created_at: string;
    updated_at: string;
}

export type OfficeProps = {
    id: string;
    office: string;
}

export type IncidentsProps = {
    id: string;
    incident: string;
    office: string;
    created_at: string;
    updated_at: string;
}

export type IncidentFormDialogProp = {
    offices: OfficeProps[];
}

export type IncidentPageProps = PageProps & {
    offices: OfficeProps[];
    incidents: IncidentsProps[];
}

export type FormField = {
    id: string
    label: string
    type?: "text" | "email" | "password" | "textarea" | "select" | "file"
    placeholder?: string
    defaultValue?: string
    value?: string
    options?: { label: string; value: string }[],
}

export type FormDialogProps = {
    title: string
    isMultipart: boolean
    description?: string
    triggerLabel: string
    fields: FormField[]
    onSubmit: (
        formData: Record<string, string | File | null>,
        callbacks: { onSuccess: () => void; onError: () => void }
    ) => void;
    submitLabel?: string
    cancelLabel?: string
    triggerVariant?: "default" | "outline" | "destructive" | "ghost",
    disabled: boolean
    onSuccess?: () => void
}

export type UserProps = {
    id: string;
    name: string;
}

export type IncidentsProps = {
    id: string;
    office: string;
    incident: string;
}

export type ReportedByProps = {
    reportedBy: UserProps[];
    incidents: IncidentsProps[];
}

export type ReportedIncidentsProps = {
    id: string;
    incident: string;
    description: string;
    office: string;
    source: string;
    image: string;
    status: string;
    latitude: string;
    longitude: string;
    created_at: string;
    updated_at: string;
}

export type ReportProps = {
    reportedBy: UserProps[];
    reportedIncidents: ReportedIncidentsProps[];
    incidents: IncidentsProps[];
}
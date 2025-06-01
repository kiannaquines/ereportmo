import { ReportedIncidents } from "@/types";

export const ReportedIncidentsData: ReportedIncidents[] = [
    {
        id: "inc001",
        title: "Unauthorized access attempt",
        description: "Multiple failed login attempts detected on admin portal.",
        status: "investigating",
        reported: "alice@example.com",
    },
    {
        id: "inc002",
        title: "Data breach",
        description: "Sensitive customer data may have been exposed.",
        status: "confirmed",
        reported: "bob@example.com",
    },
    {
        id: "inc003",
        title: "System outage",
        description: "Service downtime in region AP-SOUTHEAST-1.",
        status: "resolved",
        reported: "carol@example.com",
    },
    {
        id: "inc004",
        title: "Suspicious file upload",
        description: "A potentially malicious file was uploaded to the server.",
        status: "under review",
        reported: "dave@example.com",
    },
    {
        id: "inc005",
        title: "Phishing email reported",
        description: "Users received a fake internal email requesting credentials.",
        status: "resolved",
        reported: "eve@example.com",
    },
    {
        id: "inc006",
        title: "Firewall misconfiguration",
        description: "Open ports detected during routine audit.",
        status: "confirmed",
        reported: "frank@example.com",
    },
    {
        id: "inc007",
        title: "Unencrypted data transfer",
        description: "Detected transmission of sensitive data over HTTP.",
        status: "investigating",
        reported: "grace@example.com",
    },
];

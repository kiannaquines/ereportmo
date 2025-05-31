import { Payment } from "@/types";

export const paymentData: Payment[] = [
    {
        id: "pymt001",
        amount: 250.00,
        status: "success",
        email: "alice@example.com",
    },
    {
        id: "pymt002",
        amount: 450.50,
        status: "failed",
        email: "bob@example.com",
    },
    {
        id: "pymt003",
        amount: 1200.75,
        status: "processing",
        email: "carol@example.com",
    },
    {
        id: "pymt004",
        amount: 78.00,
        status: "pending",
        email: "dave@example.com",
    },
    {
        id: "pymt005",
        amount: 985.00,
        status: "success",
        email: "eve@example.com",
    },
    {
        id: "pymt006",
        amount: 639.90,
        status: "success",
        email: "frank@example.com",
    },
    {
        id: "pymt007",
        amount: 152.25,
        status: "failed",
        email: "grace@example.com",
    },
];
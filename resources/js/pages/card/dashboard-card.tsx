import { DashboardCard as DashboardCardType } from "@/types";

const DashboardCard = ({ title, value, description, icon: Icon }: DashboardCardType) => {
    return (
        <div className="border-sidebar-border/70 dark:border-sidebar-border relative h-36 overflow-hidden rounded-xl border p-4">
            <div className="flex flex-col justify-between h-full">
                <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                    {title}
                    <Icon className="h-4 w-4" />
                </div>
                <div className="text-3xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
        </div>
    )
}

export default DashboardCard;

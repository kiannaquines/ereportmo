import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SharedData, type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { KeyRound, SunMoon, Gauge, MessageCircleWarning, CableCar, UserPen, Building, Printer, Users } from 'lucide-react';
import AppLogo from './app-logo';
import { usePage } from '@inertiajs/react'

const modulesPath: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
        type: 'Main Module',
        icon: Gauge,
    },
    {
        title: 'Incident Types',
        href: route('incidents.index'),
        type: 'Main Module',
        icon: CableCar,
    },
    {
        title: 'Reported Incidents',
        href: route('reports.index'),
        type: 'Main Module',
        icon: MessageCircleWarning,
    },
    {
        title: 'Authorities',
        href: route('offices.index'),
        type: 'Main Module',
        icon: Building,
    },
    {
        title: 'Users',
        href: route('admin.users.index'),
        type: 'Main Module',
        icon: Users,
    },
    {
        title: 'Profile',
        href: route('settings'),
        type: 'Settings',
        icon: UserPen,
    },
    {
        title: 'Password',
        href: route('password.edit'),
        type: 'Settings',
        icon: KeyRound,
    },
    {
        title: 'Appearance',
        href: route('appearance'),
        type: 'Settings',
        icon: SunMoon,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props
    const role = auth.user.role
    const visibleModules = modulesPath.filter(item => {
        if (role === "1") return true;

        const adminOnly = ["Users","Authorities"];
        return !adminOnly.includes(item.title);
    });

    return (
        <Sidebar collapsible="icon" variant="sidebar">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={visibleModules} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { KeyRound, SunMoon, Gauge, MessageCircleWarning, CableCar, UserPen, Building, Printer } from 'lucide-react';
import AppLogo from './app-logo';

const modulesPath: NavItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
        type: 'Main Module',
        icon: Gauge,
    },
    {
        title: 'Incidents',
        href: route('incidents.index'),
        type: 'Main Module',
        icon: CableCar,
    },
    {
        title: 'Reports',
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
                <NavMain items={modulesPath} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

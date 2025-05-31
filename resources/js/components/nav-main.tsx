import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
  const page = usePage();

  // Group items by type (e.g., 'Main Module')
  const groupedItems = items.reduce<Record<string, NavItem[]>>((acc, item) => {
    const key = item.type || 'Other';
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <>
      {Object.entries(groupedItems).map(([type, groupItems]) => (
        <SidebarGroup key={type} className="px-2 py-0">
          {type !== 'Other' && (
            <SidebarGroupLabel className="mb-2">{type}</SidebarGroupLabel>
          )}
          <SidebarMenu>
            {groupItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={item.href === page.url}
                  tooltip={{ children: item.title }}
                >
                  <Link href={item.href} prefetch>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}

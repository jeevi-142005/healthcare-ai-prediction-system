import { 
  LayoutDashboard, 
  Users, 
  Network, 
  Calendar, 
  TrendingUp, 
  AlertTriangle, 
  BarChart3,
  CalendarDays 
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "wouter";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Patient Management",
    url: "/patients",
    icon: Users,
  },
  {
    title: "Resource Allocation",
    url: "/resources",
    icon: Network,
  },
  {
    title: "Staff Scheduler",
    url: "/scheduler",
    icon: Calendar,
  },
  {
    title: "Forecasting & Analytics",
    url: "/analytics",
    icon: TrendingUp,
  },
  {
    title: "Emergency Management",
    url: "/emergency",
    icon: AlertTriangle,
  },
  {
    title: "Performance Monitoring",
    url: "/performance",
    icon: BarChart3,
  },
  {
    title: "Appointments",
    url: "/appointments",
    icon: CalendarDays,
  },
];

export function AppSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary">
            <Network className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Healthcare AI</h2>
            <p className="text-xs text-muted-foreground">Resource Management</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    data-active={location === item.url}
                    className="data-[active=true]:bg-sidebar-accent"
                    data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

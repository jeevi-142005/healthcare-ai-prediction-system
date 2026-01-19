import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import Dashboard from "@/pages/dashboard";
import PatientManagement from "@/pages/patient-management";
import ResourceAllocation from "@/pages/resource-allocation";
import StaffScheduler from "@/pages/staff-scheduler";
import ForecastingAnalytics from "@/pages/forecasting-analytics";
import EmergencyManagement from "@/pages/emergency-management";
import PerformanceMonitoring from "@/pages/performance-monitoring";
import Appointments from "@/pages/appointments";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import { NotificationCenter } from "@/components/notifications";

function AuthenticatedRouter() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/patients" component={PatientManagement} />
      <Route path="/resources" component={ResourceAllocation} />
      <Route path="/scheduler" component={StaffScheduler} />
      <Route path="/analytics" component={ForecastingAnalytics} />
      <Route path="/emergency" component={EmergencyManagement} />
      <Route path="/performance" component={PerformanceMonitoring} />
      <Route path="/appointments" component={Appointments} />
    </Switch>
  );
}

function PublicRouter() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route component={Login} />
    </Switch>
  );
}

function AppContent() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return <PublicRouter />;
  }

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="flex items-center justify-between p-4 border-b sticky top-0 z-50 bg-background">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Welcome, {user.username}</span>
              <NotificationCenter />
              <Button variant="outline" size="sm" onClick={logout}>
                Logout
              </Button>
              <ThemeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            <AuthenticatedRouter />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <AppContent />
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

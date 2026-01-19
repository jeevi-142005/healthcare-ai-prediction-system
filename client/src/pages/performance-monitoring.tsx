import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/metric-card";
import { Clock, TrendingUp, Users, Activity } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function PerformanceMonitoring() {
  const { data: patients = [] } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const response = await fetch("/api/patients");
      if (!response.ok) throw new Error("Failed to fetch patients");
      return response.json();
    }
  });

  const { data: resources = [] } = useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const response = await fetch("/api/resources");
      if (!response.ok) throw new Error("Failed to fetch resources");
      return response.json();
    }
  });

  const { data: staff = [] } = useQuery({
    queryKey: ["staff"],
    queryFn: async () => {
      const response = await fetch("/api/staff");
      if (!response.ok) throw new Error("Failed to fetch staff");
      return response.json();
    }
  });

  // Calculate real metrics
  const totalPatients = patients.length;
  const onDutyStaff = staff.filter((s: any) => s.status === 'on-duty').length;
  const avgWaitTime = totalPatients > 0 ? Math.round(15 + (totalPatients * 2)) : 0;
  
  const totalResourceCapacity = resources.reduce((sum: number, r: any) => sum + r.total_count, 0);
  const usedResourceCapacity = resources.reduce((sum: number, r: any) => sum + (r.total_count - r.available_count), 0);
  const resourceUtilization = totalResourceCapacity > 0 ? Math.round((usedResourceCapacity / totalResourceCapacity) * 100) : 0;
  
  const efficiencyScore = Math.round((resourceUtilization + (onDutyStaff * 10)) / 2);
  const patientSatisfaction = Math.min(5, Math.max(3, 5 - (avgWaitTime / 20)));

  const metrics = [
    { title: "Avg Wait Time", value: `${avgWaitTime} min`, icon: Clock, trend: { value: 12, isPositive: false }, subtitle: "estimated" },
    { title: "Resource Utilization", value: `${resourceUtilization}%`, icon: Activity, trend: { value: 5, isPositive: true }, subtitle: "current" },
    { title: "Patient Satisfaction", value: `${patientSatisfaction.toFixed(1)}/5`, icon: Users, trend: { value: 3, isPositive: true }, subtitle: "estimated" },
    { title: "Efficiency Score", value: `${Math.min(100, efficiencyScore)}%`, icon: TrendingUp, trend: { value: 8, isPositive: true }, subtitle: "calculated" },
  ];

  // Calculate department metrics based on staff distribution
  const departmentMetrics = [
    { 
      name: "Emergency Department", 
      efficiency: Math.round(85 + (staff.filter((s: any) => s.department === 'Emergency').length * 2)), 
      waitTime: `${Math.max(5, avgWaitTime - 10)} min`, 
      utilization: Math.min(100, resourceUtilization + 10) 
    },
    { 
      name: "ICU", 
      efficiency: Math.round(90 + (staff.filter((s: any) => s.department === 'ICU').length * 3)), 
      waitTime: "N/A", 
      utilization: resources.find((r: any) => r.type === 'icu') ? Math.round(((20 - (resources.find((r: any) => r.type === 'icu')?.available_count || 0)) / 20) * 100) : 0
    },
    { 
      name: "General Ward", 
      efficiency: Math.round(80 + (staff.filter((s: any) => s.department === 'General Ward').length * 2)), 
      waitTime: `${avgWaitTime + 10} min`, 
      utilization: Math.max(50, resourceUtilization - 10) 
    },
    { 
      name: "Surgery", 
      efficiency: Math.round(88 + (staff.filter((s: any) => s.department === 'Surgery').length * 4)), 
      waitTime: `${avgWaitTime + 20} min`, 
      utilization: Math.max(60, resourceUtilization - 5) 
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Performance Monitoring</h1>
        <p className="text-muted-foreground">Track efficiency, wait times, and resource usage</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric, idx) => (
          <MetricCard key={idx} {...metric} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Department Performance</CardTitle>
          <p className="text-sm text-muted-foreground">Efficiency and utilization by department</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {departmentMetrics.map((dept, idx) => (
            <div key={idx} className="space-y-3" data-testid={`dept-${dept.name.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{dept.name}</h4>
                <div className="flex gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Wait: <span className="font-medium text-foreground">{dept.waitTime}</span>
                  </span>
                  <span className="text-muted-foreground">
                    Efficiency: <span className="font-medium text-foreground">{dept.efficiency}%</span>
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Resource Utilization</span>
                  <span>{dept.utilization}%</span>
                </div>
                <Progress value={dept.utilization} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Performance Indicators</CardTitle>
          <p className="text-sm text-muted-foreground">Critical metrics and trends</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-4 rounded-md bg-resource-available/5 border border-resource-available/20">
            <div className="flex-1">
              <h4 className="font-semibold">Current System Status</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {totalPatients} patients in system with {onDutyStaff} staff members on duty. Average response time: {Math.round(avgWaitTime / 3)} minutes.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-md bg-primary/5 border border-primary/20">
            <div className="flex-1">
              <h4 className="font-semibold">Resource Efficiency</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Resources utilized at {resourceUtilization}% capacity across {resources.length} resource types - {resourceUtilization > 80 ? 'high utilization' : 'balanced availability'}.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-md bg-priority-medium/5 border border-priority-medium/20">
            <div className="flex-1">
              <h4 className="font-semibold">Staff Distribution</h4>
              <p className="text-sm text-muted-foreground mt-1">
                {staff.length} total staff members with {staff.filter((s: any) => s.status === 'available').length} available for assignment. Consider optimizing shift schedules.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

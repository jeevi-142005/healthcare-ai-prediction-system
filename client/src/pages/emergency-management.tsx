import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Users, Bed, Ambulance, Building2, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
interface EmergencyManagementProps {
  onBack?: () => void;
}

export default function EmergencyManagement({ onBack }: EmergencyManagementProps) {
  const [emergencyActive, setEmergencyActive] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: emergencyEvents = [] } = useQuery({
    queryKey: ["emergency-events"],
    queryFn: async () => {
      const response = await fetch("/api/emergency-events");
      if (!response.ok) throw new Error("Failed to fetch emergency events");
      return response.json();
    }
  });

  const createEmergencyMutation = useMutation({
    mutationFn: async (event: any) => {
      const response = await fetch("/api/emergency-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event)
      });
      if (!response.ok) throw new Error("Failed to create emergency event");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergency-events"] });
      toast({ title: "Emergency event created" });
    }
  });

  const resolveEmergencyMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/emergency-events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "resolved" })
      });
      if (!response.ok) throw new Error("Failed to resolve emergency");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emergency-events"] });
      toast({ title: "Emergency resolved" });
    }
  });

  // Mock data instead of API calls
  const resources = [
    { id: 1, name: 'Hospital Beds', type: 'beds', available_count: 85, total_count: 120 },
    { id: 2, name: 'ICU Units', type: 'icu', available_count: 18, total_count: 20 },
    { id: 3, name: 'Doctors', type: 'staff', available_count: 15, total_count: 25 },
    { id: 4, name: 'Ambulances', type: 'vehicles', available_count: 3, total_count: 8 }
  ];
  
  const staff = [
    { id: 1, name: 'Dr. Sarah Johnson', status: 'on-duty' },
    { id: 2, name: 'Nurse Mike Davis', status: 'on-duty' },
    { id: 3, name: 'Dr. Emily Brown', status: 'available' },
    { id: 4, name: 'Nurse John Smith', status: 'on-duty' },
    { id: 5, name: 'Dr. Robert Wilson', status: 'break' }
  ];
  
  const isLoading = false;

  const updateResourceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const response = await fetch(`/api/resources/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error("Failed to update resource");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      toast({ title: "Emergency reallocation applied" });
    }
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'beds': return Bed;
      case 'icu': return Building2;
      case 'staff': return Users;
      case 'vehicles': return Ambulance;
      default: return Bed;
    }
  };

  const currentAllocation = resources.map((resource: any) => ({
    id: resource.id,
    resource: resource.name,
    icon: getIcon(resource.type),
    current: resource.available_count,
    proposed: Math.min(resource.total_count, resource.available_count + Math.floor(resource.total_count * 0.2))
  }));

  const onDutyStaff = staff.filter((s: any) => s.status === 'on-duty').length;
  const totalStaff = staff.length;



  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => onBack && onBack()}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Emergency Management</h1>
            <p className="text-muted-foreground">Simulate and manage resource reallocation during surge</p>
          </div>
        </div>
        <Button
          variant={emergencyActive ? "destructive" : "default"}
          onClick={() => {
            if (emergencyActive) {
              setEmergencyActive(false);
            } else {
              setEmergencyActive(true);
              createEmergencyMutation.mutate({
                title: "System Emergency Activated",
                description: "Manual emergency mode activation - resource reallocation in progress",
                severity: "high",
                affected_resources: "All departments"
              });
            }
          }}
          disabled={createEmergencyMutation.isPending}
          data-testid="button-toggle-emergency"
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          {emergencyActive ? 'Deactivate Emergency' : 'Activate Emergency Mode'}
        </Button>
      </div>

      {(emergencyActive || emergencyEvents.length > 0) && (
        <Alert variant="destructive" data-testid="alert-emergency-active">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>{emergencyEvents.length > 0 ? `${emergencyEvents.length} Active Emergency(s)` : 'Emergency Mode Active'}</AlertTitle>
          <AlertDescription>
            {emergencyEvents.length > 0 
              ? `Active emergencies: ${emergencyEvents.map((e: any) => e.title).join(', ')}`
              : 'Resource reallocation protocol is now in effect. All non-critical procedures have been postponed.'
            }
          </AlertDescription>
        </Alert>
      )}

      {emergencyEvents.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active Emergency Events</CardTitle>
            <p className="text-sm text-muted-foreground">Current emergency situations</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {emergencyEvents.map((event: any) => (
              <div key={event.id} className="flex items-start justify-between p-4 rounded-md bg-destructive/5 border border-destructive/20">
                <div className="flex-1">
                  <h4 className="font-semibold">{event.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={event.severity === 'critical' ? 'destructive' : 'secondary'}>
                      {event.severity}
                    </Badge>
                    <Badge variant="outline">
                      {new Date(event.created_at * 1000).toLocaleTimeString()}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => resolveEmergencyMutation.mutate(event.id)}
                  disabled={resolveEmergencyMutation.isPending}
                >
                  Resolve
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Current Allocation</CardTitle>
            <p className="text-sm text-muted-foreground">Normal operation mode</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="text-center py-4">Loading resources...</div>
            ) : (
              currentAllocation.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-md bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span className="font-medium">{item.resource}</span>
                  </div>
                  <Badge variant="outline">{item.current} available</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proposed Reallocation</CardTitle>
            <p className="text-sm text-muted-foreground">Emergency surge protocol</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentAllocation.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-md bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">{item.resource}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{item.current}</Badge>
                  <span className="text-muted-foreground">→</span>
                  <Badge className="bg-primary text-primary-foreground">{item.proposed}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reallocation Actions</CardTitle>
          <p className="text-sm text-muted-foreground">Changes to be implemented</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-4 rounded-md bg-muted/50">
            <div className="flex-1">
              <h4 className="font-semibold">Increase Resource Availability</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Boost all resource availability by 20% through emergency protocols and reserve activation.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-md bg-muted/50">
            <div className="flex-1">
              <h4 className="font-semibold">Recall Off-Duty Staff</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Contact {totalStaff - onDutyStaff} off-duty staff members for immediate emergency response.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-md bg-muted/50">
            <div className="flex-1">
              <h4 className="font-semibold">Activate Emergency Protocols</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Implement surge capacity measures across all departments to handle increased patient load.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {emergencyActive && (
        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={() => setEmergencyActive(false)}
            data-testid="button-cancel-reallocation"
          >
            Cancel
          </Button>
          <Button 
            onClick={() => {
              // Apply emergency reallocation by increasing available resources
              currentAllocation.forEach((item: any) => {
                updateResourceMutation.mutate({
                  id: item.id,
                  data: { available_count: item.proposed, status: 'available' }
                });
              });
              setEmergencyActive(false);
            }}
            disabled={updateResourceMutation.isPending}
            data-testid="button-apply-reallocation"
          >
            {updateResourceMutation.isPending ? 'Applying...' : 'Apply Reallocation'}
          </Button>
        </div>
      )}
    </div>
  );
}

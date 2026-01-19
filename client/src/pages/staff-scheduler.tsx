import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, RefreshCw, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StaffScheduler() {
  const [optimizing, setOptimizing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    department: "",
    shift: "",
    status: "available"
  });
  const { toast } = useToast();

  const [staff, setStaff] = useState([
    { id: 1, name: "Dr. Sarah Johnson", role: "Doctor", department: "Emergency", shift: "Morning", status: "on-duty" },
    { id: 2, name: "Nurse Mike Davis", role: "Nurse", department: "ICU", shift: "Night", status: "on-duty" },
    { id: 3, name: "Dr. Emily Brown", role: "Doctor", department: "Surgery", shift: "Evening", status: "available" },
    { id: 4, name: "Nurse John Smith", role: "Nurse", department: "General Ward", shift: "Morning", status: "on-duty" },
    { id: 5, name: "Dr. Robert Wilson", role: "Doctor", department: "Cardiology", shift: "Morning", status: "break" },
  ]);
  const isLoading = false;

  const addStaff = () => {
    if (!formData.name || !formData.role || !formData.department || !formData.shift) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }
    const newStaff = {
      id: staff.length + 1,
      ...formData
    };
    setStaff([...staff, newStaff]);
    toast({ title: "Staff member added successfully" });
    setIsDialogOpen(false);
    setFormData({ name: "", role: "", department: "", shift: "", status: "available" });
  };

  const updateStaff = (id: number, newStatus: string) => {
    setStaff(staff.map(member => 
      member.id === id ? { ...member, status: newStatus } : member
    ));
  };

  const handleOptimize = () => {
    setOptimizing(true);
    // Simulate optimization by updating staff status
    staff.forEach((member: any) => {
      const newStatus = member.status === 'available' ? 'on-duty' : 'available';
      updateStaff(member.id, newStatus);
    });
    setTimeout(() => {
      setOptimizing(false);
      toast({ title: "Schedule optimized" });
    }, 1500);
  };

  const handleSubmit = () => {
    addStaff();
  };

  const getStaffByShift = (shift: string) => {
    return staff.filter((member: any) => member.shift.toLowerCase() === shift.toLowerCase());
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-duty': return 'bg-green-100 text-green-800';
      case 'break': return 'bg-yellow-100 text-yellow-800';
      case 'available': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Staff Scheduler</h1>
          <p className="text-muted-foreground">Optimize staff shifts and coverage</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Staff
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Staff Member</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name *</Label>
                  <Input 
                    id="name" 
                    placeholder="Enter full name" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role *</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Doctor">Doctor</SelectItem>
                      <SelectItem value="Nurse">Nurse</SelectItem>
                      <SelectItem value="Technician">Technician</SelectItem>
                      <SelectItem value="Administrator">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({...formData, department: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="ICU">ICU</SelectItem>
                      <SelectItem value="Surgery">Surgery</SelectItem>
                      <SelectItem value="General Ward">General Ward</SelectItem>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="shift">Shift *</Label>
                  <Select value={formData.shift} onValueChange={(value) => setFormData({...formData, shift: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select shift" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Morning">Morning (6AM - 2PM)</SelectItem>
                      <SelectItem value="Evening">Evening (2PM - 10PM)</SelectItem>
                      <SelectItem value="Night">Night (10PM - 6AM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleSubmit}
                  disabled={false}
                >
                  "Add Staff Member"
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button 
            onClick={handleOptimize}
            disabled={optimizing}
            data-testid="button-optimize-schedule"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${optimizing ? 'animate-spin' : ''}`} />
            {optimizing ? 'Optimizing...' : 'Optimize Schedule'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Weekly Schedule
          </CardTitle>
          <p className="text-sm text-muted-foreground">Current staff assignments</p>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading staff...</div>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-3">Morning Shift (6AM - 2PM)</div>
                <div className="space-y-2">
                  {getStaffByShift('Morning').map((member: any) => (
                    <div key={member.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.role} - {member.department}</div>
                      </div>
                      <Badge className={getStatusColor(member.status)}>
                        {member.status}
                      </Badge>
                    </div>
                  ))}
                  {getStaffByShift('Morning').length === 0 && (
                    <div className="text-sm text-muted-foreground">No staff assigned</div>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-3">Evening Shift (2PM - 10PM)</div>
                <div className="space-y-2">
                  {getStaffByShift('Evening').map((member: any) => (
                    <div key={member.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.role} - {member.department}</div>
                      </div>
                      <Badge className={getStatusColor(member.status)}>
                        {member.status}
                      </Badge>
                    </div>
                  ))}
                  {getStaffByShift('Evening').length === 0 && (
                    <div className="text-sm text-muted-foreground">No staff assigned</div>
                  )}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-muted-foreground mb-3">Night Shift (10PM - 6AM)</div>
                <div className="space-y-2">
                  {getStaffByShift('Night').map((member: any) => (
                    <div key={member.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.role} - {member.department}</div>
                      </div>
                      <Badge className={getStatusColor(member.status)}>
                        {member.status}
                      </Badge>
                    </div>
                  ))}
                  {getStaffByShift('Night').length === 0 && (
                    <div className="text-sm text-muted-foreground">No staff assigned</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Optimization Insights</CardTitle>
          <p className="text-sm text-muted-foreground">Algorithm recommendations</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-4 rounded-md bg-resource-available/5 border border-resource-available/20">
            <div className="flex-1">
              <h4 className="font-semibold">Staff Coverage</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Total staff: {staff.length} | On duty: {staff.filter((s: any) => s.status === 'on-duty').length} | Available: {staff.filter((s: any) => s.status === 'available').length}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-md bg-primary/5 border border-primary/20">
            <div className="flex-1">
              <h4 className="font-semibold">Shift Distribution</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Morning: {getStaffByShift('Morning').length} | Evening: {getStaffByShift('Evening').length} | Night: {getStaffByShift('Night').length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

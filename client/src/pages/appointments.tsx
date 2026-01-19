import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Plus, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Appointments() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    patient_id: "",
    doctor_name: "",
    appointment_date: "",
    appointment_time: "",
    notes: ""
  });
  const { toast } = useToast();

  const [appointments, setAppointments] = useState([
    { id: 1, first_name: "John", last_name: "Smith", doctor_name: "Dr. Johnson", appointment_date: "2024-01-15", appointment_time: "10:00", status: "scheduled" },
    { id: 2, first_name: "Sarah", last_name: "Davis", doctor_name: "Dr. Brown", appointment_date: "2024-01-16", appointment_time: "14:30", status: "scheduled" },
  ]);

  const { data: patients = [], isLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const response = await fetch("/api/patients");
      if (!response.ok) throw new Error("Failed to fetch patients");
      return response.json();
    }
  });

  const createAppointment = () => {
    console.log("Form data:", formData);
    const patient = patients.find((p: any) => p.id.toString() === formData.patient_id);
    console.log("Found patient:", patient);
    
    const newAppointment = {
      id: Date.now(), // Use timestamp as unique ID
      first_name: patient?.first_name || "Unknown",
      last_name: patient?.last_name || "Patient",
      doctor_name: formData.doctor_name,
      appointment_date: formData.appointment_date,
      appointment_time: formData.appointment_time,
      status: "scheduled"
    };
    
    console.log("New appointment:", newAppointment);
    setAppointments(prev => [...prev, newAppointment]);
    toast({ title: "Appointment scheduled successfully" });
    setIsDialogOpen(false);
    setFormData({ patient_id: "", doctor_name: "", appointment_date: "", appointment_time: "", notes: "" });
  };

  const updateAppointment = (id: number, newStatus: string) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: newStatus } : apt
    ));
    toast({ title: "Appointment updated" });
  };

  const handleSubmit = () => {
    console.log("Submitting form with data:", formData);
    
    if (!formData.patient_id) {
      toast({ title: "Please select a patient", variant: "destructive" });
      return;
    }
    if (!formData.doctor_name) {
      toast({ title: "Please enter doctor name", variant: "destructive" });
      return;
    }
    if (!formData.appointment_date) {
      toast({ title: "Please select appointment date", variant: "destructive" });
      return;
    }
    if (!formData.appointment_time) {
      toast({ title: "Please select appointment time", variant: "destructive" });
      return;
    }
    
    createAppointment();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Appointments</h1>
          <p className="text-muted-foreground">Schedule and manage patient appointments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Appointment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="patient">Patient *</Label>
                <Select value={formData.patient_id} onValueChange={(value) => setFormData({...formData, patient_id: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient: any) => (
                      <SelectItem key={patient.id} value={patient.id.toString()}>
                        {patient.first_name} {patient.last_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor *</Label>
                <Input 
                  id="doctor" 
                  placeholder="Enter doctor name" 
                  value={formData.doctor_name}
                  onChange={(e) => setFormData({...formData, doctor_name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={formData.appointment_date}
                  onChange={(e) => setFormData({...formData, appointment_date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time *</Label>
                <Input 
                  id="time" 
                  type="time" 
                  value={formData.appointment_time}
                  onChange={(e) => setFormData({...formData, appointment_time: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Input 
                  id="notes" 
                  placeholder="Additional notes" 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleSubmit}
                disabled={false}
              >
                "Schedule Appointment"
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Scheduled Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading appointments...</div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No appointments scheduled</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment: any) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {appointment.first_name} {appointment.last_name}
                      </div>
                    </TableCell>
                    <TableCell>{appointment.doctor_name}</TableCell>
                    <TableCell>{appointment.appointment_date}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {appointment.appointment_time}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateAppointment(appointment.id, 'completed')}
                          disabled={appointment.status === 'completed'}
                        >
                          Complete
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateAppointment(appointment.id, 'cancelled')}
                          disabled={appointment.status === 'cancelled'}
                        >
                          Cancel
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
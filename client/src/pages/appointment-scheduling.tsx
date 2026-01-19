import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, ArrowLeft, Plus, Clock, User, Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AppointmentSchedulingProps {
  onBack: () => void;
}

export default function AppointmentScheduling({ onBack }: AppointmentSchedulingProps) {
  const [appointments, setAppointments] = useState([
    { id: 1, patientName: "John Smith", doctor: "Dr. Sarah Johnson", date: "2024-12-15", time: "09:00", type: "Consultation", status: "confirmed" },
    { id: 2, patientName: "Mary Davis", doctor: "Dr. Mike Brown", date: "2024-12-15", time: "10:30", type: "Follow-up", status: "pending" },
    { id: 3, patientName: "Robert Wilson", doctor: "Dr. Emily Clark", date: "2024-12-16", time: "14:00", type: "Surgery", status: "confirmed" },
    { id: 4, patientName: "Lisa Anderson", doctor: "Dr. John Miller", date: "2024-12-16", time: "11:15", type: "Check-up", status: "cancelled" }
  ]);

  const [newAppointment, setNewAppointment] = useState({
    patientName: "", doctor: "", date: "", time: "", type: "Consultation", notes: ""
  });

  const [showAddForm, setShowAddForm] = useState(false);

  const doctors = [
    "Dr. Sarah Johnson", "Dr. Mike Brown", "Dr. Emily Clark", "Dr. John Miller", 
    "Dr. Robert Smith", "Dr. Lisa Wilson", "Dr. David Anderson"
  ];

  const appointmentTypes = ["Consultation", "Follow-up", "Surgery", "Check-up", "Emergency", "Vaccination"];

  const addAppointment = () => {
    if (newAppointment.patientName && newAppointment.doctor && newAppointment.date && newAppointment.time) {
      const appointment = {
        id: appointments.length + 1,
        patientName: newAppointment.patientName,
        doctor: newAppointment.doctor,
        date: newAppointment.date,
        time: newAppointment.time,
        type: newAppointment.type,
        status: "confirmed"
      };
      setAppointments([...appointments, appointment]);
      setNewAppointment({ patientName: "", doctor: "", date: "", time: "", type: "Consultation", notes: "" });
      setShowAddForm(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateAppointmentStatus = (id: number, status: string) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status } : apt
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="h-8 w-8 text-purple-500" />
                Appointment Scheduling
              </h1>
              <p className="text-gray-600">Schedule and manage patient appointments</p>
            </div>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-purple-500 hover:bg-purple-600">
            <Plus className="h-4 w-4 mr-2" />
            Schedule Appointment
          </Button>
        </div>

        {/* Add Appointment Form */}
        {showAddForm && (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Schedule New Appointment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="patientName">Patient Name</Label>
                  <Input
                    id="patientName"
                    value={newAppointment.patientName}
                    onChange={(e) => setNewAppointment({...newAppointment, patientName: e.target.value})}
                    placeholder="Enter patient name"
                  />
                </div>
                <div>
                  <Label htmlFor="doctor">Doctor</Label>
                  <Select value={newAppointment.doctor} onValueChange={(value) => setNewAppointment({...newAppointment, doctor: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor} value={doctor}>{doctor}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) => setNewAppointment({...newAppointment, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newAppointment.time}
                    onChange={(e) => setNewAppointment({...newAppointment, time: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Appointment Type</Label>
                  <Select value={newAppointment.type} onValueChange={(value) => setNewAppointment({...newAppointment, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {appointmentTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={newAppointment.notes}
                    onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                    placeholder="Additional notes"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={addAppointment} className="bg-purple-500 hover:bg-purple-600">
                  Schedule Appointment
                </Button>
                <Button onClick={() => setShowAddForm(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Appointments List */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Scheduled Appointments ({appointments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {appointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-100 p-3 rounded-full">
                      <Calendar className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{appointment.patientName}</h4>
                      <p className="text-sm text-gray-600">
                        <Stethoscope className="h-4 w-4 inline mr-1" />
                        {appointment.doctor}
                      </p>
                      <p className="text-sm text-gray-600">
                        <Clock className="h-4 w-4 inline mr-1" />
                        {appointment.date} at {appointment.time}
                      </p>
                      <p className="text-sm text-gray-600">Type: {appointment.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                    <Select value={appointment.status} onValueChange={(value) => updateAppointmentStatus(appointment.id, value)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Appointment Statistics */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-green-600">{appointments.filter(a => a.status === 'confirmed').length}</h3>
                <p className="text-sm text-gray-600">Confirmed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-yellow-600">{appointments.filter(a => a.status === 'pending').length}</h3>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-blue-600">{appointments.filter(a => a.status === 'completed').length}</h3>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-purple-600">{appointments.length}</h3>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
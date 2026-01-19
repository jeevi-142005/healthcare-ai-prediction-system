import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, FileText, Pill, Phone, Heart, Clock, User, Settings, Bell, Sun, Moon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PatientDashboard() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    const initialDarkMode = savedDarkMode ? JSON.parse(savedDarkMode) : false;
    setDarkMode(initialDarkMode);
    if (initialDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const patientData = {
    name: "John Smith",
    id: "P001234",
    nextAppointment: "Dec 15, 2024 at 2:30 PM",
    doctor: "Dr. Sarah Johnson",
    department: "Cardiology"
  };

  const appointments = [
    { id: 1, date: "Dec 15, 2024", time: "2:30 PM", doctor: "Dr. Sarah Johnson", type: "Cardiology Checkup", status: "confirmed" },
    { id: 2, date: "Dec 22, 2024", time: "10:00 AM", doctor: "Dr. Mike Davis", type: "Blood Test", status: "pending" },
    { id: 3, date: "Jan 5, 2025", time: "3:00 PM", doctor: "Dr. Sarah Johnson", type: "Follow-up", status: "scheduled" }
  ];

  const prescriptions = [
    { id: 1, medicine: "Lisinopril 10mg", dosage: "Once daily", refills: 2, expires: "Mar 15, 2025" },
    { id: 2, medicine: "Metformin 500mg", dosage: "Twice daily", refills: 1, expires: "Feb 20, 2025" },
    { id: 3, medicine: "Aspirin 81mg", dosage: "Once daily", refills: 3, expires: "Apr 10, 2025" }
  ];

  const vitals = [
    { label: "Blood Pressure", value: "120/80", status: "normal", date: "Dec 10, 2024" },
    { label: "Heart Rate", value: "72 bpm", status: "normal", date: "Dec 10, 2024" },
    { label: "Weight", value: "75 kg", status: "normal", date: "Dec 10, 2024" },
    { label: "Temperature", value: "98.6°F", status: "normal", date: "Dec 10, 2024" }
  ];

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'dark bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-green-50'}`}>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Heart className="h-8 w-8 text-red-500" />
              Patient Portal
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Welcome back, {patientData.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm" onClick={toggleDarkMode}>
              {darkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
              {darkMode ? 'Light' : 'Dark'}
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Patient Info Card */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-green-500 p-3 rounded-full">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{patientData.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300">Patient ID: {patientData.id}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-300">Next Appointment</p>
                <p className="font-semibold">{patientData.nextAppointment}</p>
                <p className="text-sm text-blue-600">{patientData.doctor} - {patientData.department}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl hover:scale-105 transition-transform cursor-pointer">
            <CardContent className="p-4 text-center">
              <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold">Book Appointment</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">Schedule with doctor</p>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl hover:scale-105 transition-transform cursor-pointer">
            <CardContent className="p-4 text-center">
              <FileText className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold">Medical Records</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">View health history</p>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl hover:scale-105 transition-transform cursor-pointer">
            <CardContent className="p-4 text-center">
              <Pill className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold">Prescriptions</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">Manage medications</p>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl hover:scale-105 transition-transform cursor-pointer">
            <CardContent className="p-4 text-center">
              <Phone className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <h3 className="font-semibold">Contact Doctor</h3>
              <p className="text-xs text-gray-600 dark:text-gray-300">Send message</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Appointments */}
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {appointments.map(appointment => (
                <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium">{appointment.type}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{appointment.doctor}</p>
                    <p className="text-xs text-gray-500">{appointment.date} at {appointment.time}</p>
                  </div>
                  <Badge className={
                    appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }>
                    {appointment.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Prescriptions */}
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5 text-purple-500" />
                Current Prescriptions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {prescriptions.map(prescription => (
                <div key={prescription.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium">{prescription.medicine}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{prescription.dosage}</p>
                    <p className="text-xs text-gray-500">Expires: {prescription.expires}</p>
                  </div>
                  <Badge variant="outline">
                    {prescription.refills} refills
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Vitals */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Latest Vitals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {vitals.map((vital, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-sm">{vital.label}</h4>
                  <p className="text-2xl font-bold text-blue-600 my-2">{vital.value}</p>
                  <div className="flex items-center justify-center gap-2">
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      {vital.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{vital.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
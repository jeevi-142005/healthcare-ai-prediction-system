import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, ArrowLeft, Plus, User, Calendar, Phone, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PatientManagementProps {
  onBack: () => void;
}

export default function PatientManagement({ onBack }: PatientManagementProps) {
  const [patients, setPatients] = useState([
    { id: 1, name: "John Smith", age: 45, condition: "Hypertension", status: "stable", room: "A101", doctor: "Dr. Johnson" },
    { id: 2, name: "Mary Davis", age: 32, condition: "Diabetes", status: "critical", room: "ICU-2", doctor: "Dr. Brown" },
    { id: 3, name: "Robert Wilson", age: 67, condition: "Heart Disease", status: "stable", room: "B205", doctor: "Dr. Smith" },
    { id: 4, name: "Lisa Anderson", age: 28, condition: "Pregnancy", status: "normal", room: "C301", doctor: "Dr. Wilson" }
  ]);

  const [newPatient, setNewPatient] = useState({
    name: "", age: "", condition: "", status: "stable", room: "", doctor: "", phone: "", address: ""
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const addPatient = () => {
    if (newPatient.name && newPatient.age && newPatient.condition) {
      const patient = {
        id: patients.length + 1,
        name: newPatient.name,
        age: parseInt(newPatient.age),
        condition: newPatient.condition,
        status: newPatient.status,
        room: newPatient.room || `R${Math.floor(Math.random() * 999) + 100}`,
        doctor: newPatient.doctor || "Dr. Available"
      };
      setPatients([...patients, patient]);
      setNewPatient({ name: "", age: "", condition: "", status: "stable", room: "", doctor: "", phone: "", address: "" });
      setShowAddForm(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'stable': return 'bg-green-100 text-green-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Heart className="h-8 w-8 text-red-500" />
                Patient Management
              </h1>
              <p className="text-gray-600">Add, manage and track patient information</p>
            </div>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-green-500 hover:bg-green-600">
            <Plus className="h-4 w-4 mr-2" />
            Add New Patient
          </Button>
        </div>

        {/* Add Patient Form */}
        {showAddForm && (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Add New Patient</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Patient Name</Label>
                  <Input
                    id="name"
                    value={newPatient.name}
                    onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                    placeholder="Enter patient name"
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={newPatient.age}
                    onChange={(e) => setNewPatient({...newPatient, age: e.target.value})}
                    placeholder="Enter age"
                  />
                </div>
                <div>
                  <Label htmlFor="condition">Medical Condition</Label>
                  <Input
                    id="condition"
                    value={newPatient.condition}
                    onChange={(e) => setNewPatient({...newPatient, condition: e.target.value})}
                    placeholder="Enter medical condition"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={newPatient.status} onValueChange={(value) => setNewPatient({...newPatient, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="stable">Stable</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="room">Room Number</Label>
                  <Input
                    id="room"
                    value={newPatient.room}
                    onChange={(e) => setNewPatient({...newPatient, room: e.target.value})}
                    placeholder="Auto-assigned if empty"
                  />
                </div>
                <div>
                  <Label htmlFor="doctor">Assigned Doctor</Label>
                  <Input
                    id="doctor"
                    value={newPatient.doctor}
                    onChange={(e) => setNewPatient({...newPatient, doctor: e.target.value})}
                    placeholder="Enter doctor name"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={addPatient} className="bg-green-500 hover:bg-green-600">
                  Add Patient
                </Button>
                <Button onClick={() => setShowAddForm(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Patient List */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Current Patients ({patients.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {patients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{patient.name}</h4>
                      <p className="text-sm text-gray-600">Age: {patient.age} • Room: {patient.room}</p>
                      <p className="text-sm text-gray-600">Condition: {patient.condition}</p>
                      <p className="text-sm text-gray-600">Doctor: {patient.doctor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(patient.status)}>
                      {patient.status}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedPatient(patient);
                        setShowDetails(true);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Patient Statistics */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-green-600">{patients.filter(p => p.status === 'stable').length}</h3>
                <p className="text-sm text-gray-600">Stable Patients</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-red-600">{patients.filter(p => p.status === 'critical').length}</h3>
                <p className="text-sm text-gray-600">Critical Patients</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-blue-600">{patients.filter(p => p.status === 'normal').length}</h3>
                <p className="text-sm text-gray-600">Normal Patients</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-purple-600">{patients.length}</h3>
                <p className="text-sm text-gray-600">Total Patients</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient Details Modal */}
        {showDetails && selectedPatient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl mx-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Patient Details - {selectedPatient.name}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowDetails(false)}
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Patient Name</Label>
                    <p className="font-medium">{selectedPatient.name}</p>
                  </div>
                  <div>
                    <Label>Age</Label>
                    <p className="font-medium">{selectedPatient.age} years</p>
                  </div>
                  <div>
                    <Label>Medical Condition</Label>
                    <p className="font-medium">{selectedPatient.condition}</p>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Badge className={getStatusColor(selectedPatient.status)}>
                      {selectedPatient.status}
                    </Badge>
                  </div>
                  <div>
                    <Label>Room Number</Label>
                    <p className="font-medium">{selectedPatient.room}</p>
                  </div>
                  <div>
                    <Label>Assigned Doctor</Label>
                    <p className="font-medium">{selectedPatient.doctor}</p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p className="font-medium">+1 (555) 0{selectedPatient.id}23</p>
                  </div>
                  <div>
                    <Label>Address</Label>
                    <p className="font-medium">123 Main St, City, State</p>
                  </div>
                </div>
                <div className="mt-6">
                  <Label>Medical History</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Previous conditions: None reported. Regular checkups recommended.
                    Last visit: {new Date().toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2 mt-6">
                  <Button onClick={() => setShowDetails(false)}>
                    Close
                  </Button>
                  <Button variant="outline">
                    Edit Patient
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
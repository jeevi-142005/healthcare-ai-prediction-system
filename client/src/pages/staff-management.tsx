import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Stethoscope, ArrowLeft, Plus, User, Calendar, Clock, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StaffManagementProps {
  onBack: () => void;
}

export default function StaffManagement({ onBack }: StaffManagementProps) {
  const [staff, setStaff] = useState([
    { id: 1, name: "Dr. Sarah Johnson", role: "Doctor", department: "Cardiology", shift: "Morning", status: "on-duty", phone: "555-0101" },
    { id: 2, name: "Nurse Mike Davis", role: "Nurse", department: "Emergency", shift: "Night", status: "on-duty", phone: "555-0102" },
    { id: 3, name: "Dr. Emily Brown", role: "Doctor", department: "Surgery", shift: "Evening", status: "available", phone: "555-0103" },
    { id: 4, name: "Nurse John Smith", role: "Nurse", department: "ICU", shift: "Morning", status: "on-duty", phone: "555-0104" },
    { id: 5, name: "Dr. Robert Wilson", role: "Doctor", department: "Pediatrics", shift: "Morning", status: "break", phone: "555-0105" }
  ]);

  const [schedules, setSchedules] = useState([
    { id: 1, staffId: 1, date: "2024-12-15", shift: "Morning", department: "Cardiology" },
    { id: 2, staffId: 2, date: "2024-12-15", shift: "Night", department: "Emergency" },
    { id: 3, staffId: 3, date: "2024-12-16", shift: "Evening", department: "Surgery" },
    { id: 4, staffId: 4, date: "2024-12-16", shift: "Morning", department: "ICU" }
  ]);

  const [newStaff, setNewStaff] = useState({
    name: "", role: "Nurse", department: "General", shift: "Morning", phone: ""
  });

  const [newSchedule, setNewSchedule] = useState({
    staffId: "", date: "", shift: "Morning", department: "General"
  });

  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const addStaff = () => {
    if (newStaff.name && newStaff.phone) {
      const staffMember = {
        id: staff.length + 1,
        name: newStaff.name,
        role: newStaff.role,
        department: newStaff.department,
        shift: newStaff.shift,
        status: "available",
        phone: newStaff.phone
      };
      setStaff([...staff, staffMember]);
      setNewStaff({ name: "", role: "Nurse", department: "General", shift: "Morning", phone: "" });
      setShowAddStaff(false);
    }
  };

  const addSchedule = () => {
    if (newSchedule.staffId && newSchedule.date) {
      const schedule = {
        id: schedules.length + 1,
        staffId: parseInt(newSchedule.staffId),
        date: newSchedule.date,
        shift: newSchedule.shift,
        department: newSchedule.department
      };
      setSchedules([...schedules, schedule]);
      setNewSchedule({ staffId: "", date: "", shift: "Morning", department: "General" });
      setShowAddSchedule(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-duty': return 'bg-green-100 text-green-800';
      case 'available': return 'bg-blue-100 text-blue-800';
      case 'break': return 'bg-yellow-100 text-yellow-800';
      case 'off-duty': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleIcon = (role: string) => {
    return role === 'Doctor' ? Stethoscope : UserCheck;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={onBack} variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <Stethoscope className="h-8 w-8 text-green-500" />
                Staff Management
              </h1>
              <p className="text-gray-600">Manage staff and scheduling</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setShowAddStaff(!showAddStaff)} className="bg-green-500 hover:bg-green-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Staff
            </Button>
            <Button onClick={() => setShowAddSchedule(!showAddSchedule)} className="bg-blue-500 hover:bg-blue-600">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </div>
        </div>

        {/* Add Staff Form */}
        {showAddStaff && (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Add New Staff Member</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="staffName">Staff Name</Label>
                  <Input
                    id="staffName"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                    placeholder="Enter staff name"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select value={newStaff.role} onValueChange={(value) => setNewStaff({...newStaff, role: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Doctor">Doctor</SelectItem>
                      <SelectItem value="Nurse">Nurse</SelectItem>
                      <SelectItem value="Technician">Technician</SelectItem>
                      <SelectItem value="Administrator">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select value={newStaff.department} onValueChange={(value) => setNewStaff({...newStaff, department: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="ICU">ICU</SelectItem>
                      <SelectItem value="Surgery">Surgery</SelectItem>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                    placeholder="Enter phone number"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={addStaff} className="bg-green-500 hover:bg-green-600">
                  Add Staff
                </Button>
                <Button onClick={() => setShowAddStaff(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Add Schedule Form */}
        {showAddSchedule && (
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle>Add Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="staffSelect">Select Staff</Label>
                  <Select value={newSchedule.staffId} onValueChange={(value) => setNewSchedule({...newSchedule, staffId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select staff member" />
                    </SelectTrigger>
                    <SelectContent>
                      {staff.map((member) => (
                        <SelectItem key={member.id} value={member.id.toString()}>
                          {member.name} - {member.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="scheduleDate">Date</Label>
                  <Input
                    id="scheduleDate"
                    type="date"
                    value={newSchedule.date}
                    onChange={(e) => setNewSchedule({...newSchedule, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="scheduleShift">Shift</Label>
                  <Select value={newSchedule.shift} onValueChange={(value) => setNewSchedule({...newSchedule, shift: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Morning">Morning (6AM - 2PM)</SelectItem>
                      <SelectItem value="Evening">Evening (2PM - 10PM)</SelectItem>
                      <SelectItem value="Night">Night (10PM - 6AM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="scheduleDept">Department</Label>
                  <Select value={newSchedule.department} onValueChange={(value) => setNewSchedule({...newSchedule, department: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="ICU">ICU</SelectItem>
                      <SelectItem value="Surgery">Surgery</SelectItem>
                      <SelectItem value="Cardiology">Cardiology</SelectItem>
                      <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={addSchedule} className="bg-blue-500 hover:bg-blue-600">
                  Add Schedule
                </Button>
                <Button onClick={() => setShowAddSchedule(false)} variant="outline">
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Staff List */}
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Staff Members ({staff.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {staff.map((member) => {
                const IconComponent = getRoleIcon(member.role);
                return (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="bg-green-100 p-3 rounded-full">
                        <IconComponent className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{member.name}</h4>
                        <p className="text-sm text-gray-600">{member.role} • {member.department}</p>
                        <p className="text-sm text-gray-600">Phone: {member.phone}</p>
                        <p className="text-sm text-gray-600">Shift: {member.shift}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(member.status)}>
                        {member.status}
                      </Badge>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setEditingStaff(member);
                          setShowEditForm(true);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Staff Statistics */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-green-600">{staff.filter(s => s.status === 'on-duty').length}</h3>
                <p className="text-sm text-gray-600">On Duty</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-blue-600">{staff.filter(s => s.status === 'available').length}</h3>
                <p className="text-sm text-gray-600">Available</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-yellow-600">{staff.filter(s => s.status === 'break').length}</h3>
                <p className="text-sm text-gray-600">On Break</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-purple-600">{staff.length}</h3>
                <p className="text-sm text-gray-600">Total Staff</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Edit Staff Modal */}
        {showEditForm && editingStaff && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl mx-4">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Edit Staff - {editingStaff.name}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowEditForm(false)}
                  >
                    ×
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label>Staff Name</Label>
                    <Input 
                      value={editingStaff.name}
                      onChange={(e) => setEditingStaff({...editingStaff, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Select 
                      value={editingStaff.role} 
                      onValueChange={(value) => setEditingStaff({...editingStaff, role: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Doctor">Doctor</SelectItem>
                        <SelectItem value="Nurse">Nurse</SelectItem>
                        <SelectItem value="Technician">Technician</SelectItem>
                        <SelectItem value="Administrator">Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Select 
                      value={editingStaff.department} 
                      onValueChange={(value) => setEditingStaff({...editingStaff, department: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Emergency">Emergency</SelectItem>
                        <SelectItem value="ICU">ICU</SelectItem>
                        <SelectItem value="Surgery">Surgery</SelectItem>
                        <SelectItem value="Cardiology">Cardiology</SelectItem>
                        <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select 
                      value={editingStaff.status} 
                      onValueChange={(value) => setEditingStaff({...editingStaff, status: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="on-duty">On Duty</SelectItem>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="break">On Break</SelectItem>
                        <SelectItem value="off-duty">Off Duty</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input 
                      value={editingStaff.phone}
                      onChange={(e) => setEditingStaff({...editingStaff, phone: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Shift</Label>
                    <Select 
                      value={editingStaff.shift} 
                      onValueChange={(value) => setEditingStaff({...editingStaff, shift: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Morning">Morning</SelectItem>
                        <SelectItem value="Evening">Evening</SelectItem>
                        <SelectItem value="Night">Night</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex gap-2 mt-6">
                  <Button 
                    onClick={() => {
                      setStaff(staff.map(s => s.id === editingStaff.id ? editingStaff : s));
                      setShowEditForm(false);
                    }}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    Save Changes
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowEditForm(false)}
                  >
                    Cancel
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
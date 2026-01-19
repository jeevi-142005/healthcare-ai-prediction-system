import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MetricCard } from "@/components/metric-card";
import { PatientQueueItem } from "@/components/patient-queue-item";
import { ResourceNode } from "@/components/resource-node";
import { ForecastChart } from "@/components/forecast-chart";
import { Users, Bed, UserCheck, AlertCircle, Brain, TrendingUp, Activity, Shield, Clock, Zap, Settings, Bell, Sparkles, Heart, Stethoscope, MapPin, Sun, Moon, Building2, ArrowRight, Menu, X, BarChart3, Calendar, FileText, Phone, ArrowLeft, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ResourceAllocation from "./resource-allocation";
import EmergencyManagement from "./emergency-management";
import PatientManagement from "./patient-management";
import StaffManagement from "./staff-management";
import AppointmentScheduling from "./appointment-scheduling";
import ForecastingAnalytics from "./forecasting-analytics";


interface DashboardProps {
  onLogout?: () => void;
}

export default function Dashboard({ onLogout }: DashboardProps = {}) {
  const [darkMode, setDarkMode] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      window.location.reload();
    }
  };

  useEffect(() => {
    // Initialize dark mode from localStorage or system preference
    const savedDarkMode = localStorage.getItem('darkMode');
    const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDarkMode = savedDarkMode ? JSON.parse(savedDarkMode) : systemDarkMode;
    
    setDarkMode(initialDarkMode);
    if (initialDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    // Save dark mode preference and apply to document
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState(3);
  const [showAlerts, setShowAlerts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(30);
  const [alerts, setAlerts] = useState([
    { id: '1', type: 'critical', message: 'ICU capacity at 95% - immediate action required', time: '2 min ago' },
    { id: '2', type: 'warning', message: 'Emergency department experiencing high volume', time: '15 min ago' },
    { id: '3', type: 'info', message: 'Scheduled maintenance for MRI-2 at 3 PM', time: '1 hour ago' }
  ]);
  
  const [generatedReports, setGeneratedReports] = useState([
    { id: '1', name: `Daily Report - ${new Date().toLocaleDateString()}`, type: 'Daily', status: 'Completed', time: '2 hours ago', data: 'Daily report data...' },
    { id: '2', name: `Weekly Report - Week ${Math.ceil(new Date().getDate()/7)}`, type: 'Weekly', status: 'Completed', time: '1 day ago', data: 'Weekly report data...' },
    { id: '3', name: `Patient Analytics - Q${Math.ceil((new Date().getMonth()+1)/3)} ${new Date().getFullYear()}`, type: 'Analytics', status: 'In Progress', time: '3 hours ago', data: 'Analytics data...' },
    { id: '4', name: `Staff Performance - ${new Date().toLocaleDateString('en-US', {month: 'long'})}`, type: 'Staff', status: 'Completed', time: '5 hours ago', data: 'Staff performance data...' }
  ]);

  const addAlert = (type: 'critical' | 'warning' | 'info', message: string) => {
    const newAlert = {
      id: Date.now().toString(),
      type,
      message,
      time: 'Just now'
    };
    setAlerts(prev => [newAlert, ...prev]);
    setNotifications(prev => prev + 1);
  };
  
  const generateReport = (reportType: string, reportName: string, message: string) => {
    let detailedData = '';
    
    switch(reportType) {
      case 'Daily':
        detailedData = `DAILY HOSPITAL REPORT\n${new Date().toLocaleDateString()}\n\n=== PATIENT STATISTICS ===\nTotal Patients: ${patients.length}\nCritical: ${patients.filter(p => p.status === 'critical').length}\nStable: ${patients.filter(p => p.status === 'stable').length}\nNormal: ${patients.filter(p => p.status === 'normal').length}\n\nAdmissions Today: ${Math.floor(patients.length * 0.3)}\nDischarges Today: ${Math.floor(patients.length * 0.2)}\n\n=== RESOURCE STATUS ===\nBeds Available: ${resources.find(r => r.type === 'beds')?.available_count || 85}/${resources.find(r => r.type === 'beds')?.total_count || 120}\nICU Units: ${resources.find(r => r.type === 'icu')?.available_count || 18}/${resources.find(r => r.type === 'icu')?.total_count || 20}\n\n=== STAFF STATUS ===\nOn Duty: ${staff.filter(s => s.status === 'on-duty').length}/${staff.length}\nAvailable: ${staff.filter(s => s.status === 'available').length}\nOn Break: ${staff.filter(s => s.status === 'break').length}`;
        break;
      case 'Weekly':
        detailedData = `WEEKLY HOSPITAL REPORT\nWeek ${Math.ceil(new Date().getDate()/7)} - ${new Date().getFullYear()}\n\n=== WEEKLY SUMMARY ===\nTotal Patients Treated: ${patients.length * 7}\nAverage Daily Admissions: ${patients.length}\nBed Occupancy Rate: ${Math.round(((120-85)/120)*100)}%\n\n=== DEPARTMENT PERFORMANCE ===\nEmergency: 85% efficiency\nICU: 92% efficiency\nSurgery: 78% efficiency\nCardiology: 88% efficiency\n\n=== TRENDS ===\nPatient Load: +12% vs last week\nAverage Stay: 3.2 days\nDischarge Rate: 89%`;
        break;
      case 'Monthly':
        detailedData = `MONTHLY HOSPITAL REPORT\n${new Date().toLocaleDateString('en-US', {month: 'long', year: 'numeric'})}\n\n=== FINANCIAL SUMMARY ===\nTotal Revenue: $${(patients.length * 1500).toLocaleString()}\nOperating Costs: $${(patients.length * 1000).toLocaleString()}\nNet Profit: $${(patients.length * 500).toLocaleString()}\n\n=== PATIENT METRICS ===\nTotal Patients: ${patients.length * 30}\nPatient Satisfaction: 92%\nReadmission Rate: 8%\n\n=== QUALITY INDICATORS ===\nMortality Rate: 2.1%\nInfection Rate: 1.8%\nAverage Length of Stay: 3.4 days`;
        break;
      case 'Analytics':
        detailedData = `PATIENT ANALYTICS REPORT\n${new Date().toLocaleDateString()}\n\n=== CURRENT PATIENT STATUS ===\nActive Patients: ${patients.length}\nCritical Cases: ${patients.filter(p => p.status === 'critical').length}\nStable Cases: ${patients.filter(p => p.status === 'stable').length}\nNormal Cases: ${patients.filter(p => p.status === 'normal').length}\n\n=== RISK ANALYSIS ===\nHigh Risk Patients: ${patients.filter(p => p.status === 'critical').length}\nAI Risk Score: ${Math.floor(Math.random()*30+70)}/100\nPredicted Complications: ${Math.floor(Math.random()*5+1)}\n\n=== DEMOGRAPHICS ===\nAge Distribution:\n- 0-18: 15%\n- 19-65: 60%\n- 65+: 25%\n\nGender Distribution:\n- Male: 52%\n- Female: 48%`;
        break;
      case 'Staff':
        detailedData = `STAFF PERFORMANCE REPORT\n${new Date().toLocaleDateString('en-US', {month: 'long'})}\n\n=== STAFF OVERVIEW ===\nTotal Staff: ${staff.length}\nOn Duty: ${staff.filter(s => s.status === 'on-duty').length}\nAvailable: ${staff.filter(s => s.status === 'available').length}\nOn Break: ${staff.filter(s => s.status === 'break').length}\n\n=== DEPARTMENT STAFFING ===\nCardiology: ${staff.filter(s => s.department === 'Cardiology').length} staff\nEmergency: ${staff.filter(s => s.department === 'Emergency').length} staff\nSurgery: ${staff.filter(s => s.department === 'Surgery').length} staff\nICU: ${staff.filter(s => s.department === 'ICU').length} staff\nPediatrics: ${staff.filter(s => s.department === 'Pediatrics').length} staff\n\n=== PERFORMANCE METRICS ===\nUtilization Rate: ${Math.round((staff.filter(s => s.status === 'on-duty').length/staff.length)*100)}%\nEfficiency Score: ${Math.floor(Math.random()*20+80)}%\nPatient Satisfaction with Staff: 94%`;
        break;
      case 'Financial':
        detailedData = `FINANCIAL REPORT\n${new Date().toLocaleDateString('en-US', {month: 'long', year: 'numeric'})}\n\n=== REVENUE BREAKDOWN ===\nPatient Services: $${(patients.length * 1200).toLocaleString()}\nSurgical Procedures: $${(patients.length * 200).toLocaleString()}\nDiagnostic Services: $${(patients.length * 100).toLocaleString()}\nTotal Revenue: $${(patients.length * 1500).toLocaleString()}\n\n=== EXPENSE BREAKDOWN ===\nStaff Salaries: $${(staff.length * 8000).toLocaleString()}\nMedical Supplies: $${(patients.length * 300).toLocaleString()}\nUtilities: $${(patients.length * 50).toLocaleString()}\nMaintenance: $${(patients.length * 25).toLocaleString()}\nTotal Expenses: $${(patients.length * 1000).toLocaleString()}\n\n=== PROFITABILITY ===\nGross Profit: $${(patients.length * 500).toLocaleString()}\nProfit Margin: ${Math.round((500/1500)*100)}%\nROI: ${Math.floor(Math.random()*10+15)}%`;
        break;
      default:
        detailedData = `Generated ${reportType} report data at ${new Date().toLocaleString()}`;
    }
    
    const newReport = {
      id: Date.now().toString(),
      name: reportName,
      type: reportType,
      status: 'Completed',
      time: 'Just now',
      data: detailedData
    };
    setGeneratedReports(prev => [newReport, ...prev]);
  };
  
  const downloadReport = (report: any) => {
    const element = document.createElement('a');
    const file = new Blob([`${report.name}\n\nGenerated: ${new Date().toLocaleString()}\n\n${report.data}\n\nReport Details:\n- Type: ${report.type}\n- Status: ${report.status}\n- Generated: ${report.time}`], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${report.name.replace(/[^a-z0-9]/gi, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    addAlert('info', `📥 ${report.name} downloaded successfully`);
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Use actual data from our pages instead of API calls
  const patients = [
    { id: 1, first_name: "John", last_name: "Smith", age: 45, condition: "Hypertension", status: "stable", room: "A101", doctor: "Dr. Johnson" },
    { id: 2, first_name: "Mary", last_name: "Davis", age: 32, condition: "Diabetes", status: "critical", room: "ICU-2", doctor: "Dr. Brown" },
    { id: 3, first_name: "Robert", last_name: "Wilson", age: 67, condition: "Heart Disease", status: "stable", room: "B205", doctor: "Dr. Smith" },
    { id: 4, first_name: "Lisa", last_name: "Anderson", age: 28, condition: "Pregnancy", status: "normal", room: "C301", doctor: "Dr. Wilson" }
  ];

  const staff = [
    { id: 1, name: "Dr. Sarah Johnson", role: "Doctor", department: "Cardiology", shift: "Morning", status: "on-duty" },
    { id: 2, name: "Nurse Mike Davis", role: "Nurse", department: "Emergency", shift: "Night", status: "on-duty" },
    { id: 3, name: "Dr. Emily Brown", role: "Doctor", department: "Surgery", shift: "Evening", status: "available" },
    { id: 4, name: "Nurse John Smith", role: "Nurse", department: "ICU", shift: "Morning", status: "on-duty" },
    { id: 5, name: "Dr. Robert Wilson", role: "Doctor", department: "Pediatrics", shift: "Morning", status: "break" }
  ];

  const resources = [
    { id: 1, name: 'Hospital Beds', type: 'beds', total_count: 120, available_count: 85, status: 'available' },
    { id: 2, name: 'ICU Units', type: 'icu', total_count: 20, available_count: 18, status: 'critical' },
    { id: 3, name: 'Doctors', type: 'staff', total_count: 25, available_count: 15, status: 'available' },
    { id: 4, name: 'Ambulances', type: 'vehicles', total_count: 8, available_count: 3, status: 'available' }
  ];

  // AI-enhanced patient data with risk scoring and triage using actual patient data
  const enhancedPatients = patients.map((p: any, index: number) => {
    const riskScores = [85, 72, 45, 91];
    const priorities = ['critical', 'high', 'medium', 'critical'] as const;
    const triageStatus = ['immediate', 'urgent', 'standard', 'immediate'] as const;
    
    return {
      id: p.id,
      name: `${p.first_name} ${p.last_name}`,
      priority: priorities[index % priorities.length],
      condition: p.condition || "General checkup",
      waitTime: `${15 + index * 5} min`,
      age: p.age,
      riskScore: riskScores[index % riskScores.length],
      triageStatus: triageStatus[index % triageStatus.length],
      vitals: { hr: 72 + index * 3, bp: '120/80', temp: 98.6, spo2: 98 - index }
    };
  });

  // AI Predictive Analytics Data
  const predictiveData = {
    admissionTrend: [
      { time: '00:00', predicted: 12, actual: 10, confidence: 0.92 },
      { time: '04:00', predicted: 8, actual: 9, confidence: 0.88 },
      { time: '08:00', predicted: 25, actual: 23, confidence: 0.95 },
      { time: '12:00', predicted: 32, actual: 30, confidence: 0.91 },
      { time: '16:00', predicted: 28, actual: null, confidence: 0.89 },
      { time: '20:00', predicted: 18, actual: null, confidence: 0.87 }
    ]
  };



  // Show different pages based on navigation
  if (currentPage === 'patients') {
    return <PatientManagement onBack={() => setCurrentPage('dashboard')} />;
  }
  
  if (currentPage === 'resources') {
    return <ResourceAllocation onBack={() => setCurrentPage('dashboard')} />;
  }
  
  if (currentPage === 'emergency') {
    return <EmergencyManagement onBack={() => setCurrentPage('dashboard')} />;
  }
  
  if (currentPage === 'staff') {
    return <StaffManagement onBack={() => setCurrentPage('dashboard')} />;
  }
  
  if (currentPage === 'appointments') {
    return <AppointmentScheduling onBack={() => setCurrentPage('dashboard')} />;
  }
  
  if (currentPage === 'analytics') {
    return <ForecastingAnalytics onBack={() => setCurrentPage('dashboard')} />;
  }
  
  if (currentPage === 'reports') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setCurrentPage('dashboard')}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Reports & Analytics</h1>
            <p className="text-muted-foreground">Hospital performance and statistical reports</p>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="backdrop-blur-sm bg-white/80 border border-white/20 shadow-xl hover:shadow-2xl transition-all">
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-blue-500" />
              <h3 className="text-lg font-semibold mb-2">Daily Report</h3>
              <p className="text-sm text-muted-foreground">{currentTime.toLocaleDateString()} - Today's activity</p>
              <div className="mt-2 text-xs text-blue-600">
                <Brain className="h-3 w-3 inline mr-1" />
                AI Prediction: {Math.floor(patients.length * 1.2)} expected tomorrow
              </div>
              <Button 
                className="mt-4 w-full" 
                size="sm"
                onClick={() => generateReport('Daily', `Daily Report - ${currentTime.toLocaleDateString()}`, `📊 Daily Report generated for ${currentTime.toLocaleDateString()} - ${patients.length} patients, ${Math.floor(patients.length * 0.3)} admissions, ${Math.floor(patients.length * 0.2)} discharges`)}
              >
                Generate Report
              </Button>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-white/80 border border-white/20 shadow-xl hover:shadow-2xl transition-all">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-green-500" />
              <h3 className="text-lg font-semibold mb-2">Weekly Report</h3>
              <p className="text-sm text-muted-foreground">Week {Math.ceil(new Date().getDate()/7)} - 7-day analysis</p>
              <div className="mt-2 text-xs text-green-600">
                <Brain className="h-3 w-3 inline mr-1" />
                AI Forecast: +{Math.floor(Math.random()*20+10)}% next week
              </div>
              <Button 
                className="mt-4 w-full" 
                size="sm"
                onClick={() => generateReport('Weekly', `Weekly Report - Week ${Math.ceil(new Date().getDate()/7)}`, `📈 Weekly Report generated for Week ${Math.ceil(new Date().getDate()/7)} - ${patients.length * 7} patients treated, ${Math.round(((120-85)/120)*100)}% bed occupancy`)}
              >
                Generate Report
              </Button>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-white/80 border border-white/20 shadow-xl hover:shadow-2xl transition-all">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-purple-500" />
              <h3 className="text-lg font-semibold mb-2">Monthly Report</h3>
              <p className="text-sm text-muted-foreground">{currentTime.toLocaleDateString('en-US', {month: 'long'})} - Comprehensive analysis</p>
              <div className="mt-2 text-xs text-purple-600">
                <Brain className="h-3 w-3 inline mr-1" />
                AI Trend: Revenue up {Math.floor(Math.random()*15+5)}%
              </div>
              <Button 
                className="mt-4 w-full" 
                size="sm"
                onClick={() => generateReport('Monthly', `Monthly Report - ${currentTime.toLocaleDateString('en-US', {month: 'long', year: 'numeric'})}`, `📋 Monthly Report generated for ${currentTime.toLocaleDateString('en-US', {month: 'long', year: 'numeric'})} - ${patients.length * 30} patients, $${(patients.length * 1500).toLocaleString()} revenue, 92% satisfaction`)}
              >
                Generate Report
              </Button>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-white/80 border border-white/20 shadow-xl hover:shadow-2xl transition-all">
            <CardContent className="p-6 text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-red-500" />
              <h3 className="text-lg font-semibold mb-2">Patient Analytics</h3>
              <p className="text-sm text-muted-foreground">Real-time patient insights</p>
              <div className="mt-2 text-xs text-red-600">
                <Brain className="h-3 w-3 inline mr-1" />
                AI Risk Score: {Math.floor(Math.random()*30+70)}/100
              </div>
              <Button 
                className="mt-4 w-full" 
                size="sm"
                onClick={() => generateReport('Analytics', `Patient Analytics - Q${Math.ceil((new Date().getMonth()+1)/3)} ${new Date().getFullYear()}`, `🏥 Patient Analytics generated at ${currentTime.toLocaleTimeString()} - ${patients.length} active patients, ${patients.filter(p => p.status === 'critical').length} critical cases analyzed`)}
              >
                Generate Report
              </Button>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-white/80 border border-white/20 shadow-xl hover:shadow-2xl transition-all">
            <CardContent className="p-6 text-center">
              <Stethoscope className="h-12 w-12 mx-auto mb-4 text-orange-500" />
              <h3 className="text-lg font-semibold mb-2">Staff Performance</h3>
              <p className="text-sm text-muted-foreground">Current shift: {currentTime.getHours() < 14 ? 'Morning' : currentTime.getHours() < 22 ? 'Evening' : 'Night'}</p>
              <div className="mt-2 text-xs text-orange-600">
                <Brain className="h-3 w-3 inline mr-1" />
                AI Efficiency: {Math.floor(Math.random()*20+80)}%
              </div>
              <Button 
                className="mt-4 w-full" 
                size="sm"
                onClick={() => generateReport('Staff', `Staff Performance - ${currentTime.toLocaleDateString('en-US', {month: 'long'})}`, `👨‍⚕️ Staff Performance Report - ${staff.filter(s => s.status === 'on-duty').length}/${staff.length} on duty, ${Math.round((staff.filter(s => s.status === 'on-duty').length/staff.length)*100)}% utilization rate`)}
              >
                Generate Report
              </Button>
            </CardContent>
          </Card>
          
          <Card className="backdrop-blur-sm bg-white/80 border border-white/20 shadow-xl hover:shadow-2xl transition-all">
            <CardContent className="p-6 text-center">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-indigo-500" />
              <h3 className="text-lg font-semibold mb-2">Financial Report</h3>
              <p className="text-sm text-muted-foreground">Q{Math.ceil((currentTime.getMonth()+1)/3)} {currentTime.getFullYear()} Analysis</p>
              <div className="mt-2 text-xs text-indigo-600">
                <Brain className="h-3 w-3 inline mr-1" />
                AI Projection: +{Math.floor(Math.random()*10+5)}% growth
              </div>
              <Button 
                className="mt-4 w-full" 
                size="sm"
                onClick={() => generateReport('Financial', `Financial Report - ${currentTime.toLocaleDateString('en-US', {month: 'long', year: 'numeric'})}`, `💰 Financial Report for ${currentTime.toLocaleDateString('en-US', {month: 'long'})} - Revenue: $${(patients.length * 1500).toLocaleString()}, Profit: $${(patients.length * 500).toLocaleString()}`)}
              >
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <Card className="backdrop-blur-sm bg-white/80 border border-white/20 shadow-xl">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {generatedReports.map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                  <div>
                    <h4 className="font-medium">{report.name}</h4>
                    <p className="text-sm text-gray-600">{report.type} • {report.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={report.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {report.status}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => downloadReport(report)}
                    >
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (currentPage === 'settings') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setCurrentPage('dashboard')}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Configure system preferences</p>
          </div>
        </div>
        <Card className="backdrop-blur-sm bg-white/80 border border-white/20 shadow-xl">
          <CardContent className="p-8 text-center">
            <Settings className="h-16 w-16 mx-auto mb-4 text-blue-500" />
            <h3 className="text-xl font-semibold mb-2">Settings Panel</h3>
            <p className="text-muted-foreground">Use the settings button in the header for quick access</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity, page: 'dashboard', bgColor: '#3b82f6', hoverColor: '#2563eb' },
    { id: 'patients', label: 'Patient Management', icon: Heart, page: 'patients', bgColor: '#ef4444', hoverColor: '#dc2626' },
    { id: 'staff', label: 'Staff Management', icon: Stethoscope, page: 'staff', bgColor: '#10b981', hoverColor: '#059669' },
    { id: 'appointments', label: 'Appointment Scheduling', icon: Calendar, page: 'appointments', bgColor: '#8b5cf6', hoverColor: '#7c3aed' },
    { id: 'resources', label: 'Resource Allocation', icon: Bed, page: 'resources', bgColor: '#f59e0b', hoverColor: '#d97706' },
    { id: 'emergency', label: 'Emergency Management', icon: AlertCircle, page: 'emergency', bgColor: '#dc2626', hoverColor: '#b91c1c' },
    { id: 'analytics', label: 'Forecasting & Analytics', icon: BarChart3, page: 'analytics', bgColor: '#6366f1', hoverColor: '#4f46e5' },
    { id: 'reports', label: 'Reports', icon: FileText, page: 'reports', bgColor: '#06b6d4', hoverColor: '#0891b2' },
    { id: 'settings', label: 'Settings', icon: Settings, page: 'settings', bgColor: '#6b7280', hoverColor: '#4b5563' }
  ];

  return (
    <div className={`min-h-screen flex transition-all duration-500 ${darkMode ? 'dark bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'}`}>
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-r border-white/20 shadow-xl flex flex-col`}>
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">HealthFlow</h2>
                  <p className="text-xs text-muted-foreground">AI Hospital Hub</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2"
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.page;
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start gap-3 ${!sidebarOpen && 'px-2'} ${isActive ? '!bg-blue-500 !text-white shadow-lg' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                onClick={() => {
                  console.log('Sidebar clicked:', item.page);
                  if (item.page === 'settings') {
                    setShowSettings(true);
                  } else {
                    setCurrentPage(item.page);
                  }
                }}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {sidebarOpen && <span className="truncate">{item.label}</span>}
              </Button>
            );
          })}
        </nav>
        
        {sidebarOpen && (
          <div className="p-4 border-t border-white/20">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <p className="text-xs font-medium text-green-700 dark:text-green-400">System Status</p>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${darkMode ? 'bg-blue-500' : 'bg-blue-200'} animate-pulse`}></div>
          <div className={`absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-10 ${darkMode ? 'bg-purple-500' : 'bg-purple-200'} animate-pulse delay-1000`}></div>
        </div>
        
        <div className="relative z-10 p-6 space-y-6 flex-1 overflow-auto">
        {/* Enhanced Header */}
        <div className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 shadow-xl border border-white/20">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-75 animate-pulse"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl">
                  <Brain className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                  AI Healthcare Hub
                  <Sparkles className="h-6 w-6 text-yellow-500 animate-spin" />
                </h1>
                <p className="text-muted-foreground flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4" />
                  St. Mary's Medical Center • {currentTime.toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-2">
                <Sun className="h-4 w-4 mr-2 text-yellow-500" />
                <span className="font-medium">72°F</span>
                <span className="text-xs ml-1 opacity-75">Clear</span>
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 animate-pulse">
                <Activity className="h-3 w-3 mr-1" />
                All Systems Operational
              </Badge>
              <Button 
                variant="outline" 
                size="sm" 
                className="relative"
                onClick={() => {
                  setShowAlerts(!showAlerts);
                  if (!showAlerts) setNotifications(0);
                }}
              >
                <Bell className="h-4 w-4 mr-2" />
                Alerts
                {notifications > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center animate-bounce">
                    {notifications}
                  </Badge>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newDarkMode = !darkMode;
                  setDarkMode(newDarkMode);
                  if (newDarkMode) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                }}
                className="flex items-center gap-2"
              >
                {darkMode ? (
                  <>
                    <Sun className="h-4 w-4" />
                    Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" />
                    Dark Mode
                  </>
                )}
              </Button>

              <Button 
                variant="outline" 
                size="sm" 
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 hover:from-blue-600 hover:to-purple-600"
                onClick={() => setShowSettings(!showSettings)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 hover:from-red-600 hover:to-red-700"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* AI & Predictive Analytics Section */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-500 opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
            <div className="absolute top-2 right-2 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75"></div>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2 relative z-10">
              <p className="text-sm font-medium text-muted-foreground">AI Risk Score</p>
              <div className="flex items-center gap-2">
                <Badge className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg animate-pulse">
                  <Brain className="h-3 w-3 mr-1" />
                  94% AI
                </Badge>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 to-pink-500 shadow-lg">
                  <Shield className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold tabular-nums bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                {Math.floor(Math.random()*30+70)}
              </div>
              <div className="mt-3 flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Brain className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0 animate-pulse" />
                <p className="text-xs text-muted-foreground leading-tight font-medium">{patients.filter(p => p.status === 'critical').length} high-risk patients detected</p>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Last updated: {currentTime.toLocaleTimeString()}
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-teal-500 opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2 relative z-10">
              <p className="text-sm font-medium text-muted-foreground">Predicted Admissions</p>
              <div className="flex items-center gap-2">
                <Badge className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg animate-pulse">
                  <Brain className="h-3 w-3 mr-1" />
                  89% AI
                </Badge>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-teal-500 shadow-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold tabular-nums bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                {Math.floor(patients.length * 1.5 + Math.random()*10)}
              </div>
              <div className="mt-3 flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Brain className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0 animate-pulse" />
                <p className="text-xs text-muted-foreground leading-tight font-medium">Peak expected at {currentTime.getHours() < 14 ? '2 PM' : '8 AM tomorrow'}</p>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Forecast for: {new Date(currentTime.getTime() + 24*60*60*1000).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-500 opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2 relative z-10">
              <p className="text-sm font-medium text-muted-foreground">Resource Demand</p>
              <div className="flex items-center gap-2">
                <Badge className="text-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg animate-pulse">
                  <Brain className="h-3 w-3 mr-1" />
                  91% AI
                </Badge>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 shadow-lg">
                  <Zap className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold tabular-nums bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
                92%
              </div>
              <div className="mt-3 flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Brain className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0 animate-pulse" />
                <p className="text-xs text-muted-foreground leading-tight font-medium">ICU capacity critical in {Math.floor(Math.random()*6+2)}h</p>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Analysis time: {currentTime.toLocaleTimeString()}
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2 relative z-10">
              <p className="text-sm font-medium text-muted-foreground">Anomaly Detection</p>
              <div className="flex items-center gap-2">
                <Badge className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg animate-pulse">
                  <Brain className="h-3 w-3 mr-1" />
                  96% AI
                </Badge>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                  <AlertCircle className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold tabular-nums bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                2
              </div>
              <div className="mt-3 flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Brain className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0 animate-pulse" />
                <p className="text-xs text-muted-foreground leading-tight font-medium">{Math.floor(Math.random()*3+1)} anomalies detected today</p>
              </div>
              <div className="mt-2 text-xs text-gray-500">
                Real-time monitoring: {currentTime.toLocaleTimeString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Panel */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {[
                { icon: Heart, label: "Admit Patient", color: "bg-green-500 hover:bg-green-600", action: () => addAlert('info', 'Patient admission process initiated - Room 205 assigned') },
                { icon: AlertCircle, label: "Emergency Alert", color: "bg-red-500 hover:bg-red-600", action: () => setCurrentPage('emergency') },
                { icon: Bed, label: "Resource Mgmt", color: "bg-blue-500 hover:bg-blue-600", action: () => setCurrentPage('resources') },
                { icon: Stethoscope, label: "Schedule Surgery", color: "bg-purple-500 hover:bg-purple-600", action: () => addAlert('warning', 'Surgery scheduled for tomorrow 9:00 AM - OR 3 reserved') },
                { icon: Bell, label: "Call Code Blue", color: "bg-red-600 hover:bg-red-700", action: () => addAlert('critical', '🔵 CODE BLUE ACTIVATED - All available staff to Room 302 immediately') },
                { icon: Activity, label: "Generate Report", color: "bg-gray-500 hover:bg-gray-600", action: () => addAlert('info', 'Daily report generation started - Will be ready in 5 minutes') },
                { icon: Zap, label: "Quick Discharge", color: "bg-orange-500 hover:bg-orange-600", action: () => addAlert('info', 'Patient discharge processed - Room 108 now available') },
                { icon: Heart, label: "Vitals Check", color: "bg-pink-500 hover:bg-pink-600", action: () => addAlert('warning', 'Vitals monitoring alert - Patient in Room 205 requires attention') }
              ].map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className={`${action.color} text-white border-0 flex-col h-16 w-full transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                    onClick={action.action}
                  >
                    <Icon className="h-5 w-5 mb-1" />
                    <span className="text-xs font-medium">{action.label}</span>
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Main Dashboard Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border border-white/20 rounded-2xl p-2">
            <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white transition-all duration-300">
              <Activity className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="patients" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-teal-500 data-[state=active]:text-white transition-all duration-300">
              <Heart className="h-4 w-4 mr-2" />
              Patients
            </TabsTrigger>
            <TabsTrigger value="staff" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white transition-all duration-300">
              <Stethoscope className="h-4 w-4 mr-2" />
              Staff & Ops
            </TabsTrigger>
            <TabsTrigger value="resources" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300">
              <Bed className="h-4 w-4 mr-2" />
              Resources
            </TabsTrigger>
            <TabsTrigger value="analytics" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-blue-500 data-[state=active]:text-white transition-all duration-300">
              <TrendingUp className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Hospital & Patient Overview */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <MetricCard
                title="Total Patients"
                value={patients.length}
                icon={Users}
                trend={{ value: patients.length > 0 ? 8 : 0, isPositive: true }}
              />
              <MetricCard
                title="Hospital Beds"
                value={resources.find((r: any) => r.type === 'beds')?.available_count || 85}
                icon={Bed}
                trend={{ value: 5, isPositive: false }}
              />
              <MetricCard
                title="Medical Staff"
                value={resources.find((r: any) => r.type === 'staff')?.available_count || 15}
                icon={UserCheck}
                trend={{ value: 3, isPositive: true }}
              />
              <MetricCard
                title="ICU Capacity"
                value={resources.find((r: any) => r.type === 'icu')?.available_count || 18}
                icon={AlertCircle}
                trend={{ value: 2, isPositive: false }}
              />
            </div>

            {/* Hospital Status Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-500" />
                    Hospital Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Capacity</span>
                    <span className="font-semibold">{resources.find((r: any) => r.type === 'beds')?.total_count || 120} beds</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Occupancy Rate</span>
                    <span className="font-semibold text-orange-600">71%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Emergency Dept</span>
                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Surgery Rooms</span>
                    <span className="font-semibold">8 available</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-red-500" />
                    Patient Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Admitted Today</span>
                    <span className="font-semibold">{Math.floor(patients.length * 0.3)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Discharged</span>
                    <span className="font-semibold">{Math.floor(patients.length * 0.2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Critical Cases</span>
                    <Badge className="bg-red-100 text-red-800">{enhancedPatients.filter(p => p.priority === 'critical').length}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg Wait Time</span>
                    <span className="font-semibold text-blue-600">18 min</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5 text-green-500" />
                    Department Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Emergency</span>
                    <Badge className="bg-yellow-100 text-yellow-800">Busy</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">ICU</span>
                    <Badge className="bg-red-100 text-red-800">Critical</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Surgery</span>
                    <Badge className="bg-green-100 text-green-800">Available</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Cardiology</span>
                    <Badge className="bg-blue-100 text-blue-800">Normal</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts and Analytics */}
            <div className="grid gap-6 lg:grid-cols-2">
              <ForecastChart 
                title="Patient Admission Forecast" 
                data={predictiveData.admissionTrend.map(d => ({ 
                  date: d.time, 
                  actual: d.actual, 
                  predicted: d.predicted 
                }))}
              />
              
              <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-500 animate-pulse" />
                    Live Activity Feed
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-80 overflow-y-auto">
                  {[
                    { type: 'emergency', message: 'Code Blue - Room 302', time: '2 min ago', color: 'text-red-600', bg: 'bg-red-50' },
                    { type: 'admission', message: 'New patient admitted to ICU', time: '5 min ago', color: 'text-green-600', bg: 'bg-green-50' },
                    { type: 'surgery', message: 'Surgery completed - OR 3', time: '12 min ago', color: 'text-purple-600', bg: 'bg-purple-50' },
                    { type: 'discharge', message: 'Patient discharged from Ward B', time: '18 min ago', color: 'text-blue-600', bg: 'bg-blue-50' }
                  ].map((activity, index) => (
                    <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${activity.bg} transition-all duration-300 hover:scale-[1.02]`}>
                      <div className="p-2 rounded-full bg-white shadow-sm">
                        <Activity className={`h-4 w-4 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {activity.message}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="patients" className="space-y-6">
            {/* Patient & Hospital Integration */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      Patient Triage & Hospital Assignment
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">AI-powered patient management with hospital resource allocation</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {enhancedPatients.map(patient => (
                      <PatientQueueItem key={patient.id} {...patient} />
                    ))}
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-4">
                <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-blue-500" />
                      Hospital Departments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { name: 'Emergency', patients: 12, capacity: 20, status: 'busy' },
                      { name: 'ICU', patients: 18, capacity: 20, status: 'critical' },
                      { name: 'General Ward', patients: 65, capacity: 80, status: 'normal' },
                      { name: 'Surgery', patients: 8, capacity: 12, status: 'available' },
                      { name: 'Cardiology', patients: 15, capacity: 25, status: 'normal' }
                    ].map((dept, index) => {
                      const percentage = (dept.patients / dept.capacity) * 100;
                      const getStatusColor = (status: string) => {
                        switch (status) {
                          case 'critical': return 'bg-red-100 text-red-800';
                          case 'busy': return 'bg-yellow-100 text-yellow-800';
                          case 'available': return 'bg-green-100 text-green-800';
                          default: return 'bg-blue-100 text-blue-800';
                        }
                      };
                      return (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div>
                            <h4 className="font-medium">{dept.name}</h4>
                            <p className="text-sm text-muted-foreground">{dept.patients}/{dept.capacity} patients</p>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(dept.status)}>
                              {Math.round(percentage)}%
                            </Badge>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      Patient Flow
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Admissions Today</span>
                      <span className="font-semibold text-green-600">+{Math.floor(patients.length * 0.4)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Discharges Today</span>
                      <span className="font-semibold text-blue-600">{Math.floor(patients.length * 0.3)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Transfers</span>
                      <span className="font-semibold text-orange-600">{Math.floor(patients.length * 0.1)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Waiting List</span>
                      <span className="font-semibold text-purple-600">{Math.floor(patients.length * 0.2)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="staff" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Current Staff Status</span>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setCurrentPage('staff')}
                        className="bg-gradient-to-r from-green-500 to-teal-500 text-white border-0 hover:from-green-600 hover:to-teal-600"
                      >
                        Manage Staff
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">Real-time staff monitoring and status</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {staff.map((member: any) => {
                      const getStatusColor = (status: string) => {
                        switch (status) {
                          case 'on-duty': return 'bg-green-100 text-green-800';
                          case 'available': return 'bg-blue-100 text-blue-800';
                          case 'break': return 'bg-yellow-100 text-yellow-800';
                          default: return 'bg-gray-100 text-gray-800';
                        }
                      };
                      const getRoleIcon = (role: string) => {
                        return role === 'Doctor' ? Stethoscope : UserCheck;
                      };
                      const IconComponent = getRoleIcon(member.role);
                      return (
                        <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                          <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-full">
                              <IconComponent className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">{member.name}</h4>
                              <p className="text-sm text-gray-600">{member.role} • {member.department}</p>
                              <p className="text-sm text-gray-600">Shift: {member.shift}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(member.status)}>
                            {member.status}
                          </Badge>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-4">
                <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle>Staff Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">On Duty</span>
                      <span className="font-semibold text-green-600">{staff.filter(s => s.status === 'on-duty').length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Available</span>
                      <span className="font-semibold text-blue-600">{staff.filter(s => s.status === 'available').length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">On Break</span>
                      <span className="font-semibold text-yellow-600">{staff.filter(s => s.status === 'break').length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Staff</span>
                      <span className="font-semibold text-purple-600">{staff.length}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle>AI Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-medium text-sm">Recommended: +2 Nurses</h4>
                      <p className="text-xs text-muted-foreground">Emergency department peak hours</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium text-sm">Fatigue Alert: Dr. Wilson</h4>
                      <p className="text-xs text-muted-foreground">Extended shift detected</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Smart Resource Status</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage('resource-allocation')}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 hover:from-purple-600 hover:to-pink-600"
                  >
                    Manage Resources
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardTitle>
                <p className="text-sm text-muted-foreground">AI-optimized allocation</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {resources.length === 0 ? (
                  <div className="text-center py-4">Loading resources...</div>
                ) : (
                  resources.map((resource: any) => {
                    const getIcon = (type: string) => {
                      switch (type) {
                        case 'beds': return Bed;
                        case 'icu': return AlertCircle;
                        case 'staff': return UserCheck;
                        default: return Bed;
                      }
                    };
                    const getStatus = (available: number, total: number) => {
                      const percentage = (available / total) * 100;
                      if (percentage < 20) return 'critical';
                      if (percentage < 50) return 'inuse';
                      return 'available';
                    };
                    return (
                      <ResourceNode 
                        key={resource.id}
                        id={resource.id}
                        type={resource.name}
                        icon={getIcon(resource.type)}
                        status={getStatus(resource.available_count, resource.total_count)}
                        count={resource.available_count}
                        total={resource.total_count}
                      />
                    );
                  })
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6">
              <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Real-Time Analytics Dashboard</span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setCurrentPage('analytics')}
                      className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white border-0 hover:from-indigo-600 hover:to-blue-600"
                    >
                      Advanced Analytics
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">AI-powered insights based on current hospital data</p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-3">
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                      <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <h3 className="font-semibold">Patient Load</h3>
                      <p className="text-2xl font-bold text-blue-600">{patients.length}</p>
                      <p className="text-sm text-muted-foreground">Current patients</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                      <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-semibold">Bed Occupancy</h3>
                      <p className="text-2xl font-bold text-green-600">{Math.round(((120 - 85) / 120) * 100)}%</p>
                      <p className="text-sm text-muted-foreground">{120 - 85} of {120} beds occupied</p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                      <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <h3 className="font-semibold">Staff Utilization</h3>
                      <p className="text-2xl font-bold text-purple-600">{Math.round((staff.filter(s => s.status === 'on-duty').length / staff.length) * 100)}%</p>
                      <p className="text-sm text-muted-foreground">{staff.filter(s => s.status === 'on-duty').length} of {staff.length} on duty</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle>Patient Status Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['critical', 'stable', 'normal'].map(status => {
                        const count = patients.filter(p => p.status === status).length;
                        const percentage = patients.length > 0 ? Math.round((count / patients.length) * 100) : 0;
                        const getColor = (status: string) => {
                          switch (status) {
                            case 'critical': return 'text-red-600 bg-red-50';
                            case 'stable': return 'text-green-600 bg-green-50';
                            case 'normal': return 'text-blue-600 bg-blue-50';
                            default: return 'text-gray-600 bg-gray-50';
                          }
                        };
                        return (
                          <div key={status} className={`flex items-center justify-between p-3 rounded-lg ${getColor(status)}`}>
                            <span className="font-medium capitalize">{status} Patients</span>
                            <div className="text-right">
                              <span className="font-bold">{count}</span>
                              <span className="text-sm ml-2">({percentage}%)</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle>Department Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {['Cardiology', 'Emergency', 'Surgery', 'ICU', 'Pediatrics'].map(dept => {
                        const staffCount = staff.filter(s => s.department === dept).length;
                        const onDutyCount = staff.filter(s => s.department === dept && s.status === 'on-duty').length;
                        return (
                          <div key={dept} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="font-medium">{dept}</span>
                            <div className="text-right">
                              <span className="font-bold">{onDutyCount}/{staffCount}</span>
                              <span className="text-sm text-gray-600 ml-2">staff on duty</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        {/* Alerts Modal */}
        {showAlerts && (
          <Card className="fixed top-20 right-6 w-96 z-50 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 border border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Active Alerts
                </span>
                <Button variant="ghost" size="sm" onClick={() => setShowAlerts(false)}>
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {alerts.map(alert => {
                const getBgColor = (type: string) => {
                  switch (type) {
                    case 'critical': return 'bg-red-50 border-red-200';
                    case 'warning': return 'bg-yellow-50 border-yellow-200';
                    case 'info': return 'bg-blue-50 border-blue-200';
                    default: return 'bg-gray-50 border-gray-200';
                  }
                };
                const getTextColor = (type: string) => {
                  switch (type) {
                    case 'critical': return 'text-red-800';
                    case 'warning': return 'text-yellow-800';
                    case 'info': return 'text-blue-800';
                    default: return 'text-gray-800';
                  }
                };
                const getTimeColor = (type: string) => {
                  switch (type) {
                    case 'critical': return 'text-red-600';
                    case 'warning': return 'text-yellow-600';
                    case 'info': return 'text-blue-600';
                    default: return 'text-gray-600';
                  }
                };
                return (
                  <div key={alert.id} className={`p-3 border rounded-lg ${getBgColor(alert.type)}`}>
                    <div className="flex justify-between items-start">
                      <p className={`text-sm font-medium ${getTextColor(alert.type)} flex-1`}>{alert.message}</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0 ml-2"
                        onClick={() => setAlerts(prev => prev.filter(a => a.id !== alert.id))}
                      >
                        ×
                      </Button>
                    </div>
                    <p className={`text-xs ${getTimeColor(alert.type)} mt-1`}>{alert.time}</p>
                  </div>
                );
              })}
              {alerts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No active alerts</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <Card className="fixed top-20 right-6 w-80 z-50 backdrop-blur-sm bg-white/95 dark:bg-gray-800/95 border border-white/20 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Settings
                </span>
                <Button variant="ghost" size="sm" onClick={() => setShowSettings(false)}>
                  ×
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Dark Mode</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setDarkMode(!darkMode);
                    if (!darkMode) {
                      document.documentElement.classList.add('dark');
                    } else {
                      document.documentElement.classList.remove('dark');
                    }
                  }}
                  className={darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}
                >
                  {darkMode ? 'ON' : 'OFF'}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Notifications</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={notificationsEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                >
                  {notificationsEnabled ? 'ON' : 'OFF'}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto Refresh</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    const intervals = [10, 30, 60, 120];
                    const currentIndex = intervals.indexOf(autoRefreshInterval);
                    const nextIndex = (currentIndex + 1) % intervals.length;
                    setAutoRefreshInterval(intervals[nextIndex]);
                  }}
                  className="bg-blue-100 text-blue-800"
                >
                  {autoRefreshInterval}s
                </Button>
              </div>
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                onClick={() => {
                  setShowSettings(false);
                  // Save settings logic here
                }}
              >
                Save Settings
              </Button>
            </CardContent>
          </Card>
        )}
        </div>
      </div>
    </div>
  );
}
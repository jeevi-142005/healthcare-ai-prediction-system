import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MetricCard } from "@/components/metric-card";
import { PatientQueueItem } from "@/components/patient-queue-item";
import { ResourceNode } from "@/components/resource-node";
import { ForecastChart } from "@/components/forecast-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Building2, Users, Bed, Activity, Brain, TrendingUp, AlertCircle, Stethoscope, Settings, Bell, Sun, Moon, Zap, Heart, Shield, Clock, UserCheck, Sparkles, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function HospitalDashboard() {
  const [darkMode, setDarkMode] = useState(false);
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

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDarkMode = savedDarkMode ? JSON.parse(savedDarkMode) : systemDarkMode;
    setDarkMode(initialDarkMode);
    if (initialDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  const { data: patients = [], isLoading: patientsLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const response = await fetch("/api/patients");
      if (!response.ok) throw new Error("Failed to fetch patients");
      return response.json();
    }
  });

  const { data: resources = [], isLoading: resourcesLoading } = useQuery({
    queryKey: ["resources"],
    queryFn: async () => {
      const response = await fetch("/api/resources");
      if (!response.ok) throw new Error("Failed to fetch resources");
      return response.json();
    }
  });

  const enhancedPatients = patients.length > 0 ? patients.slice(0, 6).map((p: any, index: number) => {
    const riskScores = [85, 72, 45, 91, 38, 67];
    const priorities = ['critical', 'high', 'medium', 'critical', 'low', 'high'] as const;
    const triageStatus = ['immediate', 'urgent', 'standard', 'immediate', 'standard', 'urgent'] as const;
    
    return {
      id: p.id,
      name: `${p.first_name} ${p.last_name}`,
      priority: priorities[index % priorities.length],
      condition: p.medical_history || "General checkup",
      waitTime: `${15 + index * 5} min`,
      age: 25 + index * 8,
      riskScore: riskScores[index % riskScores.length],
      triageStatus: triageStatus[index % triageStatus.length],
      vitals: { hr: 72 + index * 3, bp: '120/80', temp: 98.6, spo2: 98 - index }
    };
  }) : [];

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

  const hospitalStats = {
    totalPatients: patients.length || 342,
    availableBeds: resources.find((r: any) => r.type === 'beds')?.available_count || 85,
    staffOnDuty: resources.find((r: any) => r.type === 'staff')?.available_count || 45,
    criticalCases: enhancedPatients.filter(p => p.priority === 'critical').length || 8,
    occupancyRate: 71,
    emergencyWaiting: 12
  };

  const departments = [
    { name: 'Emergency', patients: 12, capacity: 20, status: 'busy', color: 'bg-yellow-100 text-yellow-800' },
    { name: 'ICU', patients: 18, capacity: 20, status: 'critical', color: 'bg-red-100 text-red-800' },
    { name: 'General Ward', patients: 65, capacity: 80, status: 'normal', color: 'bg-blue-100 text-blue-800' },
    { name: 'Surgery', patients: 8, capacity: 12, status: 'available', color: 'bg-green-100 text-green-800' },
    { name: 'Cardiology', patients: 15, capacity: 25, status: 'normal', color: 'bg-blue-100 text-blue-800' }
  ];

  const recentActivities = [
    { type: 'admission', message: 'New patient admitted to ICU', time: '5 min ago', color: 'text-green-600', bg: 'bg-green-50' },
    { type: 'emergency', message: 'Code Blue - Room 302', time: '12 min ago', color: 'text-red-600', bg: 'bg-red-50' },
    { type: 'surgery', message: 'Surgery completed - OR 3', time: '25 min ago', color: 'text-purple-600', bg: 'bg-purple-50' },
    { type: 'discharge', message: 'Patient discharged from Ward B', time: '35 min ago', color: 'text-blue-600', bg: 'bg-blue-50' }
  ];

  const quickActions = [
    { icon: Heart, label: "Admit Patient", color: "bg-green-500 hover:bg-green-600", action: () => addAlert('info', 'Patient admission process initiated - Room 205 assigned') },
    { icon: AlertCircle, label: "Emergency Alert", color: "bg-red-500 hover:bg-red-600", action: () => addAlert('critical', '🚨 EMERGENCY ALERT: Code Red activated in Emergency Department') },
    { icon: Bed, label: "Assign Bed", color: "bg-blue-500 hover:bg-blue-600", action: () => addAlert('info', 'Bed assignment completed - Patient moved to Ward B, Bed 12') },
    { icon: Stethoscope, label: "Schedule Surgery", color: "bg-purple-500 hover:bg-purple-600", action: () => addAlert('warning', 'Surgery scheduled for tomorrow 9:00 AM - OR 3 reserved') },
    { icon: Bell, label: "Call Code Blue", color: "bg-red-600 hover:bg-red-700", action: () => addAlert('critical', '🔵 CODE BLUE ACTIVATED - All available staff to Room 302 immediately') },
    { icon: Activity, label: "Generate Report", color: "bg-gray-500 hover:bg-gray-600", action: () => addAlert('info', 'Daily report generation started - Will be ready in 5 minutes') }
  ];

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'dark bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'}`}>
      <div className="p-6 space-y-6">
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
                  AI Hospital Hub
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
              <Button variant="outline" size="sm" onClick={toggleDarkMode}>
                {darkMode ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                {darkMode ? 'Light' : 'Dark'}
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
            </div>
          </div>
        </div>

        {/* AI Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-pink-500 opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
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
                78
              </div>
              <div className="mt-3 flex items-start gap-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Brain className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0 animate-pulse" />
                <p className="text-xs text-muted-foreground leading-tight font-medium">3 high-risk patients detected</p>
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-teal-500 opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2 relative z-10">
              <p className="text-sm font-medium text-muted-foreground">Total Patients</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-teal-500 shadow-lg">
                <Users className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold tabular-nums">
                {hospitalStats.totalPatients}
              </div>
              <p className="text-xs text-muted-foreground">
                +8 from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2 relative z-10">
              <p className="text-sm font-medium text-muted-foreground">Available Beds</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                <Bed className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold tabular-nums">
                {hospitalStats.availableBeds}
              </div>
              <p className="text-xs text-muted-foreground">
                {hospitalStats.occupancyRate}% occupancy
              </p>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-indigo-500 opacity-5 group-hover:opacity-10 transition-opacity duration-300"></div>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2 relative z-10">
              <p className="text-sm font-medium text-muted-foreground">Staff On Duty</p>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 shadow-lg">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-bold tabular-nums">
                {hospitalStats.staffOnDuty}
              </div>
              <p className="text-xs text-muted-foreground">
                +3 from last shift
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {quickActions.map((action, index) => {
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
                value={hospitalStats.totalPatients}
                icon={Users}
                trend={{ value: 8, isPositive: true }}
              />
              <MetricCard
                title="Available Beds"
                value={hospitalStats.availableBeds}
                icon={Bed}
                trend={{ value: 5, isPositive: false }}
              />
              <MetricCard
                title="Staff On Duty"
                value={hospitalStats.staffOnDuty}
                icon={UserCheck}
                trend={{ value: 3, isPositive: true }}
              />
              <MetricCard
                title="Critical Cases"
                value={hospitalStats.criticalCases}
                icon={AlertCircle}
                trend={{ value: 2, isPositive: false }}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Department Status */}
              <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-500" />
                    Department Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {departments.map((dept, index) => {
                    const percentage = (dept.patients / dept.capacity) * 100;
                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <h4 className="font-medium">{dept.name}</h4>
                          <p className="text-sm text-muted-foreground">{dept.patients}/{dept.capacity} patients</p>
                        </div>
                        <div className="text-right">
                          <Badge className={dept.color}>
                            {Math.round(percentage)}%
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Live Activity Feed */}
              <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-500 animate-pulse" />
                    Live Activity Feed
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-80 overflow-y-auto">
                  {recentActivities.map((activity, index) => (
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

            <ForecastChart 
              title="Patient Admission Forecast" 
              data={predictiveData.admissionTrend.map(d => ({ 
                date: d.time, 
                actual: d.actual, 
                predicted: d.predicted 
              }))}
            />
          </TabsContent>

          <TabsContent value="patients" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      Patient Triage & Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {enhancedPatients.map(patient => (
                      <PatientQueueItem key={patient.id} {...patient} />
                    ))}
                  </CardContent>
                </Card>
              </div>
              
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
                    <span className="font-semibold text-green-600">+{Math.floor(hospitalStats.totalPatients * 0.4)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Discharges Today</span>
                    <span className="font-semibold text-blue-600">{Math.floor(hospitalStats.totalPatients * 0.3)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Transfers</span>
                    <span className="font-semibold text-orange-600">{Math.floor(hospitalStats.totalPatients * 0.1)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Waiting List</span>
                    <span className="font-semibold text-purple-600">{Math.floor(hospitalStats.totalPatients * 0.2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="staff" className="space-y-6">
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle>Staff Performance & Operations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium">Recommended: +2 Nurses</h4>
                    <p className="text-sm text-muted-foreground">Emergency department peak hours</p>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-medium">Fatigue Alert: Dr. Smith</h4>
                    <p className="text-sm text-muted-foreground">18-hour shift detected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle>Smart Resource Status</CardTitle>
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
            <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl">
              <CardHeader>
                <CardTitle>Predictive Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                    <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <h3 className="font-semibold">Admission Forecast</h3>
                    <p className="text-2xl font-bold text-blue-600">+23%</p>
                    <p className="text-sm text-muted-foreground">Next 24 hours</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                    <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <h3 className="font-semibold">Avg Wait Time</h3>
                    <p className="text-2xl font-bold text-green-600">18 min</p>
                    <p className="text-sm text-muted-foreground">-12% from yesterday</p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                    <Brain className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <h3 className="font-semibold">AI Accuracy</h3>
                    <p className="text-2xl font-bold text-purple-600">94.2%</p>
                    <p className="text-sm text-muted-foreground">Prediction confidence</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                );
              })}
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
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
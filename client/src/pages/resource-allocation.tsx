import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bed, Ambulance, Stethoscope, Building2, Plus, Minus, Brain, Zap, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ResourceAllocationProps {
  onBack?: () => void;
}

export default function ResourceAllocation({ onBack }: ResourceAllocationProps) {
  const [resources, setResources] = useState([
    { id: 1, name: 'Hospital Beds', type: 'beds', total_count: 120, available_count: 85, current_allocation: 35, status: 'available', location: 'General Ward' },
    { id: 2, name: 'ICU Units', type: 'icu', total_count: 20, available_count: 18, current_allocation: 2, status: 'critical', location: 'ICU' },
    { id: 3, name: 'Doctors', type: 'staff', total_count: 25, available_count: 15, current_allocation: 10, status: 'available', location: 'Hospital' },
    { id: 4, name: 'Ambulances', type: 'vehicles', total_count: 8, available_count: 3, current_allocation: 5, status: 'available', location: 'Parking' }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    const initialDarkMode = savedDarkMode ? JSON.parse(savedDarkMode) : false;
    setDarkMode(initialDarkMode);
    if (initialDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const adjustResource = (resourceId: number, change: number) => {
    setResources(prev => prev.map(resource => {
      if (resource.id === resourceId) {
        const newAvailable = Math.max(0, Math.min(resource.total_count, resource.available_count + change));
        return { ...resource, available_count: newAvailable };
      }
      return resource;
    }));
  };

  const autoAllocate = async () => {
    setIsProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setResources(prev => prev.map(resource => ({
      ...resource,
      available_count: Math.floor(resource.total_count * 0.8)
    })));
    setIsProcessing(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'beds': return Bed;
      case 'icu': return Building2;
      case 'staff': return Stethoscope;
      case 'vehicles': return Ambulance;
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
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'dark bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'}`}>
      <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resource Allocation</h1>
            <p className="text-gray-600 dark:text-gray-300">Manage hospital resources with AI-powered allocation</p>
          </div>
        </div>
        <Button
          onClick={() => {
            const newDarkMode = !darkMode;
            setDarkMode(newDarkMode);
            localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
            if (newDarkMode) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }}
          variant="outline"
          className="dark:bg-gray-800 dark:text-white dark:border-gray-600"
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </Button>
      </div>

      <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                <Brain className="h-5 w-5 text-purple-500" />
                AI Resource Management
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-300">Automatic allocation based on demand prediction</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800 animate-pulse">
                <Brain className="h-3 w-3 mr-1" />
                AI Active
              </Badge>
              <Button
                onClick={autoAllocate}
                disabled={isProcessing}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 px-4 py-2"
              >
                <Zap className="h-4 w-4 mr-2" />
                {isProcessing ? 'Processing...' : 'Auto Allocate'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {resources.map((resource) => {
            const Icon = getIcon(resource.type);
            const percentage = (resource.available_count / resource.total_count) * 100;
            const status = getStatus(resource.available_count, resource.total_count);
            
            return (
              <div key={resource.id} className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-600">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-md ${
                    status === 'available' ? 'bg-green-100 text-green-600' :
                    status === 'inuse' ? 'bg-yellow-100 text-yellow-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{resource.name}</h4>
                      <Badge className="bg-purple-100 text-purple-800 text-xs">
                        <Brain className="h-3 w-3 mr-1" />
                        AI Managed
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {resource.available_count} available • {resource.current_allocation} in use • {resource.total_count} total
                    </p>
                    <p className="text-xs text-gray-500">
                      Utilization: {Math.round(((resource.total_count - resource.available_count) / resource.total_count) * 100)}%
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded text-xs">
                        <Brain className="h-3 w-3 inline mr-1" />
                        AI Suggests: {Math.floor(resource.total_count * 0.8)} optimal allocation
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      console.log('Minus clicked for:', resource.name);
                      setResources(prev => prev.map(r => 
                        r.id === resource.id 
                          ? { ...r, available_count: Math.max(0, r.available_count - 1) }
                          : r
                      ));
                    }}
                    disabled={resource.available_count <= 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <span className="min-w-[3rem] text-center font-mono text-lg">
                    {resource.available_count}
                  </span>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      console.log('Plus clicked for:', resource.name);
                      setResources(prev => prev.map(r => 
                        r.id === resource.id 
                          ? { ...r, available_count: Math.min(r.total_count, r.available_count + 1) }
                          : r
                      ));
                    }}
                    disabled={resource.available_count >= resource.total_count}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                <Badge className={`${
                  status === 'available' ? 'bg-green-100 text-green-800' :
                  status === 'inuse' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {status === 'available' ? 'Available' :
                   status === 'inuse' ? 'In Use' : 'Critical'}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
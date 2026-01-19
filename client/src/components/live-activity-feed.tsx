import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, UserPlus, Bed, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useState, useEffect } from "react";

interface ActivityItem {
  id: string;
  type: 'admission' | 'discharge' | 'emergency' | 'surgery' | 'alert';
  message: string;
  time: string;
  priority: 'high' | 'medium' | 'low';
}

const activityConfig = {
  admission: { icon: UserPlus, color: "text-green-600", bg: "bg-green-50" },
  discharge: { icon: CheckCircle, color: "text-blue-600", bg: "bg-blue-50" },
  emergency: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
  surgery: { icon: Activity, color: "text-purple-600", bg: "bg-purple-50" },
  alert: { icon: AlertTriangle, color: "text-orange-600", bg: "bg-orange-50" }
};

export function LiveActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([
    { id: '1', type: 'emergency', message: 'Code Blue - Room 302', time: '2 min ago', priority: 'high' },
    { id: '2', type: 'admission', message: 'New patient admitted to ICU', time: '5 min ago', priority: 'medium' },
    { id: '3', type: 'surgery', message: 'Surgery completed - OR 3', time: '12 min ago', priority: 'low' },
    { id: '4', type: 'discharge', message: 'Patient discharged from Ward B', time: '18 min ago', priority: 'low' },
    { id: '5', type: 'alert', message: 'Equipment maintenance due', time: '25 min ago', priority: 'medium' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new activity
      const newActivity: ActivityItem = {
        id: Date.now().toString(),
        type: ['admission', 'discharge', 'emergency', 'surgery', 'alert'][Math.floor(Math.random() * 5)] as any,
        message: 'New activity detected',
        time: 'Just now',
        priority: ['high', 'medium', 'low'][Math.floor(Math.random() * 3)] as any
      };
      
      setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
    }, 30000); // Add new activity every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-white/20 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-500 animate-pulse" />
          Live Activity Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 max-h-80 overflow-y-auto">
        {activities.map((activity, index) => {
          const config = activityConfig[activity.type];
          const Icon = config.icon;
          
          return (
            <div 
              key={activity.id} 
              className={`flex items-start gap-3 p-3 rounded-lg ${config.bg} transition-all duration-300 hover:scale-[1.02] ${index === 0 ? 'animate-fadeIn' : ''}`}
            >
              <div className={`p-2 rounded-full bg-white shadow-sm`}>
                <Icon className={`h-4 w-4 ${config.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {activity.message}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-500">{activity.time}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      activity.priority === 'high' ? 'border-red-300 text-red-700' :
                      activity.priority === 'medium' ? 'border-yellow-300 text-yellow-700' :
                      'border-gray-300 text-gray-700'
                    }`}
                  >
                    {activity.priority}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
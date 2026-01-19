import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { User, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  performance: number;
  workload: number;
  fatigue: 'low' | 'medium' | 'high';
}

interface StaffPerformanceCardProps {
  staff: StaffMember[];
}

const fatigueConfig = {
  low: { label: "Low", color: "bg-green-100 text-green-800", icon: CheckCircle },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-800", icon: AlertTriangle },
  high: { label: "High", color: "bg-red-100 text-red-800", icon: AlertTriangle }
};

export function StaffPerformanceCard({ staff }: StaffPerformanceCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Staff Performance Analytics
        </CardTitle>
        <p className="text-sm text-muted-foreground">Real-time performance and workload monitoring</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {staff.map(member => {
          const fatigueInfo = fatigueConfig[member.fatigue];
          const FatigueIcon = fatigueInfo.icon;
          
          return (
            <div key={member.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <User className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
                <Badge className={fatigueInfo.color}>
                  <FatigueIcon className="h-3 w-3 mr-1" />
                  {fatigueInfo.label} Fatigue
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Performance</span>
                    <span className="font-medium">{member.performance}%</span>
                  </div>
                  <Progress 
                    value={member.performance} 
                    className="h-2"
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Workload</span>
                    <span className="font-medium">{member.workload}%</span>
                  </div>
                  <Progress 
                    value={member.workload} 
                    className="h-2"
                  />
                </div>
              </div>
              
              {/* Performance Indicators */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${
                    member.performance >= 90 ? 'bg-green-500' :
                    member.performance >= 75 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                  <span>Performance Rating</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${
                    member.workload <= 70 ? 'bg-green-500' :
                    member.workload <= 85 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`} />
                  <span>Workload Status</span>
                </div>
              </div>
            </div>
          );
        })}
        
        {/* Summary Stats */}
        <div className="border-t pt-4 mt-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">
                {Math.round(staff.reduce((acc, s) => acc + s.performance, 0) / staff.length)}%
              </p>
              <p className="text-xs text-muted-foreground">Avg Performance</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {staff.filter(s => s.fatigue === 'low').length}
              </p>
              <p className="text-xs text-muted-foreground">Low Fatigue</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {staff.filter(s => s.workload > 80).length}
              </p>
              <p className="text-xs text-muted-foreground">High Workload</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
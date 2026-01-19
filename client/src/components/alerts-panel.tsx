import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, AlertTriangle, Info, AlertCircle, X, Check } from "lucide-react";

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  time: string;
}

interface AlertsPanelProps {
  alerts: Alert[];
}

const alertConfig = {
  critical: {
    icon: AlertCircle,
    color: "bg-red-100 text-red-800 border-red-200",
    bgColor: "bg-red-50",
    iconColor: "text-red-600"
  },
  warning: {
    icon: AlertTriangle,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    bgColor: "bg-yellow-50",
    iconColor: "text-yellow-600"
  },
  info: {
    icon: Info,
    color: "bg-blue-100 text-blue-800 border-blue-200",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600"
  }
};

export function AlertsPanel({ alerts }: AlertsPanelProps) {
  const criticalCount = alerts.filter(a => a.type === 'critical').length;
  const warningCount = alerts.filter(a => a.type === 'warning').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Real-time Alerts & Notifications</CardTitle>
            {(criticalCount > 0 || warningCount > 0) && (
              <Badge variant="destructive" className="ml-2">
                {criticalCount + warningCount} Active
              </Badge>
            )}
          </div>
          <Button variant="outline" size="sm">
            <Check className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          Custom threshold alerts and escalation notifications
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Alert Summary */}
        <div className="grid grid-cols-3 gap-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-lg font-bold text-red-600">{criticalCount}</p>
            <p className="text-xs text-muted-foreground">Critical</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-yellow-600">{warningCount}</p>
            <p className="text-xs text-muted-foreground">Warnings</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-blue-600">{alerts.filter(a => a.type === 'info').length}</p>
            <p className="text-xs text-muted-foreground">Info</p>
          </div>
        </div>

        {/* Alerts List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {alerts.map(alert => {
            const config = alertConfig[alert.type];
            const AlertIcon = config.icon;
            
            return (
              <div key={alert.id} className={`border rounded-lg p-3 ${config.bgColor}`}>
                <div className="flex items-start gap-3">
                  <AlertIcon className={`h-5 w-5 mt-0.5 ${config.iconColor}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight">{alert.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={config.color} variant="outline">
                      {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Escalation Rules */}
        <div className="border-t pt-4">
          <h5 className="font-medium mb-2 text-sm">Active Escalation Rules</h5>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between p-2 bg-red-50 rounded">
              <span>ICU Capacity {'>'} 90%</span>
              <Badge variant="outline" className="border-red-500 text-red-700">Auto-escalate to Admin</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded">
              <span>Wait Time {'>'} 60 min</span>
              <Badge variant="outline" className="border-yellow-500 text-yellow-700">Notify Charge Nurse</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
              <span>Equipment Offline</span>
              <Badge variant="outline" className="border-blue-500 text-blue-700">Alert Maintenance</Badge>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-t pt-4">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="flex-1">
              Configure Alerts
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              View History
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
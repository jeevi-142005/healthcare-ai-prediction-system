import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Settings, CheckCircle, AlertTriangle, XCircle, MapPin } from "lucide-react";

interface Equipment {
  id: string;
  name: string;
  status: 'operational' | 'maintenance' | 'offline';
  usage: number;
  nextMaintenance: string;
  location: string;
}

interface EquipmentTrackerProps {
  equipment: Equipment[];
}

const statusConfig = {
  operational: { 
    label: "Operational", 
    color: "bg-green-100 text-green-800", 
    icon: CheckCircle,
    bgColor: "bg-green-50"
  },
  maintenance: { 
    label: "Maintenance", 
    color: "bg-yellow-100 text-yellow-800", 
    icon: AlertTriangle,
    bgColor: "bg-yellow-50"
  },
  offline: { 
    label: "Offline", 
    color: "bg-red-100 text-red-800", 
    icon: XCircle,
    bgColor: "bg-red-50"
  }
};

export function EquipmentTracker({ equipment }: EquipmentTrackerProps) {
  const operationalCount = equipment.filter(e => e.status === 'operational').length;
  const maintenanceCount = equipment.filter(e => e.status === 'maintenance').length;
  const offlineCount = equipment.filter(e => e.status === 'offline').length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Equipment & Device Tracker
        </CardTitle>
        <p className="text-sm text-muted-foreground">Real-time equipment status and maintenance alerts</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{operationalCount}</p>
            <p className="text-xs text-muted-foreground">Operational</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{maintenanceCount}</p>
            <p className="text-xs text-muted-foreground">Maintenance</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{offlineCount}</p>
            <p className="text-xs text-muted-foreground">Offline</p>
          </div>
        </div>

        {/* Equipment List */}
        <div className="space-y-3">
          {equipment.map(item => {
            const config = statusConfig[item.status];
            const StatusIcon = config.icon;
            
            return (
              <div key={item.id} className={`border rounded-lg p-4 ${config.bgColor}`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{item.name}</h4>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3 w-3" />
                      <span>{item.location}</span>
                    </div>
                  </div>
                  <Badge className={config.color}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {config.label}
                  </Badge>
                </div>
                
                {item.status === 'operational' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Usage</span>
                      <span className="font-medium">{item.usage}%</span>
                    </div>
                    <Progress 
                      value={item.usage} 
                      className="h-2"
                    />
                  </div>
                )}
                
                <div className="flex items-center justify-between mt-3 pt-3 border-t text-sm">
                  <span className="text-muted-foreground">Next Maintenance:</span>
                  <span className={`font-medium ${
                    item.nextMaintenance.includes('progress') ? 'text-yellow-600' :
                    item.nextMaintenance.includes('day') ? 'text-orange-600' :
                    'text-green-600'
                  }`}>
                    {item.nextMaintenance}
                  </span>
                </div>
                
                {/* Maintenance Alert */}
                {item.nextMaintenance.includes('day') && parseInt(item.nextMaintenance) <= 3 && (
                  <div className="mt-2 p-2 bg-orange-100 border border-orange-200 rounded text-sm text-orange-800">
                    <AlertTriangle className="h-4 w-4 inline mr-1" />
                    Maintenance due soon - schedule service
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Auto-reorder Alerts */}
        <div className="border-t pt-4">
          <h5 className="font-medium mb-2">Smart Inventory Alerts</h5>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded text-sm">
              <span>Surgical Masks - Low Stock</span>
              <Badge variant="outline" className="border-blue-500 text-blue-700">Auto-reorder triggered</Badge>
            </div>
            <div className="flex items-center justify-between p-2 bg-yellow-50 rounded text-sm">
              <span>IV Bags - Below threshold</span>
              <Badge variant="outline" className="border-yellow-500 text-yellow-700">Review needed</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
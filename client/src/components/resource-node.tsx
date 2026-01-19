import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

type ResourceStatus = "available" | "inuse" | "critical";

interface ResourceNodeProps {
  id: string;
  type: string;
  icon: LucideIcon;
  status: ResourceStatus;
  count: number;
  total: number;
}

const statusConfig = {
  available: { label: "Available", className: "bg-resource-available text-white" },
  inuse: { label: "In Use", className: "bg-resource-inuse text-white" },
  critical: { label: "Critical", className: "bg-resource-critical text-white" },
};

export function ResourceNode({ id, type, icon: Icon, status, count, total }: ResourceNodeProps) {
  const config = statusConfig[status];
  const percentage = Math.round((count / total) * 100);

  return (
    <Card className="hover-elevate" data-testid={`card-resource-${id}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-md ${
              status === 'available' ? 'bg-resource-available/10' :
              status === 'inuse' ? 'bg-resource-inuse/10' :
              'bg-resource-critical/10'
            }`}>
              <Icon className={`h-6 w-6 ${
                status === 'available' ? 'text-resource-available' :
                status === 'inuse' ? 'text-resource-inuse' :
                'text-resource-critical'
              }`} />
            </div>
            <div>
              <h4 className="font-semibold">{type}</h4>
              <p className="text-sm text-muted-foreground" data-testid={`text-resource-count-${id}`}>
                {count} / {total} ({percentage}%)
              </p>
            </div>
          </div>
          <Badge className={config.className} data-testid={`badge-resource-status-${id}`}>
            {config.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

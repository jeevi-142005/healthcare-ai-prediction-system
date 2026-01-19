import { Badge } from "@/components/ui/badge";

type Priority = "critical" | "high" | "medium" | "low";

interface PriorityBadgeProps {
  priority: Priority;
}

const priorityConfig = {
  critical: { label: "Critical", className: "bg-priority-critical text-white" },
  high: { label: "High", className: "bg-priority-high text-white" },
  medium: { label: "Medium", className: "bg-priority-medium text-white" },
  low: { label: "Low", className: "bg-priority-low text-white" },
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  
  return (
    <Badge 
      className={config.className}
      data-testid={`badge-priority-${priority}`}
    >
      {config.label}
    </Badge>
  );
}

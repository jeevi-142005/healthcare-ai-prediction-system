import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PriorityBadge } from "./priority-badge";
import { Clock, User, Brain, Heart, Thermometer, Activity } from "lucide-react";

type Priority = "critical" | "high" | "medium" | "low";
type TriageStatus = "immediate" | "urgent" | "standard";

interface PatientQueueItemProps {
  id: string;
  name: string;
  priority: Priority;
  condition: string;
  waitTime: string;
  age: number;
  riskScore?: number;
  triageStatus?: TriageStatus;
  vitals?: {
    hr: number;
    bp: string;
    temp: number;
    spo2: number;
  };
}

const triageConfig = {
  immediate: { label: "Immediate", color: "bg-red-600 text-white" },
  urgent: { label: "Urgent", color: "bg-orange-500 text-white" },
  standard: { label: "Standard", color: "bg-green-500 text-white" }
};

export function PatientQueueItem({ 
  id, 
  name, 
  priority, 
  condition, 
  waitTime,
  age,
  riskScore,
  triageStatus,
  vitals
}: PatientQueueItemProps) {
  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-red-600";
    if (score >= 60) return "text-orange-500";
    if (score >= 40) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <Card className="hover-elevate border-l-4 border-l-blue-500" data-testid={`card-patient-${id}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="font-semibold" data-testid={`text-patient-name-${id}`}>{name}</h4>
                <span className="text-xs text-muted-foreground">#{id}</span>
                {triageStatus && (
                  <Badge className={triageConfig[triageStatus].color} variant="secondary">
                    {triageConfig[triageStatus].label}
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">{condition}</p>
              
              {/* AI Risk Score */}
              {riskScore && (
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-3 w-3 text-blue-500" />
                  <span className="text-xs text-muted-foreground">AI Risk Score:</span>
                  <span className={`text-xs font-semibold ${getRiskColor(riskScore)}`}>
                    {riskScore}/100
                  </span>
                </div>
              )}
              
              {/* Vitals */}
              {vitals && (
                <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                  <div className="flex items-center gap-1">
                    <Heart className="h-3 w-3 text-red-500" />
                    <span>{vitals.hr} BPM</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity className="h-3 w-3 text-blue-500" />
                    <span>{vitals.bp}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Thermometer className="h-3 w-3 text-orange-500" />
                    <span>{vitals.temp}°F</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-green-600">SpO2:</span>
                    <span>{vitals.spo2}%</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Age: {age}</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{waitTime}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <PriorityBadge priority={priority} />
            {riskScore && riskScore >= 80 && (
              <Badge variant="destructive" className="text-xs">
                High Risk
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

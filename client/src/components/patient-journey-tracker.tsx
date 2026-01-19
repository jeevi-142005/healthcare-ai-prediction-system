import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, CheckCircle, Circle, ArrowRight } from "lucide-react";

interface PatientJourney {
  id: string;
  name: string;
  stage: 'admission' | 'triage' | 'treatment' | 'discharge';
  progress: number;
  nextStep: string;
  estimatedCompletion: string;
}

interface PatientJourneyTrackerProps {
  patients: PatientJourney[];
}

const stageConfig = {
  admission: { label: "Admission", color: "bg-blue-500", icon: Circle },
  triage: { label: "Triage", color: "bg-yellow-500", icon: Circle },
  treatment: { label: "Treatment", color: "bg-orange-500", icon: Circle },
  discharge: { label: "Discharge", color: "bg-green-500", icon: CheckCircle }
};

export function PatientJourneyTracker({ patients }: PatientJourneyTrackerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="h-5 w-5" />
          Patient Journey Tracker
        </CardTitle>
        <p className="text-sm text-muted-foreground">Real-time progress through care pathway</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {patients.map(patient => {
          const config = stageConfig[patient.stage];
          const Icon = config.icon;
          
          return (
            <div key={patient.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{patient.name}</h4>
                  <p className="text-sm text-muted-foreground">#{patient.id}</p>
                </div>
                <Badge className={`${config.color} text-white`}>
                  <Icon className="h-3 w-3 mr-1" />
                  {config.label}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{patient.progress}%</span>
                </div>
                <Progress value={patient.progress} className="h-2" />
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <span>Next: {patient.nextStep}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{patient.estimatedCompletion}</span>
                </div>
              </div>
              
              {/* Journey Timeline */}
              <div className="flex items-center gap-2 pt-2">
                {Object.entries(stageConfig).map(([stage, config], index) => {
                  const isActive = stage === patient.stage;
                  const isCompleted = Object.keys(stageConfig).indexOf(stage) < Object.keys(stageConfig).indexOf(patient.stage);
                  
                  return (
                    <div key={stage} className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        isCompleted ? 'bg-green-500' : 
                        isActive ? config.color : 
                        'bg-gray-300'
                      }`} />
                      {index < Object.keys(stageConfig).length - 1 && (
                        <div className={`w-8 h-0.5 ${
                          isCompleted ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
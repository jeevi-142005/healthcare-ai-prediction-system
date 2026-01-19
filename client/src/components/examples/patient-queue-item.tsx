import { PatientQueueItem } from '../patient-queue-item'

export default function PatientQueueItemExample() {
  return (
    <div className="w-full max-w-md space-y-2">
      <PatientQueueItem
        id="P001"
        name="John Smith"
        priority="critical"
        condition="Chest pain, difficulty breathing"
        waitTime="5 min"
        age={62}
      />
      <PatientQueueItem
        id="P002"
        name="Sarah Johnson"
        priority="high"
        condition="Severe abdominal pain"
        waitTime="12 min"
        age={45}
      />
    </div>
  )
}

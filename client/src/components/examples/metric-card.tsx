import { MetricCard } from '../metric-card'
import { Users } from 'lucide-react'

export default function MetricCardExample() {
  return (
    <div className="w-80">
      <MetricCard
        title="Total Patients"
        value={234}
        icon={Users}
        trend={{ value: 12, isPositive: true }}
      />
    </div>
  )
}

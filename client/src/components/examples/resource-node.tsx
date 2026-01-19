import { ResourceNode } from '../resource-node'
import { Bed, Ambulance } from 'lucide-react'

export default function ResourceNodeExample() {
  return (
    <div className="w-full max-w-sm space-y-2">
      <ResourceNode
        id="beds"
        type="Hospital Beds"
        icon={Bed}
        status="inuse"
        count={85}
        total={120}
      />
      <ResourceNode
        id="ambulance"
        type="Ambulances"
        icon={Ambulance}
        status="available"
        count={3}
        total={8}
      />
    </div>
  )
}

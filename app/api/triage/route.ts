import { type NextRequest, NextResponse } from "next/server"

type Patient = {
  id: string
  name: string
  severity: "Critical" | "High" | "Medium" | "Low"
  waitMin: number
}

// In-memory mock store for demo
const patients: Patient[] = [
  { id: "p1", name: "Patient A", severity: "Critical", waitMin: 10 },
  { id: "p2", name: "Patient B", severity: "High", waitMin: 20 },
  { id: "p3", name: "Patient C", severity: "Medium", waitMin: 15 },
]

const severityScore: Record<Patient["severity"], number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
}

// Simple scoring: severity first, then wait time
function sortPriority(a: Patient, b: Patient) {
  const s = severityScore[b.severity] - severityScore[a.severity]
  if (s !== 0) return s
  return b.waitMin - a.waitMin
}

export async function GET() {
  const sorted = [...patients].sort(sortPriority)
  return NextResponse.json({ patients: sorted }, { headers: { "Cache-Control": "no-store" } })
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Partial<Patient>
  const p: Patient = {
    id: Math.random().toString(36).slice(2),
    name: body.name || "Unnamed",
    severity: (body.severity as Patient["severity"]) || "Medium",
    waitMin: typeof body.waitMin === "number" ? body.waitMin : 0,
  }
  patients.push(p)
  return NextResponse.json({ ok: true })
}

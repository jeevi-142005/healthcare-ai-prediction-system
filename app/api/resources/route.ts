import { NextResponse } from "next/server"

export async function GET() {
  // Mock dynamic data
  const resources = [
    { name: "ICU Beds", available: 7 + Math.floor(Math.random() * 4), inUse: 12 + Math.floor(Math.random() * 3) },
    { name: "Ventilators", available: 5 + Math.floor(Math.random() * 3), inUse: 2 + Math.floor(Math.random() * 2) },
    { name: "General Beds", available: 30 + Math.floor(Math.random() * 10), inUse: 40 + Math.floor(Math.random() * 5) },
    {
      name: "CT Scanner Slots",
      available: 3 + Math.floor(Math.random() * 2),
      inUse: 5 + Math.floor(Math.random() * 2),
    },
  ]
  const shortages = resources.filter((r) => r.available < r.inUse / 2).map((r) => `${r.name} shortage`)

  return NextResponse.json({ resources, shortages }, { headers: { "Cache-Control": "no-store" } })
}

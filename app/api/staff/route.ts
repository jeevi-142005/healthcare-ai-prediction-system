import { NextResponse } from "next/server"

export async function GET() {
  // Mocked minimal "coverage" plan
  const shifts = [
    "Dr. Smith: 8 AM - 4 PM (ER)",
    "Nurse Jane: 8 AM - 4 PM (ICU)",
    "Dr. Lee: 4 PM - 12 AM (ER)",
    "Nurse Patel: 4 PM - 12 AM (ER)",
  ]
  return NextResponse.json({ shifts }, { headers: { "Cache-Control": "no-store" } })
}

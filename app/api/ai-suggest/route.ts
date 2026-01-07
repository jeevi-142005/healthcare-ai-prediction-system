import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(req: NextRequest) {
  const { request } = (await req.json()) as { request: string }
  // Compose a structured prompt. In production, include real data/context.
  const prompt = `
You are an AI assistant for hospital operations.
Task: ${request}

Return the answer in three sections:
1) Triage: A short prioritized list of 3-5 patients with severity and wait times.
2) Staff: 3-4 staff shift suggestions with times and department.
3) Resources: ICU beds and ventilators counts (numbers only).

Use concise bullet points. Do not include explanations.
`

  // The AI SDK uses the Vercel AI Gateway by default; pass a default model
  const { text } = await generateText({
    model: "openai/gpt-5-mini",
    prompt,
  })

  // Basic parsing into a structured object (naive)
  const triage: string[] = []
  const staff: string[] = []
  const resources: Record<string, number> = {}

  const lines = text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
  let section: "triage" | "staff" | "resources" | null = null
  for (const l of lines) {
    const lower = l.toLowerCase()
    if (lower.startsWith("1") || lower.includes("triage")) section = "triage"
    else if (lower.startsWith("2") || lower.includes("staff")) section = "staff"
    else if (lower.startsWith("3") || lower.includes("resource")) section = "resources"
    else if (l.startsWith("-") || l.startsWith("*")) {
      const item = l.replace(/^[-*]\s*/, "")
      if (section === "triage") triage.push(item)
      else if (section === "staff") staff.push(item)
      else if (section === "resources") {
        const m = item.match(/(icu beds|ventilators)[:\s-]*([0-9]+)/i)
        if (m) {
          resources[m[1].toLowerCase().includes("icu") ? "ICU beds" : "Ventilators"] = Number(m[2])
        }
      }
    }
  }

  // Fallbacks if parsing missed
  if (!resources["ICU beds"]) resources["ICU beds"] = 5
  if (!resources["Ventilators"]) resources["Ventilators"] = 2

  return NextResponse.json({ triage, staff, resources })
}

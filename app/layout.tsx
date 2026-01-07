import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { SiteHeader } from "@/components/site-header"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "AI Healthcare Resource Manager",
  description: "Triage, resources, and staffing with predictive analytics",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={<div>Loading...</div>}>
          <SiteHeader />
          <main className="mx-auto max-w-7xl px-4 py-6 md:px-6">{children}</main>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}

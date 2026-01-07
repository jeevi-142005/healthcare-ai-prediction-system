"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/triage", label: "Triage" },
  { href: "/resources", label: "Resources" },
  { href: "/staff", label: "Staff" },
  { href: "/analytics", label: "Analytics" },
]

export function SiteHeader() {
  const pathname = usePathname()
  return (
    <header className="bg-secondary text-secondary-foreground border-b border-border">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="font-semibold">
          AI Healthcare
          <span className="sr-only">Home</span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                pathname === l.href && "bg-primary text-primary-foreground",
              )}
              aria-current={pathname === l.href ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Users,
  Network,
  Phone,
  Award as IdCard,
  Bell,
  Gift,
  ArrowLeftRight,
  Settings,
  LayoutDashboard,
  Wallet,
  Layers,
  Bot,
  Ticket,
  Megaphone,
} from "lucide-react"

const navItems = [
  { href: "/dashboard", label: "Tableau de Bord", icon: LayoutDashboard },
  { href: "/dashboard/users", label: "Utilisateurs", icon: Users },
  // { href: "/dashboard/bot-users", label: "Utilisateurs Bot", icon: Users },
  { href: "/dashboard/networks", label: "Réseaux", icon: Network },
  { href: "/dashboard/telephones", label: "Téléphones", icon: Phone },
  { href: "/dashboard/user-app-ids", label: "IDs Utilisateur", icon: IdCard },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/bonuses", label: "Bonus", icon: Gift },
  { href: "/dashboard/transactions", label: "Transactions", icon: ArrowLeftRight },
  // { href: "/dashboard/bot-transactions", label: "Transactions Bot", icon: Bot },
  { href: "/dashboard/platforms", label: "Plateformes", icon: Layers },
  // { href: "/dashboard/deposits", label: "Dépôts & Caisses", icon: Wallet },
  { href: "/dashboard/coupons", label: "Coupons", icon: Ticket },
  { href: "/dashboard/advertisements", label: "Annonces", icon: Megaphone },
  { href: "/dashboard/settings", label: "Paramètres", icon: Settings },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

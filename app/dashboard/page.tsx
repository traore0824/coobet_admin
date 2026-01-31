"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ArrowLeftRight,
  Network,
  Users,
  Wallet,
  Bot,
  Gift,
  TrendingUp,
  CreditCard,
  Award,
  Megaphone,
  Ticket,
  UserPlus,
  Share2,
  DollarSign,
} from "lucide-react"
import { useDashboardStats } from "@/hooks/useDashboardStats"

function formatNumber(value: number | undefined | null) {
  if (value === undefined || value === null || Number.isNaN(value)) return "-"
  return new Intl.NumberFormat("fr-FR").format(value)
}

function formatCurrency(value: number | undefined | null) {
  if (value === undefined || value === null || Number.isNaN(value)) return "-"
  return `${formatNumber(value)} FCFA`
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboardStats()

  const stats = data?.dashboard_stats
  const transactionsByApp = stats?.transactions_by_app ?? {}
  const networksCount = Object.keys(transactionsByApp).length
  const volume = data?.volume_transactions
  const userGrowth = data?.user_growth
  const referral = data?.referral_system

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Tableau de Bord</h2>
        <p className="text-muted-foreground">Bienvenue sur le tableau de bord administrateur COOBET</p>
      </div>

      {isError && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          Une erreur est survenue lors du chargement des statistiques.
        </div>
      )}

      {/* Main Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "…" : formatNumber(stats?.total_users)}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading
                ? "Chargement..."
                : `${formatNumber(stats?.active_users)} actifs / ${formatNumber(stats?.inactive_users)} inactifs`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions Total</CardTitle>
            <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "…" : formatNumber(stats?.total_transactions)}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? "Chargement..." : "Toutes transactions confondues"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solde Net</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "…" : formatCurrency(volume?.net_volume)}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading
                ? "Chargement..."
                : `${formatCurrency(volume?.deposits?.total_amount)} dépôts / ${formatCurrency(
                    volume?.withdrawals?.total_amount,
                  )} retraits`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bonus</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "…" : formatCurrency(stats?.total_bonus)}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading ? "Chargement..." : "Bonus distribués"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Bot Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            Statistiques Bot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-muted-foreground">Transactions Bot</p>
              <p className="text-2xl font-bold">
                {isLoading ? "…" : formatNumber(stats?.bot_stats?.total_transactions)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Dépôts Bot</p>
              <p className="text-2xl font-bold">
                {isLoading ? "…" : formatNumber(stats?.bot_stats?.total_deposits)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Retraits Bot</p>
              <p className="text-2xl font-bold">
                {isLoading ? "…" : formatNumber(stats?.bot_stats?.total_withdrawals)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Utilisateurs Bot</p>
              <p className="text-2xl font-bold">
                {isLoading ? "…" : formatNumber(stats?.bot_stats?.total_users)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Volume Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Volume des Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Dépôts</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold">
                {isLoading ? "…" : formatCurrency(volume?.deposits?.total_amount)}
              </p>
              <p className="text-sm text-muted-foreground">
                ({formatNumber(volume?.deposits?.total_count)} transactions)
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Retraits</p>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-bold">
                {isLoading ? "…" : formatCurrency(volume?.withdrawals?.total_amount)}
              </p>
              <p className="text-sm text-muted-foreground">
                ({formatNumber(volume?.withdrawals?.total_count)} transactions)
              </p>
            </div>
          </div>
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">Volume Net</p>
            <p className="text-2xl font-bold text-primary">
              {isLoading ? "…" : formatCurrency(volume?.net_volume)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Statistiques Bizao
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Solde Bizao</p>
            <p className="text-2xl font-bold">
              {isLoading ? "…" : formatCurrency(stats?.balance_bizao)}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Dépôts Bizao</p>
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-bold">
                {isLoading ? "…" : formatCurrency(stats?.deposits_bizao?.amount)}
              </p>
              <p className="text-sm text-muted-foreground">
                ({formatNumber(stats?.deposits_bizao?.count)} transactions)
              </p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Retraits Bizao</p>
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-bold">
                {isLoading ? "…" : formatCurrency(stats?.withdrawals_bizao?.amount)}
              </p>
              <p className="text-sm text-muted-foreground">
                ({formatNumber(stats?.withdrawals_bizao?.count)} transactions)
              </p>
            </div>
          </div>
        </CardContent>
      </Card> */}

      {/* Transactions by App */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Transactions par Application ({networksCount})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Chargement...</p>
          ) : Object.keys(transactionsByApp).length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucune transaction par application</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application</TableHead>
                  <TableHead className="text-right">Nombre</TableHead>
                  <TableHead className="text-right">Montant Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(transactionsByApp).map(([app, data]) => (
                  <TableRow key={app}>
                    <TableCell className="font-medium">{app}</TableCell>
                    <TableCell className="text-right">{formatNumber(data.count)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(data.total_amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* User Growth & Referral */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Croissance des Utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Utilisateurs Actifs</p>
              <p className="text-2xl font-bold">
                {isLoading ? "…" : formatNumber(userGrowth?.active_users_count)}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
              <div>
                <p className="text-sm text-muted-foreground">Bloqués</p>
                <p className="text-xl font-bold">
                  {isLoading ? "…" : formatNumber(userGrowth?.status?.blocked)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Actifs</p>
                <p className="text-xl font-bold">
                  {isLoading ? "…" : formatNumber(userGrowth?.status?.active)}
                </p>
              </div>
            </div>
            <div className="pt-2 border-t">
              <p className="text-sm text-muted-foreground mb-2">Utilisateurs par Source</p>
              <div className="space-y-1">
                {userGrowth?.users_by_source?.map((source) => (
                  <div key={source.source} className="flex justify-between text-sm">
                    <span className="capitalize">{source.source}</span>
                    <span className="font-medium">{formatNumber(source.count)}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Système de Parrainage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Parrainages</p>
              <p className="text-2xl font-bold">
                {isLoading ? "…" : formatNumber(referral?.parrainages_count)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bonus de Parrainage Total</p>
              <p className="text-2xl font-bold">
                {isLoading ? "…" : formatCurrency(referral?.total_referral_bonus)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Taux d'Activation</p>
              <p className="text-2xl font-bold">
                {isLoading ? "…" : `${formatNumber(referral?.activation_rate)}%`}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ads & Coupons */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Récompenses</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "…" : formatCurrency(stats?.rewards?.total)}
            </div>
            <p className="text-xs text-muted-foreground">Total des récompenses</p>
          </CardContent>
        </Card> */}

        {/* <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Décaissements</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "…" : formatCurrency(stats?.disbursements?.amount)}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading
                ? "Chargement..."
                : `${formatNumber(stats?.disbursements?.count)} décaissements`}
            </p>
          </CardContent>
        </Card> */}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publicités</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "…" : formatNumber(stats?.advertisements?.total)}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading
                ? "Chargement..."
                : `${formatNumber(stats?.advertisements?.active)} actives`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Coupons</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "…" : formatNumber(stats?.coupons?.total)}
            </div>
            <p className="text-xs text-muted-foreground">
              {isLoading
                ? "Chargement..."
                : `${formatNumber(stats?.coupons?.active)} actifs`}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

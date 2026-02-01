"use client"

import { useState } from "react"
import { useBonuses, type BonusFilters } from "@/hooks/useBonuses"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Search, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreateBonusDialog } from "@/components/create-bonus-dialog"

export default function BonusesPage() {
  const [filters, setFilters] = useState<BonusFilters>({
    page: 1,
    page_size: 10,
  })
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  const { data: bonusesData, isLoading } = useBonuses(filters)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bonus</h2>
          <p className="text-muted-foreground">Consultez les bonus et récompenses des utilisateurs</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Créer un Bonus
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>Rechercher les bonus</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Rechercher par raison ou utilisateur..."
                  value={filters.search || ""}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value || undefined, page: 1 })}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="user">ID Utilisateur</Label>
              <Input
                id="user"
                placeholder="Filtrer par ID utilisateur..."
                value={filters.user || ""}
                onChange={(e) => setFilters({ ...filters, user: e.target.value || undefined, page: 1 })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Bonus</CardTitle>
          <CardDescription>Total : {bonusesData?.count || 0} bonus</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : bonusesData && bonusesData.results.length > 0 ? (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Raison</TableHead>
                    <TableHead>ID Utilisateur</TableHead>
                    <TableHead>Transaction</TableHead>
                    <TableHead>Créé le</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bonusesData.results.map((bonus) => (
                    <TableRow key={bonus.id}>
                      <TableCell className="font-medium">{bonus.id}</TableCell>
                      <TableCell>
                        <Badge variant="default" className="font-mono">
                          {bonus.amount} FCFA
                        </Badge>
                      </TableCell>
                      <TableCell>{bonus.reason_bonus}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium text-sm">
                            {bonus.user?.first_name} {bonus.user?.last_name}
                          </div>
                          <div className="text-xs text-muted-foreground">{bonus.user?.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{bonus.transaction || "-"}</TableCell>
                      <TableCell>{new Date(bonus.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Page {filters.page} sur {Math.ceil((bonusesData?.count || 0) / (filters.page_size || 10))}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                    disabled={!bonusesData?.previous}
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                    disabled={!bonusesData?.next}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">Aucun bonus trouvé</div>
          )}
        </CardContent>
      </Card>

      <CreateBonusDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
    </div>
  )
}

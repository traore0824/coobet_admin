"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { useTransactions, useCheckTransactionStatus, useChangeTransactionStatus, type Transaction, type TransactionFilters, type TransactionStatusResponse } from "@/hooks/useTransactions"
import { useNetworks } from "@/hooks/useNetworks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, Search, Copy, RefreshCw, MoreHorizontal } from "lucide-react"
import { toast } from "react-hot-toast"
import { CreateTransactionDialog } from "@/components/create-transaction-dialog"
import { ChangeTransactionStatusDialog } from "@/components/change-transaction-status-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function TransactionsPage() {
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    page_size: 10,
  })

  const { data: transactionsData, isLoading } = useTransactions(filters)
  const { data: networks } = useNetworks()
  const queryClient = useQueryClient()
  const checkStatus = useCheckTransactionStatus()

  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [changeStatusDialogOpen, setChangeStatusDialogOpen] = useState(false)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [statusResponse, setStatusResponse] = useState<TransactionStatusResponse['data'] | null>(null)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)

  const handleCheckStatus = (transaction: Transaction) => {
    checkStatus.mutate(transaction.reference, {
      onSuccess: (data) => {
        setStatusResponse(data.data)
        setStatusDialogOpen(true)
        queryClient.invalidateQueries({ queryKey: ["transactions"] })
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.detail || "Erreur lors de la vérification du statut")
      }
    })
  }

  const handleChangeStatus = (transaction: Transaction) => {
    setSelectedTransaction(transaction)
    setChangeStatusDialogOpen(true)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return "default" // Green (success)
      case "failed":
      case "error":
        return "destructive" // Red (error)
      case "pending":
        return "secondary" // Gray/neutral
      case "init_payment":
        return "outline" // Processing
      default:
        return "secondary" // Default fallback
    }
  }

  const getStatusLabel = (status: string): string => {
    switch (status.toLowerCase()) {
      case "success":
        return "Succès"
      case "failed":
      case "error":
        return "Erreur"
      case "pending":
        return "En attente"
      case "init_payment":
        return "En traitement"
      default:
        return status
    }
  }

  const getTypeTransLabel = (type: string): string => {
    switch (type.toLowerCase()) {
      case "deposit":
        return "Dépôt"
      case "withdrawal":
        return "Retrait"
      default:
        return type
    }
  }

  const getTypeTransColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "deposit":
        return "default" // Green/primary
      case "withdrawal":
        return "secondary" // Gray
      default:
        return "secondary"
    }
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copié dans le presse-papiers")
    } catch (error) {
      toast.error("Erreur lors de la copie")
    }
  }

  const getNetworkName = (networkId: number | null) => {
    if (!networkId) return "-"
    const networksList = networks?.results || []
    return networksList.find((n) => n.id === networkId)?.public_name || "-"
  }

  const displayValue = (value: string | number | null | undefined): string => {
    if (value === null || value === undefined || value === "") return "-"
    return String(value)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
          <p className="text-muted-foreground">Gérez les dépôts et retraits des utilisateurs</p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Créer Transaction
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>Rechercher et filtrer les transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Rechercher</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Rechercher par référence ou téléphone..."
                  value={filters.search || ""}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value || undefined })}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type de Transaction</Label>
              <Select
                value={filters.type_trans || "all"}
                onValueChange={(value) => setFilters({ ...filters, type_trans: value === "all" ? undefined : value as "deposit" | "withdrawal" })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les Types</SelectItem>
                  <SelectItem value="deposit">Dépôt</SelectItem>
                  <SelectItem value="withdrawal">Retrait</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={filters.status || "all"}
                onValueChange={(value) => setFilters({ ...filters, status: value === "all" ? undefined : value })}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les Statuts</SelectItem>
                  <SelectItem value="init_payment">En traitement</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="success">Succès</SelectItem>
                  <SelectItem value="failed">Erreur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Select
                value={filters.source || "all"}
                onValueChange={(value) => setFilters({ ...filters, source: value === "all" ? undefined : value as "web" | "mobile" })}
              >
                <SelectTrigger id="source">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les Sources</SelectItem>
                  <SelectItem value="web">Web</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Liste des Transactions</CardTitle>
          <CardDescription>Total : {transactionsData?.count || 0} transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : transactionsData && transactionsData.results.length > 0 ? (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>ID Utilisateur</TableHead>
                    <TableHead>App</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Téléphone</TableHead>
                    <TableHead>Réseau</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Créé</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionsData.results.map((transaction) => {
                    const statusLower = transaction.status?.toLowerCase()
                    const shouldShow = statusLower === "pending" || statusLower === "failed" || statusLower === "init_payment" || statusLower === "error"
                    return (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs">{displayValue(transaction.reference)}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleCopy(transaction.reference)}
                              title="Copier la référence"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{displayValue(transaction.user_app_id)}</Badge>
                            {transaction.user_app_id && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleCopy(transaction.user_app_id)}
                                title="Copier l'ID utilisateur"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {transaction.app_details?.name || displayValue(transaction.app)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getTypeTransColor(transaction.type_trans)}>
                            {getTypeTransLabel(transaction.type_trans)}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold">{displayValue(transaction.amount)} FCFA</TableCell>
                        <TableCell>{displayValue(transaction.phone_number)}</TableCell>
                        <TableCell>{getNetworkName(transaction.network)}</TableCell>
                        <TableCell>
                          <Badge variant={getStatusColor(transaction.status)}>
                            {getStatusLabel(transaction.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {transaction.source ? (
                            <Badge variant="outline">{displayValue(transaction.source)}</Badge>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell>{new Date(transaction.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Ouvrir le menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              {shouldShow && (
                                <DropdownMenuItem
                                  onClick={() => handleCheckStatus(transaction)}
                                  disabled={checkStatus.isPending}
                                >
                                  {checkStatus.isPending ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Vérification...
                                    </>
                                  ) : (
                                    <>
                                      <RefreshCw className="mr-2 h-4 w-4" />
                                      Vérifier le statut
                                    </>
                                  )}
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleChangeStatus(transaction)}>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Changer Statut
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Page {filters.page} sur {Math.ceil((transactionsData?.count || 0) / (filters.page_size || 10))}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                    disabled={!transactionsData?.previous}
                  >
                    Précédent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                    disabled={!transactionsData?.next}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Aucune transaction trouvée
            </div>
          )}
        </CardContent>
      </Card>

      <CreateTransactionDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
      <ChangeTransactionStatusDialog
        open={changeStatusDialogOpen}
        onOpenChange={setChangeStatusDialogOpen}
        transaction={selectedTransaction}
      />


      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Résultat de la vérification</DialogTitle>
            <DialogDescription>
              Statut de la transaction vérifié avec succès
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-3">
              {statusResponse && Object.entries(statusResponse).map(([key, value]) => {
                // Format the key for display
                const formattedKey = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()

                // Skip empty values
                if (value === null || value === undefined || value === "") return null

                // Special handling for status field with badge
                if (key.toLowerCase() === 'status') {
                  return (
                    <div key={key}>
                      <strong>{formattedKey}:</strong>{" "}
                      <Badge variant={getStatusColor(String(value))}>
                        {String(value)}
                      </Badge>
                    </div>
                  )
                }

                // Special formatting for reference-like fields
                if (key.toLowerCase().includes('ref') || key.toLowerCase() === 'transref' || key.toLowerCase() === 'serviceref') {
                  return (
                    <div key={key}>
                      <strong>{formattedKey}:</strong>{" "}
                      <span className="font-mono text-sm">{String(value)}</span>
                    </div>
                  )
                }

                // Special formatting for amount fields
                if (key.toLowerCase() === 'amount') {
                  return (
                    <div key={key}>
                      <strong>{formattedKey}:</strong> {value} FCFA
                    </div>
                  )
                }

                // Default display for other fields
                return (
                  <div key={key}>
                    <strong>{formattedKey}:</strong> {String(value)}
                  </div>
                )
              })}
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setStatusDialogOpen(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

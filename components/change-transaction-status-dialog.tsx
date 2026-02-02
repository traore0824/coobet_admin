"use client"

import { useState, useEffect } from "react"
import { useChangeTransactionStatus, type Transaction } from "@/hooks/useTransactions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface ChangeTransactionStatusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: Transaction | null
}

export function ChangeTransactionStatusDialog({ open, onOpenChange, transaction }: ChangeTransactionStatusDialogProps) {
  const changeStatus = useChangeTransactionStatus()
  const [selectedStatus, setSelectedStatus] = useState<string>("")

  useEffect(() => {
    if (open && transaction) {
      setSelectedStatus(transaction.status)
    }
  }, [open, transaction])

  const handleConfirm = () => {
    if (!transaction || !selectedStatus) return

    changeStatus.mutate(
      {
        reference: transaction.reference,
        status: selectedStatus as "accept" | "error" | "timeouf" | "init_payment" | "pending",
      },
      {
        onSuccess: () => {
          onOpenChange(false)
          setSelectedStatus("")
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Changer le Statut de Transaction</DialogTitle>
          <DialogDescription>
            Sélectionnez le nouveau statut pour cette transaction.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label><strong>Référence:</strong></Label>
            <p className="text-sm font-mono">{transaction?.reference}</p>
          </div>
          <div className="space-y-2">
            <Label><strong>Montant:</strong></Label>
            <p className="text-sm">{transaction?.amount} FCFA</p>
          </div>
          <div className="space-y-2">
            <Label><strong>Statut actuel:</strong></Label>
            <p className="text-sm capitalize">{transaction?.status}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Nouveau statut</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Sélectionnez un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="accept">Accept</SelectItem>
                <SelectItem value="error">Erreur</SelectItem>
                <SelectItem value="timeouf">Timeout</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={changeStatus.isPending}
          >
            Annuler
          </Button>
          <Button onClick={handleConfirm} disabled={changeStatus.isPending || !selectedStatus}>
            {changeStatus.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mise à jour...
              </>
            ) : (
              "Confirmer"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

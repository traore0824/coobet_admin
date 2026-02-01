"use client"

import type React from "react"

import { useState } from "react"
import { useCreateBonus, type CreateBonusInput } from "@/hooks/useBonuses"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

interface CreateBonusDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateBonusDialog({ open, onOpenChange }: CreateBonusDialogProps) {
  const createBonus = useCreateBonus()

  const [formData, setFormData] = useState<CreateBonusInput>({
    email: "",
    amount: 0,
    reason_bonus: "",
    transaction: null,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const submitData: CreateBonusInput = {
      email: formData.email.trim(),
      amount: formData.amount,
      reason_bonus: formData.reason_bonus.trim(),
      transaction: formData.transaction || undefined,
    }

    createBonus.mutate(submitData, {
      onSuccess: () => {
        onOpenChange(false)
        setFormData({
          email: "",
          amount: 0,
          reason_bonus: "",
          transaction: null,
        })
      },
    })
  }

  const isPending = createBonus.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Créer un Bonus</DialogTitle>
          <DialogDescription>Attribuez un bonus à un utilisateur</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email de l'utilisateur *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="user@example.com"
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Montant (FCFA) *</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              value={formData.amount || ""}
              onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              placeholder="5000.00"
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason_bonus">Raison du bonus *</Label>
            <Textarea
              id="reason_bonus"
              value={formData.reason_bonus}
              onChange={(e) => setFormData({ ...formData, reason_bonus: e.target.value })}
              placeholder="Bonus promotionnel"
              required
              disabled={isPending}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transaction">ID Transaction (optionnel)</Label>
            <Input
              id="transaction"
              type="number"
              value={formData.transaction || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  transaction: e.target.value ? parseInt(e.target.value) : null,
                })
              }
              placeholder="123"
              disabled={isPending}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Création...
                </>
              ) : (
                "Créer"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


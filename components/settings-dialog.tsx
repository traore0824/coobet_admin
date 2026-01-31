"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useUpdateSettings, type Settings, type SettingsInput } from "@/hooks/useSettings"
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
import { Switch } from "@/components/ui/switch"
import { Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  settings: Settings
}

export function SettingsDialog({ open, onOpenChange, settings }: SettingsDialogProps) {
  const updateSettings = useUpdateSettings()

  const [formData, setFormData] = useState<SettingsInput>({
    minimum_deposit: "",
    minimum_withdrawal: "",
    bonus_percent: "",
    reward_mini_withdrawal: "",
    whatsapp_phone: null,
    minimum_solde: null,
    referral_bonus: false,
    deposit_reward: false,
    deposit_reward_percent: "",
    min_version: null,
    last_version: null,
    dowload_apk_link: null,
    wave_default_link: null,
    orange_default_link: null,
    mtn_default_link: null,
    telegram: null,
    moov_marchand_phone: null,
    orange_marchand_phone: null,
  })

  useEffect(() => {
    if (settings) {
      setFormData({
        minimum_deposit: settings.minimum_deposit,
        minimum_withdrawal: settings.minimum_withdrawal,
        bonus_percent: settings.bonus_percent,
        reward_mini_withdrawal: settings.reward_mini_withdrawal,
        whatsapp_phone: settings.whatsapp_phone,
        minimum_solde: settings.minimum_solde,
        referral_bonus: settings.referral_bonus,
        deposit_reward: settings.deposit_reward,
        deposit_reward_percent: settings.deposit_reward_percent,
        min_version: settings.min_version,
        last_version: settings.last_version,
        dowload_apk_link: settings.dowload_apk_link,
        wave_default_link: settings.wave_default_link,
        orange_default_link: settings.orange_default_link,
        mtn_default_link: settings.mtn_default_link,
        telegram: settings.telegram,
        moov_marchand_phone: settings.moov_marchand_phone,
        orange_marchand_phone: settings.orange_marchand_phone,
      })
    }
  }, [settings])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Ensure all fields including booleans are sent
    updateSettings.mutate(formData, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!w-[95vw] !max-w-[91vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modifier les Paramètres</DialogTitle>
          <DialogDescription>Mettez à jour les paramètres de configuration de la plateforme</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs defaultValue="limits" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="limits">Limites</TabsTrigger>
              <TabsTrigger value="rewards">Récompenses</TabsTrigger>
              <TabsTrigger value="version">Version</TabsTrigger>
              <TabsTrigger value="links">Liens</TabsTrigger>
            </TabsList>

            <TabsContent value="limits" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* <div className="space-y-2">
                  <Label htmlFor="minimum_deposit">Dépôt Minimum (FCFA) *</Label>
                  <Input
                    id="minimum_deposit"
                    type="number"
                    step="0.01"
                    value={formData.minimum_deposit}
                    onChange={(e) => setFormData({ ...formData, minimum_deposit: e.target.value })}
                    required
                    disabled={updateSettings.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minimum_withdrawal">Retrait Minimum (FCFA) *</Label>
                  <Input
                    id="minimum_withdrawal"
                    type="number"
                    step="0.01"
                    value={formData.minimum_withdrawal}
                    onChange={(e) => setFormData({ ...formData, minimum_withdrawal: e.target.value })}
                    required
                    disabled={updateSettings.isPending}
                  />
                </div> */}

                <div className="space-y-2">
                  <Label htmlFor="reward_mini_withdrawal">Retrait Minimum Récompense (FCFA) *</Label>
                  <Input
                    id="reward_mini_withdrawal"
                    type="number"
                    step="0.01"
                    value={formData.reward_mini_withdrawal}
                    onChange={(e) => setFormData({ ...formData, reward_mini_withdrawal: e.target.value })}
                    required
                    disabled={updateSettings.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minimum_solde">Solde Minimum (FCFA)</Label>
                  <Input
                    id="minimum_solde"
                    type="number"
                    step="0.01"
                    value={formData.minimum_solde || ""}
                    onChange={(e) => setFormData({ ...formData, minimum_solde: e.target.value || null })}
                    disabled={updateSettings.isPending}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rewards" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bonus_percent">Pourcentage de parrainage*</Label>
                  <Input
                    id="bonus_percent"
                    type="number"
                    step="0.01"
                    value={formData.bonus_percent}
                    onChange={(e) => setFormData({ ...formData, bonus_percent: e.target.value })}
                    required
                    disabled={updateSettings.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deposit_reward_percent"> Pourcentage de bonus*</Label>
                  <Input
                    id="deposit_reward_percent"
                    type="number"
                    step="0.01"
                    value={formData.deposit_reward_percent}
                    onChange={(e) => setFormData({ ...formData, deposit_reward_percent: e.target.value })}
                    required
                    disabled={updateSettings.isPending}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="referral_bonus">Parrainage  </Label>
                  <Switch
                    id="referral_bonus"
                    checked={formData.referral_bonus}
                    onCheckedChange={(checked) => setFormData({ ...formData, referral_bonus: checked })}
                    disabled={updateSettings.isPending}
                  />
                </div>

                <div className="flex items-center justify-between space-x-2">
                  <Label htmlFor="deposit_reward">Bonus </Label>
                  <Switch
                    id="deposit_reward"
                    checked={formData.deposit_reward}
                    onCheckedChange={(checked) => setFormData({ ...formData, deposit_reward: checked })}
                    disabled={updateSettings.isPending}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="version" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="min_version">Version Minimale</Label>
                  <Input
                    id="min_version"
                    value={formData.min_version || ""}
                    onChange={(e) => setFormData({ ...formData, min_version: e.target.value || null })}
                    placeholder="1.0.0"
                    disabled={updateSettings.isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_version">Dernière Version</Label>
                  <Input
                    id="last_version"
                    value={formData.last_version || ""}
                    onChange={(e) => setFormData({ ...formData, last_version: e.target.value || null })}
                    placeholder="1.0.0"
                    disabled={updateSettings.isPending}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="dowload_apk_link">Lien de Téléchargement APK</Label>
                  <Input
                    id="dowload_apk_link"
                    type="url"
                    value={formData.dowload_apk_link || ""}
                    onChange={(e) => setFormData({ ...formData, dowload_apk_link: e.target.value || null })}
                    placeholder="https://..."
                    disabled={updateSettings.isPending}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="links" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp_phone">Téléphone WhatsApp</Label>
                  <Input
                    id="whatsapp_phone"
                    value={formData.whatsapp_phone || ""}
                    onChange={(e) => setFormData({ ...formData, whatsapp_phone: e.target.value || null })}
                    placeholder="2250700000000"
                    disabled={updateSettings.isPending}
                  />
                </div>

                {/* <div className="space-y-2">
                  <Label htmlFor="wave_default_link">Lien Wave</Label>
                  <Input
                    id="wave_default_link"
                    type="url"
                    value={formData.wave_default_link || ""}
                    onChange={(e) => setFormData({ ...formData, wave_default_link: e.target.value || null })}
                    placeholder="https://pay.wave.com/..."
                    disabled={updateSettings.isPending}
                  />
                </div> */}

                {/* <div className="space-y-2">
                  <Label htmlFor="orange_default_link">Lien Orange</Label>
                  <Input
                    id="orange_default_link"
                    type="url"
                    value={formData.orange_default_link || ""}
                    onChange={(e) => setFormData({ ...formData, orange_default_link: e.target.value || null })}
                    placeholder="https://..."
                    disabled={updateSettings.isPending}
                  />
                </div> */}

                {/* <div className="space-y-2">
                  <Label htmlFor="mtn_default_link">Lien MTN</Label>
                  <Input
                    id="mtn_default_link"
                    type="url"
                    value={formData.mtn_default_link || ""}
                    onChange={(e) => setFormData({ ...formData, mtn_default_link: e.target.value || null })}
                    placeholder="https://..."
                    disabled={updateSettings.isPending}
                  />
                </div> */}

                <div className="space-y-2">
                  <Label htmlFor="telegram">Telegram</Label>
                  <Input
                    id="telegram"
                    type="text"
                    value={formData.telegram || ""}
                    onChange={(e) => setFormData({ ...formData, telegram: e.target.value || null })}
                    placeholder="nom_utilisateur"
                    disabled={updateSettings.isPending}
                  />
                </div>

                {/* <div className="space-y-2">
                  <Label htmlFor="moov_marchand_phone">Téléphone Marchand Moov</Label>
                  <Input
                    id="moov_marchand_phone"
                    value={formData.moov_marchand_phone || ""}
                    onChange={(e) => setFormData({ ...formData, moov_marchand_phone: e.target.value || null })}
                    placeholder="2250700000000"
                    disabled={updateSettings.isPending}
                  />
                </div> */}

                {/* <div className="space-y-2">
                  <Label htmlFor="orange_marchand_phone">Téléphone Marchand Orange</Label>
                  <Input
                    id="orange_marchand_phone"
                    value={formData.orange_marchand_phone || ""}
                    onChange={(e) => setFormData({ ...formData, orange_marchand_phone: e.target.value || null })}
                    placeholder="2250700000000"
                    disabled={updateSettings.isPending}
                  />
                </div> */}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={updateSettings.isPending}>
              Annuler
            </Button>
            <Button type="submit" disabled={updateSettings.isPending}>
              {updateSettings.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Mise à jour...
                </>
              ) : (
                "Mettre à jour"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}


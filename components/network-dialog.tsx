"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useCreateNetwork, useUpdateNetwork, type Network, type NetworkInput } from "@/hooks/useNetworks"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Upload, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import api from "@/lib/axios"
import { toast } from "react-hot-toast"

const NETWORK_CHOICES = [
  { value: "mtn", label: "MTN" },
  { value: "moov", label: "MOOV" },
  { value: "card", label: "Cart" },
  { value: "sbin", label: "Celtis" },
  { value: "orange", label: "Orange" },
  { value: "wave", label: "Wave" },
  { value: "togocom", label: "Togocom" },
  { value: "airtel", label: "Airtel" },
  { value: "mpesa", label: "Mpesa" },
  { value: "afrimoney", label: "Afrimoney" },
]

const API_CHOICES = [
  { value: "connect", label: "COOBET Connect" },
]

interface NetworkDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  network?: Network
}

export function NetworkDialog({ open, onOpenChange, network }: NetworkDialogProps) {
  const createNetwork = useCreateNetwork()
  const updateNetwork = useUpdateNetwork()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<NetworkInput>({
    name: "",
    placeholder: "",
    public_name: "",
    country_code: "",
    indication: "",
    image: "",
    withdrawal_message: null,
    deposit_api: "connect",
    withdrawal_api: "connect",
    payment_by_link: false,
    otp_required: false,
    enable: true,
    deposit_message: "",
    active_for_deposit: true,
    active_for_with: true,
  })

  const [preview, setPreview] = useState<string>("")
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (network) {
      setFormData({
        name: network.name,
        placeholder: network.placeholder,
        public_name: network.public_name,
        country_code: network.country_code,
        indication: network.indication,
        image: network.image,
        withdrawal_message: network.withdrawal_message,
        deposit_api: network.deposit_api,
        withdrawal_api: network.withdrawal_api,
        payment_by_link: network.payment_by_link,
        otp_required: network.otp_required,
        enable: network.enable,
        deposit_message: network.deposit_message,
        active_for_deposit: network.active_for_deposit,
        active_for_with: network.active_for_with,
      })
      setPreview(network.image)
    } else {
      setFormData({
        name: "",
        placeholder: "",
        public_name: "",
        country_code: "",
        indication: "",
        image: "",
        withdrawal_message: null,
        deposit_api: "connect",
        withdrawal_api: "connect",
        payment_by_link: false,
        otp_required: false,
        enable: true,
        deposit_message: "",
        active_for_deposit: true,
        active_for_with: true,
      })
      setPreview("")
    }
  }, [network])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner un fichier image")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La taille de l'image doit être inférieure à 5MB")
      return
    }

    setIsUploading(true)

    try {
      const formDataUpload = new FormData()
      formDataUpload.append("file", file)

      const response = await api.post("/mobcash/upload", formDataUpload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })

      const imageUrl = response.data.file
      if (!imageUrl) {
        throw new Error("La réponse de l'API ne contient pas de clé 'file'")
      }
      setFormData({ ...formData, image: imageUrl })
      setPreview(imageUrl)
      toast.success("Image téléchargée avec succès")
    } catch (error: any) {
      toast.error(error.response?.data?.detail || error.response?.data?.error || "Erreur lors du téléchargement de l'image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: "" })
    setPreview("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate image is uploaded for new networks
    if (!network && !formData.image) {
      toast.error("Veuillez télécharger une image")
      return
    }

    if (network) {
      updateNetwork.mutate(
        { id: network.id, data: formData },
        {
          onSuccess: () => onOpenChange(false),
        },
      )
    } else {
      createNetwork.mutate(formData, {
        onSuccess: () => {
          onOpenChange(false)
          setFormData({
            name: "",
            placeholder: "",
            public_name: "",
            country_code: "",
            indication: "",
            image: "",
            withdrawal_message: null,
            deposit_api: "connect",
            withdrawal_api: "connect",
            payment_by_link: false,
            otp_required: false,
            enable: true,
            deposit_message: "",
            active_for_deposit: true,
            active_for_with: true,
          })
          setPreview("")
        },
      })
    }
  }

  const isPending = createNetwork.isPending || updateNetwork.isPending || isUploading

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{network ? "Modifier le Réseau" : "Créer un Réseau"}</DialogTitle>
          <DialogDescription>
            {network ? "Modifiez les détails du réseau ci-dessous." : "Ajoutez un nouveau réseau de paiement au système."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Réseau *</Label>
              <Select
                value={formData.name}
                onValueChange={(value) => setFormData({ ...formData, name: value })}
                disabled={isPending}
              >
                <SelectTrigger id="name">
                  <SelectValue placeholder="Sélectionner un réseau" />
                </SelectTrigger>
                <SelectContent>
                  {NETWORK_CHOICES.map((network) => (
                    <SelectItem key={network.value} value={network.value}>
                      {network.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="public_name">Nom Public *</Label>
              <Input
                id="public_name"
                value={formData.public_name}
                onChange={(e) => setFormData({ ...formData, public_name: e.target.value })}
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="placeholder">Placeholder *</Label>
              <Input
                id="placeholder"
                value={formData.placeholder}
                onChange={(e) => setFormData({ ...formData, placeholder: e.target.value })}
                placeholder="07XXXXXXXX"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country_code">Code Pays *</Label>
              <Input
                id="country_code"
                value={formData.country_code}
                onChange={(e) => setFormData({ ...formData, country_code: e.target.value })}
                placeholder="CI"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="indication">Indication *</Label>
              <Input
                id="indication"
                value={formData.indication}
                onChange={(e) => setFormData({ ...formData, indication: e.target.value })}
                placeholder="225"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image *</Label>
              <div className="space-y-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="image-upload"
                  disabled={isPending}
                />
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isPending}
                    className="w-full"
                  >
                    {isUploading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Téléchargement...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        {preview ? "Changer l'image" : "Télécharger une image"}
                      </>
                    )}
                  </Button>
                  {preview && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleRemoveImage}
                      disabled={isPending}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {preview && (
                  <div className="relative mt-2">
                    <img src={preview} alt="Preview" className="h-32 w-32 object-cover rounded-md border" />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deposit_api">API de Dépôt *</Label>
              <Select
                value={formData.deposit_api}
                onValueChange={(value) => setFormData({ ...formData, deposit_api: value })}
                disabled={isPending}
              >
                <SelectTrigger id="deposit_api">
                  <SelectValue placeholder="Sélectionner une API" />
                </SelectTrigger>
                <SelectContent>
                  {API_CHOICES.map((api) => (
                    <SelectItem key={api.value} value={api.value}>
                      {api.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="withdrawal_api">API de Retrait *</Label>
              <Select
                value={formData.withdrawal_api}
                onValueChange={(value) => setFormData({ ...formData, withdrawal_api: value })}
                disabled={isPending}
              >
                <SelectTrigger id="withdrawal_api">
                  <SelectValue placeholder="Sélectionner une API" />
                </SelectTrigger>
                <SelectContent>
                  {API_CHOICES.map((api) => (
                    <SelectItem key={api.value} value={api.value}>
                      {api.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="deposit_message">Message de Dépôt</Label>
            <Textarea
              id="deposit_message"
              value={formData.deposit_message}
              onChange={(e) => setFormData({ ...formData, deposit_message: e.target.value })}
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="withdrawal_message">Message de Retrait</Label>
            <Textarea
              id="withdrawal_message"
              value={formData.withdrawal_message || ""}
              onChange={(e) => setFormData({ ...formData, withdrawal_message: e.target.value || null })}
              disabled={isPending}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="enable">Activer</Label>
              <Switch
                id="enable"
                checked={formData.enable}
                onCheckedChange={(checked) => setFormData({ ...formData, enable: checked })}
                disabled={isPending}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="payment_by_link">Paiement par Lien</Label>
              <Switch
                id="payment_by_link"
                checked={formData.payment_by_link}
                onCheckedChange={(checked) => setFormData({ ...formData, payment_by_link: checked })}
                disabled={isPending}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="otp_required">OTP Requis</Label>
              <Switch
                id="otp_required"
                checked={formData.otp_required}
                onCheckedChange={(checked) => setFormData({ ...formData, otp_required: checked })}
                disabled={isPending}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="active_for_deposit">Actif pour Dépôt</Label>
              <Switch
                id="active_for_deposit"
                checked={formData.active_for_deposit}
                onCheckedChange={(checked) => setFormData({ ...formData, active_for_deposit: checked })}
                disabled={isPending}
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="active_for_with">Actif pour Retrait</Label>
              <Switch
                id="active_for_with"
                checked={formData.active_for_with}
                onCheckedChange={(checked) => setFormData({ ...formData, active_for_with: checked })}
                disabled={isPending}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {network ? "Mise à jour..." : "Création..."}
                </>
              ) : network ? (
                "Mettre à jour le Réseau"
              ) : (
                "Créer le Réseau"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

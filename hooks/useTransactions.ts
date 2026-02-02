"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"
import { toast } from "react-hot-toast"

export interface TransactionAppDetails {
  id: string
  name: string
  image: string | null
  enable: boolean
  deposit_tuto_link: string | null
  withdrawal_tuto_link: string | null
  why_withdrawal_fail: string | null
  order: number | null
  city: string | null
  street: string | null
  minimun_deposit: number
  max_deposit: number
  minimun_with: number
  max_win: number
  active_for_deposit: boolean
  active_for_with: boolean
}

export interface Transaction {
  id: number
  amount: number
  phone_number: string
  app_details: TransactionAppDetails | null
  app: string
  user_app_id: string
  network: number
  source: "web" | "mobile"
  type_trans: "deposit" | "withdrawal"
  status: "pending" | "success" | "failed" | "init_payment"
  reference: string
  created_at: string
  validated_at?: string
  error_message?: string
}

export interface TransactionsResponse {
  count: number
  next: string | null
  previous: string | null
  results: Transaction[]
}

export interface TransactionFilters {
  page?: number
  page_size?: number
  type_trans?: "deposit" | "withdrawal"
  status?: string
  search?: string
  app?: string
  source?: "web" | "mobile"
}

export function useTransactions(filters: TransactionFilters = {}) {
  return useQuery({
    queryKey: ["transactions", filters],
    queryFn: async () => {
      const params: Record<string, string | number> = {}
      if (filters.page) params.page = filters.page
      if (filters.page_size) params.page_size = filters.page_size
      if (filters.type_trans) params.type_trans = filters.type_trans
      if (filters.status) params.status = filters.status
      if (filters.search) params.search = filters.search
      if (filters.app) params.app = filters.app
      if (filters.source) params.source = filters.source

      const res = await api.get<TransactionsResponse>("/mobcash/transaction-history", { params })
      return res.data
    },
  })
}

export interface CreateDepositInput {
  amount: number
  phone_number: string
  app: string
  user_app_id: string
  network: number
  source: "web" | "mobile"
}

export interface CreateWithdrawalInput {
  amount: number
  phone_number: string
  app: string
  user_app_id: string
  network: number
  withdriwal_code: string
  source: "web" | "mobile"
}

export function useCreateDeposit() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateDepositInput) => {
      const res = await api.post<Transaction>("/mobcash/create-deposit", data)
      return res.data
    },
    onSuccess: () => {
      toast.success("Dépôt créé avec succès!")
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries({ queryKey: ["deposits"] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || "Erreur lors de la création du dépôt")
    },
  })
}

export function useCreateWithdrawal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateWithdrawalInput) => {
      const res = await api.post<Transaction>("/mobcash/create-withdrawal", data)
      return res.data
    },
    onSuccess: () => {
      toast.success("Retrait créé avec succès!")
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
      queryClient.invalidateQueries({ queryKey: ["deposits"] })
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.detail || "Erreur lors de la création du retrait")
    },
  })
}

export interface TransactionStatusResponse {
  code: number
  data: Record<string, any>
}

export interface ChangeTransactionStatusInput {
  status?: "accept" | "error" | "timeouf" | "init_payment" | "pending"
  reference: string
}

export function useCheckTransactionStatus() {
  return useMutation({
    mutationFn: async (reference: string) => {
      const res = await api.get<TransactionStatusResponse>(`/mobcash/show-transaction-status?reference=${reference}`)
      return res.data
    },
  })
}

export function useChangeTransactionStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: ChangeTransactionStatusInput) => {
      const res = await api.post("/mobcash/change-transaction-status-manuel", data)
      return res.data
    },
    onSuccess: () => {
      toast.success("Statut de la transaction mis à jour avec succès!")
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
  })
}

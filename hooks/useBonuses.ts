"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"
import { toast } from "react-hot-toast"

export interface Bonus {
  id: number
  created_at: string
  amount: string
  reason_bonus: string
  transaction: number | null
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
}

export interface BonusesResponse {
  count: number
  next: string | null
  previous: string | null
  results: Bonus[]
}

export interface BonusFilters {
  page?: number
  page_size?: number
  search?: string
  user?: string
}

export function useBonuses(filters: BonusFilters = {}) {
  return useQuery({
    queryKey: ["bonuses", filters],
    queryFn: async () => {
      const params: Record<string, string | number> = {}
      if (filters.page) params.page = filters.page
      if (filters.page_size) params.page_size = filters.page_size
      if (filters.search) params.search = filters.search
      if (filters.user) params.user = filters.user

      const res = await api.get<BonusesResponse>("/mobcash/bonus", { params })
      return res.data
    },
  })
}

export interface CreateBonusInput {
  email: string
  amount: number
  reason_bonus: string
  transaction?: number | null
}

export function useCreateBonus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (data: CreateBonusInput) => {
      const res = await api.post<Bonus>("/mobcash/create-bonus", data)
      return res.data
    },
    onSuccess: () => {
      toast.success("Bonus créé avec succès!")
      queryClient.invalidateQueries({ queryKey: ["bonuses"] })
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.email?.[0] ||
        error.response?.data?.amount?.[0] ||
        error.response?.data?.reason_bonus?.[0] ||
        error.response?.data?.detail ||
        "Erreur lors de la création du bonus"
      toast.error(errorMessage)
    },
  })
}

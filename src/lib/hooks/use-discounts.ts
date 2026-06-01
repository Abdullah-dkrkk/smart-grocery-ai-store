import { useMutation, useQuery } from "@tanstack/react-query"
import { discountsApi, type ValidateCodeParams } from "@/lib/api/discounts"
import type { Discount, DiscountValidation } from "@/lib/api/types"

export function useValidateDiscount() {
  return useMutation({
    mutationFn: (params: ValidateCodeParams) => discountsApi.validateCode(params),
  })
}

export function useApplyDiscount() {
  return useMutation({
    mutationFn: (params: ValidateCodeParams) => discountsApi.applyCode(params),
  })
}

export function useAdminDiscounts() {
  return useQuery<Discount[]>({
    queryKey: ["admin-discounts"],
    queryFn: async () => {
      const res = await discountsApi.adminList()
      return res.data
    },
  })
}

export function useAdminDiscount(id: number) {
  return useQuery<Discount>({
    queryKey: ["admin-discount", id],
    queryFn: async () => {
      const res = await discountsApi.adminDetail(id)
      return res.data
    },
    enabled: !!id,
  })
}

export function useCreateDiscount() {
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => discountsApi.adminCreate(data),
  })
}

export function useUpdateDiscount() {
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => discountsApi.adminUpdate(id, data),
  })
}

export function useDeleteDiscount() {
  return useMutation({
    mutationFn: (id: number) => discountsApi.adminDelete(id),
  })
}

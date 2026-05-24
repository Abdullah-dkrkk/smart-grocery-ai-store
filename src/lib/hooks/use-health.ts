import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { healthApi, type HealthProfileInput } from "@/lib/api/health"
import type { HealthProfile } from "@/lib/api/types"

export function useHealthProfile() {
  return useQuery<HealthProfile>({
    queryKey: ["health-profile"],
    queryFn: async () => {
      const res = await healthApi.getProfile()
      return res.data
    },
  })
}

export function useUpdateHealthProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: HealthProfileInput) => healthApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["health-profile"] })
    },
  })
}

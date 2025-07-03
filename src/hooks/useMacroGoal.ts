import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { MacroGoal } from "@/types/macro-goal";
import { fetchMacroGoal, setMacroGoal } from '@/api/macroGoal';

export function useMacroGoal() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<MacroGoal | null>({
    queryKey: ['macroGoal'],
    queryFn: fetchMacroGoal,
  });

  const mutation = useMutation({
    mutationFn: setMacroGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['macroGoal'] });
    },
  });

  return {
    macroGoal: data,
    isLoading,
    error,
    setMacroGoal: mutation.mutateAsync,
    isSetting: mutation.isPending,
  };
} 
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { FoodEntry } from "@/types/food-entry";
import {
  fetchFoodEntries,
  addFoodEntry,
  updateFoodEntry,
  deleteFoodEntry,
} from '@/api/foodEntry';

export function useFoodEntries(date: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<FoodEntry[]>({
    queryKey: ['foodEntries', date],
    queryFn: () => fetchFoodEntries(date),
  });

  const addMutation = useMutation({
    mutationFn: addFoodEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodEntries', date] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateFoodEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodEntries', date] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFoodEntry,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodEntries', date] });
    },
  });

  return {
    foodEntries: data ?? [],
    isLoading,
    error,
    addFoodEntry: addMutation.mutateAsync,
    updateFoodEntry: updateMutation.mutateAsync,
    deleteFoodEntry: deleteMutation.mutateAsync,
    isAdding: addMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
} 
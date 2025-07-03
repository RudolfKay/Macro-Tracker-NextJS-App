import type { FoodEntry, FoodEntryInput } from "@/types/food-entry";

export async function fetchFoodEntries(date: string): Promise<FoodEntry[]> {
  const res = await fetch(`/api/food-entry?date=${date}`);
  const data = await res.json();
  return data.entries ?? [];
}

export async function addFoodEntry(entry: FoodEntryInput) {
  const res = await fetch('/api/food-entry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to add food entry');
  return (await res.json()).entry;
}

export async function updateFoodEntry(entry: FoodEntry) {
  const res = await fetch('/api/food-entry', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to update food entry');
  return (await res.json()).entry;
}

export async function deleteFoodEntry(id: string) {
  const res = await fetch('/api/food-entry', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete food entry');
  return (await res.json()).success;
} 
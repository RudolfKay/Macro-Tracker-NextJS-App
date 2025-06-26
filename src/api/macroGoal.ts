export interface MacroGoal {
  id: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export async function fetchMacroGoal(): Promise<MacroGoal | null> {
  const res = await fetch('/api/macro-goal');
  const data = await res.json();
  return data.goal ?? null;
}

export async function setMacroGoal(goal: Omit<MacroGoal, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>) {
  const res = await fetch('/api/macro-goal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(goal),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to set macro goal');
  return (await res.json()).goal;
} 
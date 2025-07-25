"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Utensils, Trash2, Edit2 } from "lucide-react"
import React, { useState, useEffect } from "react"
import type { FoodEntry } from "@/types/food-entry"
import { DashboardFormField } from "@/components/dashboard/DashboardFormField"
import { FoodSearchDropdown } from "@/components/dashboard/FoodSearchDropdown"

type FoodLogCardProps = {
  foodEntries: FoodEntry[]
  addFoodEntry: (entry: Omit<FoodEntry, "id" | "time" | "createdAt"> & { time: string; date: string }) => Promise<void>
  deleteFoodEntry: (id: string) => Promise<void>
  isAdding: boolean
  isDeleting: boolean
  currentDate: string
  updateFoodEntry: (entry: FoodEntry) => Promise<void>
}

export const FoodLogCard: React.FC<FoodLogCardProps> = ({
  foodEntries,
  addFoodEntry,
  deleteFoodEntry,
  isAdding,
  isDeleting,
  currentDate,
  updateFoodEntry,
}) => {
  const [isAddingFood, setIsAddingFood] = useState(false)
  const [newFood, setNewFood] = useState({ name: "", protein: "", carbs: "", fat: "", calories: "" })
  const [formError, setFormError] = useState<string | null>(null)
  const [editingEntry, setEditingEntry] = useState<FoodEntry | null>(null)
  const [editFood, setEditFood] = useState({ name: "", protein: "", carbs: "", fat: "", calories: "" })
  const [editError, setEditError] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [units, setUnits] = useState(1)
  const [editUnits, setEditUnits] = useState(1)

  useEffect(() => {
    if (isAddingFood) {
      setUnits(1);
      setNewFood({ name: "", protein: "", carbs: "", fat: "", calories: "" });
    }
  }, [isAddingFood]);

  const handleIncrementUnits = () => setUnits(u => u + 1)
  const handleDecrementUnits = () => setUnits(u => (u > 1 ? u - 1 : 1))
  const handleUnitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(1, Number(e.target.value) || 1)
    setUnits(val)
  }
  const handleEditIncrementUnits = () => setEditUnits(u => u + 1)
  const handleEditDecrementUnits = () => setEditUnits(u => (u > 1 ? u - 1 : 1))
  const handleEditUnitsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(1, Number(e.target.value) || 1)
    setEditUnits(val)
  }
  const getTotal = (val: string) => {
    const num = Number(val)
    if (isNaN(num)) return ""
    return (num * units).toFixed(2)
  }
  const getEditTotal = (val: string) => {
    const num = Number(val)
    if (isNaN(num)) return ""
    return (num * editUnits).toFixed(2)
  }

  const handleAddFood = async () => {
    if (
      Number(newFood.protein) < 0 ||
      Number(newFood.carbs) < 0 ||
      Number(newFood.fat) < 0 ||
      Number(newFood.calories) < 0
    ) {
      setFormError("All food entry values must be zero or positive numbers.")
      return
    }
    setFormError(null)
    await addFoodEntry({
      name: newFood.name,
      protein: Number(newFood.protein),
      carbs: Number(newFood.carbs),
      fat: Number(newFood.fat),
      calories: Number(newFood.calories),
      units,
      time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
      date: currentDate,
    })
    setNewFood({ name: "", protein: "", carbs: "", fat: "", calories: "" })
    setIsAddingFood(false)
  }

  const handleEditClick = (entry: FoodEntry) => {
    setEditingEntry(entry)
    setEditFood({
      name: entry.name,
      protein: entry.protein.toString(),
      carbs: entry.carbs.toString(),
      fat: entry.fat.toString(),
      calories: entry.calories.toString(),
    })
    setEditUnits(entry.units ?? 1);
    setEditError(null)
  }

  const handleEditSave = async () => {
    if (
      Number(editFood.protein) < 0 ||
      Number(editFood.carbs) < 0 ||
      Number(editFood.fat) < 0 ||
      Number(editFood.calories) < 0
    ) {
      setEditError("All food entry values must be zero or positive numbers.")
      return
    }
    setEditError(null)
    setIsUpdating(true)
    await updateFoodEntry({
      id: editingEntry!.id,
      name: editFood.name,
      protein: Number(editFood.protein),
      carbs: Number(editFood.carbs),
      fat: Number(editFood.fat),
      calories: Number(editFood.calories),
      units: editUnits,
      time: editingEntry!.time,
      date: currentDate,
      createdAt: editingEntry!.createdAt,
    })
    setIsUpdating(false)
    setEditingEntry(null)
  }

  return (
    <Card className="border border-emerald-300 dark:border-emerald-800 shadow-lg shadow-emerald-900/10 p-4 sm:p-6">
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Utensils className="h-5 w-5 text-emerald-500" />
            Food Log
          </CardTitle>
          <CardDescription>Track your meals and snacks</CardDescription>
        </div>
        <Dialog open={isAddingFood} onOpenChange={setIsAddingFood}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Food
            </Button>
          </DialogTrigger>
          <DialogContent aria-describedby="add-food-description">
            <DialogHeader>
              <DialogTitle>Add Food Entry</DialogTitle>
              <DialogDescription id="add-food-description">Enter the nutritional information for your food</DialogDescription>
            </DialogHeader>
            {formError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center font-semibold">
                {formError}
              </div>
            )}
            <div className="grid gap-4 py-2">
              <FoodSearchDropdown
                value={newFood.name}
                onChange={e => setNewFood({ ...newFood, name: e.target.value })}
                onSelect={macros => setNewFood(macros)}
              />
              <div className="text-xs text-muted-foreground mt-2 mb-1">Macros shown are <b>per 100g</b>.</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DashboardFormField
                  label="Protein (g)"
                  id="protein"
                  type="number"
                  value={newFood.protein}
                  onChange={e => setNewFood({ ...newFood, protein: e.target.value })}
                  placeholder="0"
                  min={0}
                  required
                />
                <DashboardFormField
                  label="Carbs (g)"
                  id="carbs"
                  type="number"
                  value={newFood.carbs}
                  onChange={e => setNewFood({ ...newFood, carbs: e.target.value })}
                  placeholder="0"
                  min={0}
                  required
                />
                <DashboardFormField
                  label="Fat (g)"
                  id="fat"
                  type="number"
                  value={newFood.fat}
                  onChange={e => setNewFood({ ...newFood, fat: e.target.value })}
                  placeholder="0"
                  min={0}
                  required
                />
                <DashboardFormField
                  label="Calories"
                  id="calories"
                  type="number"
                  value={newFood.calories}
                  onChange={e => setNewFood({ ...newFood, calories: e.target.value })}
                  placeholder="0"
                  min={0}
                  required
                />
              </div>
              <div className="flex items-center gap-2 mt-2 mb-2">
                <label className="flex items-center gap-1 text-xs text-muted-foreground">
                  Units:
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-6 w-6 p-0 ml-1"
                    onClick={handleDecrementUnits}
                    aria-label="Decrease units"
                    disabled={units <= 1}
                  >
                    –
                  </Button>
                  <input
                    type="number"
                    min={1}
                    value={units}
                    onChange={handleUnitsChange}
                    className="w-12 px-1 py-0.5 border rounded text-center text-xs bg-white dark:bg-neutral-900 border-emerald-300 dark:border-emerald-800"
                    aria-label="Number of 100g units"
                    style={{ MozAppearance: 'textfield' }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-6 w-6 p-0"
                    onClick={handleIncrementUnits}
                    aria-label="Increase units"
                  >
                    +
                  </Button>
                  <span className="ml-1">x 100g</span>
                </label>
                <span className="text-xs text-muted-foreground ml-4"><b>Total for {units * 100}g:</b> P: {getTotal(newFood.protein)}g, C: {getTotal(newFood.carbs)}g, F: {getTotal(newFood.fat)}g, {getTotal(newFood.calories)} cal</span>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingFood(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddFood} disabled={isAdding}>
                {isAdding ? "Adding..." : "Add Food"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={!!editingEntry} onOpenChange={open => !open && setEditingEntry(null)}>
          <DialogContent aria-describedby="edit-food-description">
            <DialogHeader>
              <DialogTitle>Edit Food Entry</DialogTitle>
              <DialogDescription id="edit-food-description">Update the nutritional information for your food</DialogDescription>
            </DialogHeader>
            {editError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center font-semibold">
                {editError}
              </div>
            )}
            <div className="grid gap-2 py-4">
              <DashboardFormField
                label="Food Name"
                id="edit-food-name"
                value={editFood.name}
                onChange={e => setEditFood({ ...editFood, name: e.target.value })}
                placeholder="e.g., Chicken Breast (200g)"
                required
              />
              <div className="text-xs text-muted-foreground mt-2 mb-1">Macros shown are <b>per 100g</b>.</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DashboardFormField
                  label="Protein (g)"
                  id="edit-protein"
                  type="number"
                  value={editFood.protein}
                  onChange={e => setEditFood({ ...editFood, protein: e.target.value })}
                  placeholder="0"
                  min={0}
                  required
                />
                <DashboardFormField
                  label="Carbs (g)"
                  id="edit-carbs"
                  type="number"
                  value={editFood.carbs}
                  onChange={e => setEditFood({ ...editFood, carbs: e.target.value })}
                  placeholder="0"
                  min={0}
                  required
                />
                <DashboardFormField
                  label="Fat (g)"
                  id="edit-fat"
                  type="number"
                  value={editFood.fat}
                  onChange={e => setEditFood({ ...editFood, fat: e.target.value })}
                  placeholder="0"
                  min={0}
                  required
                />
                <DashboardFormField
                  label="Calories"
                  id="edit-calories"
                  type="number"
                  value={editFood.calories}
                  onChange={e => setEditFood({ ...editFood, calories: e.target.value })}
                  placeholder="0"
                  min={0}
                  required
                />
              </div>
              <div className="flex items-center gap-2 mt-2 mb-2">
                <label className="flex items-center gap-1 text-xs text-muted-foreground">
                  Units:
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-6 w-6 p-0 ml-1"
                    onClick={handleEditDecrementUnits}
                    aria-label="Decrease units"
                    disabled={editUnits <= 1}
                  >
                    –
                  </Button>
                  <input
                    type="number"
                    min={1}
                    value={editUnits}
                    onChange={handleEditUnitsChange}
                    className="w-12 px-1 py-0.5 border rounded text-center text-xs bg-white dark:bg-neutral-900 border-emerald-300 dark:border-emerald-800"
                    aria-label="Number of 100g units"
                    style={{ MozAppearance: 'textfield' }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-6 w-6 p-0"
                    onClick={handleEditIncrementUnits}
                    aria-label="Increase units"
                  >
                    +
                  </Button>
                  <span className="ml-1">x 100g</span>
                </label>
                <span className="text-xs text-muted-foreground ml-4"><b>Total for {editUnits * 100}g:</b> P: {getEditTotal(editFood.protein)}g, C: {getEditTotal(editFood.carbs)}g, F: {getEditTotal(editFood.fat)}g, {getEditTotal(editFood.calories)} cal</span>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingEntry(null)}>
                Cancel
              </Button>
              <Button onClick={handleEditSave} disabled={isUpdating}>
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {foodEntries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Utensils className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No food entries yet. Start by adding your first meal!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {foodEntries.map(entry => (
              <div key={entry.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">{entry.time}</span>
                    {entry.name === "Unknown" ? (
                      <span className="italic text-muted-foreground" aria-label="Unknown food entry">Unknown</span>
                    ) : (
                      <h4 className="font-medium flex items-center gap-2">
                        {entry.name}
                        <span className="text-xs text-muted-foreground">x {entry.units ?? 1}</span>
                      </h4>
                    )}
                  </div>
                  <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                    <span>P: {entry.protein}g</span>
                    <span>C: {entry.carbs}g</span>
                    <span>F: {entry.fat}g</span>
                    <span>{entry.calories} cal</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    <b>Total:</b> P: {(Number(entry.protein) * (entry.units ?? 1)).toFixed(2)}g, C: {(Number(entry.carbs) * (entry.units ?? 1)).toFixed(2)}g, F: {(Number(entry.fat) * (entry.units ?? 1)).toFixed(2)}g, {(Number(entry.calories) * (entry.units ?? 1)).toFixed(2)} cal
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditClick(entry)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteFoodEntry(entry.id)}
                    className="text-red-500 hover:text-red-700"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 
"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Plus, Utensils, Trash2, Edit2 } from "lucide-react"
import React, { useState } from "react"
import type { FoodEntry } from "@/api/foodEntry"

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

  const handleAddFood = async () => {
    if (
      !newFood.name ||
      Number(newFood.protein) < 0 ||
      Number(newFood.carbs) < 0 ||
      Number(newFood.fat) < 0 ||
      Number(newFood.calories) < 0
    ) {
      setFormError("All food entry values must be zero or positive numbers and name is required.")
      return
    }
    setFormError(null)
    await addFoodEntry({
      name: newFood.name,
      protein: Number(newFood.protein),
      carbs: Number(newFood.carbs),
      fat: Number(newFood.fat),
      calories: Number(newFood.calories),
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
    setEditError(null)
  }

  const handleEditSave = async () => {
    if (
      !editFood.name ||
      Number(editFood.protein) < 0 ||
      Number(editFood.carbs) < 0 ||
      Number(editFood.fat) < 0 ||
      Number(editFood.calories) < 0
    ) {
      setEditError("All food entry values must be zero or positive numbers and name is required.")
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
      time: editingEntry!.time,
      date: currentDate,
      createdAt: editingEntry!.createdAt,
    })
    setIsUpdating(false)
    setEditingEntry(null)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Food Entry</DialogTitle>
              <DialogDescription>Enter the nutritional information for your food</DialogDescription>
            </DialogHeader>
            {formError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center font-semibold">
                {formError}
              </div>
            )}
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="food-name">Food Name</Label>
                <Input
                  id="food-name"
                  placeholder="e.g., Chicken Breast (200g)"
                  value={newFood.name}
                  onChange={e => setNewFood({ ...newFood, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="protein">Protein (g)</Label>
                  <Input
                    id="protein"
                    type="number"
                    placeholder="0"
                    value={newFood.protein}
                    onChange={e => setNewFood({ ...newFood, protein: e.target.value })}
                    min={0}
                  />
                </div>
                <div>
                  <Label htmlFor="carbs">Carbs (g)</Label>
                  <Input
                    id="carbs"
                    type="number"
                    placeholder="0"
                    value={newFood.carbs}
                    onChange={e => setNewFood({ ...newFood, carbs: e.target.value })}
                    min={0}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fat">Fat (g)</Label>
                  <Input
                    id="fat"
                    type="number"
                    placeholder="0"
                    value={newFood.fat}
                    onChange={e => setNewFood({ ...newFood, fat: e.target.value })}
                    min={0}
                  />
                </div>
                <div>
                  <Label htmlFor="calories">Calories</Label>
                  <Input
                    id="calories"
                    type="number"
                    placeholder="0"
                    value={newFood.calories}
                    onChange={e => setNewFood({ ...newFood, calories: e.target.value })}
                    min={0}
                  />
                </div>
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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Food Entry</DialogTitle>
              <DialogDescription>Update the nutritional information for your food</DialogDescription>
            </DialogHeader>
            {editError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-center font-semibold">
                {editError}
              </div>
            )}
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="edit-food-name">Food Name</Label>
                <Input
                  id="edit-food-name"
                  placeholder="e.g., Chicken Breast (200g)"
                  value={editFood.name}
                  onChange={e => setEditFood({ ...editFood, name: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-protein">Protein (g)</Label>
                  <Input
                    id="edit-protein"
                    type="number"
                    placeholder="0"
                    value={editFood.protein}
                    onChange={e => setEditFood({ ...editFood, protein: e.target.value })}
                    min={0}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-carbs">Carbs (g)</Label>
                  <Input
                    id="edit-carbs"
                    type="number"
                    placeholder="0"
                    value={editFood.carbs}
                    onChange={e => setEditFood({ ...editFood, carbs: e.target.value })}
                    min={0}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-fat">Fat (g)</Label>
                  <Input
                    id="edit-fat"
                    type="number"
                    placeholder="0"
                    value={editFood.fat}
                    onChange={e => setEditFood({ ...editFood, fat: e.target.value })}
                    min={0}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-calories">Calories</Label>
                  <Input
                    id="edit-calories"
                    type="number"
                    placeholder="0"
                    value={editFood.calories}
                    onChange={e => setEditFood({ ...editFood, calories: e.target.value })}
                    min={0}
                  />
                </div>
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
                    <h4 className="font-medium">{entry.name || "Unknown"}</h4>
                  </div>
                  <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                    <span>P: {entry.protein}g</span>
                    <span>C: {entry.carbs}g</span>
                    <span>F: {entry.fat}g</span>
                    <span>{entry.calories} cal</span>
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
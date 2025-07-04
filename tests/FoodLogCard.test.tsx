import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from 'vitest';
import { FoodLogCard } from "@/components/dashboard/FoodLogCard";

describe("FoodLogCard", () => {
  const baseProps = {
    foodEntries: [],
    addFoodEntry: vi.fn(),
    deleteFoodEntry: vi.fn(),
    isAdding: false,
    isDeleting: false,
    currentDate: "2024-01-01",
    updateFoodEntry: vi.fn(),
  };

  it("renders the Food Log title and Add Food button", () => {
    render(<FoodLogCard {...baseProps} />);
    expect(screen.getByText(/Food Log/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Add Food/i })).toBeInTheDocument();
  });

  it("renders food entries if provided", () => {
    const foodEntries = [
      { id: "1", name: "Chicken", protein: 10, carbs: 0, fat: 1, calories: 50, time: "12:00", date: "2024-01-01", createdAt: "2024-01-01T12:00:00Z", units: 1 },
      { id: "2", name: "Rice", protein: 2, carbs: 20, fat: 0, calories: 90, time: "13:00", date: "2024-01-01", createdAt: "2024-01-01T13:00:00Z", units: 1 },
    ];
    render(<FoodLogCard {...baseProps} foodEntries={foodEntries} />);
    expect(screen.getByText("Chicken")).toBeInTheDocument();
    expect(screen.getByText("Rice")).toBeInTheDocument();
  });

  it("opens the Add Food dialog when Add Food button is clicked", () => {
    render(<FoodLogCard {...baseProps} />);
    fireEvent.click(screen.getByRole("button", { name: /Add Food/i }));
    expect(screen.getByText(/Add Food Entry/i)).toBeInTheDocument();
    expect(screen.getByText(/Enter the nutritional information/i)).toBeInTheDocument();
  });
}); 
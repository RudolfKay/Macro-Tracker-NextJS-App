import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MacroGoalsCard } from "@/components/dashboard/MacroGoalsCard";
import { vi } from "vitest";

describe("MacroGoalsCard", () => {
  const macroGoal = { protein: 100, carbs: 200, fat: 50, calories: 2000 };
  const editingGoals = { ...macroGoal };
  const setEditingGoals = vi.fn();
  const setIsEditingGoals = vi.fn();
  const handleSaveGoals = vi.fn();

  it("renders macro goals and Edit Goals button", () => {
    render(
      <MacroGoalsCard
        macroGoal={macroGoal}
        editingGoals={editingGoals}
        setEditingGoals={setEditingGoals}
        isEditingGoals={false}
        setIsEditingGoals={setIsEditingGoals}
        handleSaveGoals={handleSaveGoals}
        isSettingMacroGoal={false}
        formError={null}
      />
    );
    expect(screen.getByText("Daily Macro Goals")).toBeInTheDocument();
    expect(screen.getByText("100g")).toBeInTheDocument();
    expect(screen.getByText("200g")).toBeInTheDocument();
    expect(screen.getByText("50g")).toBeInTheDocument();
    expect(screen.getByText("2000")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /edit goals/i })).toBeInTheDocument();
  });

  it("opens and closes the edit dialog", () => {
    render(
      <MacroGoalsCard
        macroGoal={macroGoal}
        editingGoals={editingGoals}
        setEditingGoals={setEditingGoals}
        isEditingGoals={true}
        setIsEditingGoals={setIsEditingGoals}
        handleSaveGoals={handleSaveGoals}
        isSettingMacroGoal={false}
        formError={null}
      />
    );
    expect(screen.getByText("Edit Macro Goals")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /cancel/i }));
    expect(setIsEditingGoals).toHaveBeenCalledWith(false);
  });

  it("calls setEditingGoals on input change", () => {
    render(
      <MacroGoalsCard
        macroGoal={macroGoal}
        editingGoals={editingGoals}
        setEditingGoals={setEditingGoals}
        isEditingGoals={true}
        setIsEditingGoals={setIsEditingGoals}
        handleSaveGoals={handleSaveGoals}
        isSettingMacroGoal={false}
        formError={null}
      />
    );
    const proteinInput = screen.getByLabelText(/protein/i);
    fireEvent.change(proteinInput, { target: { value: "123" } });
    expect(setEditingGoals).toHaveBeenCalled();
  });

  it("shows error message if formError is set", () => {
    render(
      <MacroGoalsCard
        macroGoal={macroGoal}
        editingGoals={editingGoals}
        setEditingGoals={setEditingGoals}
        isEditingGoals={true}
        setIsEditingGoals={setIsEditingGoals}
        handleSaveGoals={handleSaveGoals}
        isSettingMacroGoal={false}
        formError={"Test error"}
      />
    );
    expect(screen.getByText("Test error")).toBeInTheDocument();
  });
}); 
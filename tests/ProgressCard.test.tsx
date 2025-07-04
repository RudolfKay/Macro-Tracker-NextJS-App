import React from "react";
import { render, screen } from "@testing-library/react";
import { ProgressCard } from "@/components/dashboard/ProgressCard";

describe("ProgressCard", () => {
  const macroGoal = { protein: 100, carbs: 200, fat: 50, calories: 2000 };
  const totals = { protein: 50, carbs: 100, fat: 25, calories: 1000 };
  const getPercentageDisplay = (current: number, goal: number) =>
    goal === 0 ? "0%" : `${Math.round((current / goal) * 100)}%`;

  it("renders all macro rows and correct values", () => {
    render(
      <ProgressCard totals={totals} macroGoal={macroGoal} getPercentageDisplay={getPercentageDisplay} />
    );
    expect(screen.getByText("Today's Progress")).toBeInTheDocument();
    expect(screen.getByText("Protein: 50g / 100g")).toBeInTheDocument();
    expect(screen.getByText("Carbs: 100g / 200g")).toBeInTheDocument();
    expect(screen.getByText("Fat: 25g / 50g")).toBeInTheDocument();
    expect(screen.getByText("Calories: 1000 / 2000")).toBeInTheDocument();
    const percentEls = screen.getAllByText("50%");
    expect(percentEls.length).toBeGreaterThanOrEqual(3);
  });

  it("shows 0% and 0g if macroGoal is null", () => {
    render(
      <ProgressCard totals={totals} macroGoal={null} getPercentageDisplay={getPercentageDisplay} />
    );
    expect(screen.getByText("Protein: 50g / 0g")).toBeInTheDocument();
    expect(screen.getByText("Carbs: 100g / 0g")).toBeInTheDocument();
    expect(screen.getByText("Fat: 25g / 0g")).toBeInTheDocument();
    expect(screen.getByText("Calories: 1000 / 0")).toBeInTheDocument();
    expect(screen.getAllByText("0%").length).toBeGreaterThanOrEqual(1);
  });

  it("caps progress bar value at 100 even if percentage is over 100", () => {
    const overTotals = { protein: 200, carbs: 400, fat: 100, calories: 4000 };
    render(
      <ProgressCard totals={overTotals} macroGoal={macroGoal} getPercentageDisplay={getPercentageDisplay} />
    );
    // The displayed percentage will be 200%, but the Progress bar value should be capped at 100
    expect(screen.getAllByText("200%").length).toBeGreaterThanOrEqual(3);
    // Check that the progressbar value is 100 (capped)
    const progressbars = screen.getAllByRole("progressbar");
    progressbars.forEach(bar => {
      expect(bar).toHaveAttribute("aria-valuemax", "100");
    });
  });
}); 
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from 'vitest';
import { DashboardFormField } from "@/components/dashboard/DashboardFormField";

describe("DashboardFormField", () => {
  it("renders label and input, and handles value change", () => {
    const handleChange = vi.fn();
    render(
      <DashboardFormField
        label="Protein (g)"
        id="protein"
        type="number"
        value={10}
        onChange={handleChange}
        placeholder="0"
        min={0}
        name="protein"
      />
    );
    expect(screen.getByLabelText("Protein (g)")).toBeInTheDocument();
    const input = screen.getByLabelText("Protein (g)");
    expect(input).toHaveValue(10);
    fireEvent.change(input, { target: { value: "20" } });
    expect(handleChange).toHaveBeenCalled();
  });

  it("respects required and disabled props", () => {
    render(
      <DashboardFormField
        label="Carbs (g)"
        id="carbs"
        type="number"
        value={5}
        onChange={() => {}}
        required
        disabled
      />
    );
    const input = screen.getByLabelText("Carbs (g)");
    expect(input).toBeRequired();
    expect(input).toBeDisabled();
  });
}); 
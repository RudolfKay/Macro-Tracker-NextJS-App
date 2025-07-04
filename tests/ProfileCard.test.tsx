import React from "react";
import { render, screen } from "@testing-library/react";
import { ProfileCard } from "@/components/profile/ProfileCard";

describe("ProfileCard", () => {
  it("renders the user's name, email, and children", () => {
    render(
      <ProfileCard name="John Doe" email="john@example.com">
        <div>Child content</div>
      </ProfileCard>
    );
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("renders without children", () => {
    render(<ProfileCard name="Jane" email="jane@example.com">{null}</ProfileCard>);
    expect(screen.getByText("Jane")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
  });
}); 
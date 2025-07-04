import { showApiErrorToast } from "@/lib/utils";
import { vi } from 'vitest';

describe("showApiErrorToast", () => {
  it("calls toast with fallback message if error is unknown", () => {
    const toast = vi.fn();
    showApiErrorToast(toast, undefined);
    expect(toast).toHaveBeenCalledWith({
      title: "Error",
      description: "An unexpected error occurred.",
      variant: "destructive",
    });
  });

  it("calls toast with error message if error is a string", () => {
    const toast = vi.fn();
    showApiErrorToast(toast, "Something went wrong");
    expect(toast).toHaveBeenCalledWith({
      title: "Error",
      description: "Something went wrong",
      variant: "destructive",
    });
  });
}); 
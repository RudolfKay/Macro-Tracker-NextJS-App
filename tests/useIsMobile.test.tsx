import { renderHook, act } from "@testing-library/react";
import { useIsMobile } from "@/hooks/use-mobile";
import { vi } from 'vitest';

describe("useIsMobile", () => {
  it("returns a boolean value", () => {
    const { result } = renderHook(() => useIsMobile());
    expect(typeof result.current).toBe("boolean");
  });

  it("updates when window is resized", () => {
    // Set up a mock for matchMedia that allows us to trigger the change event
    let listener: ((e: MediaQueryListEvent) => void) | null = null;
    vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => {
      return {
        matches: window.innerWidth < 768,
        media: query,
        onchange: null,
        addEventListener: (event: any, cb: any) => {
          if (event === 'change') listener = cb;
        },
        removeEventListener: () => {},
        dispatchEvent: () => false,
      } as any;
    });

    window.innerWidth = 1200;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    // Simulate resize to mobile and fire the change event
    act(() => {
      window.innerWidth = 400;
      if (listener) listener({ matches: true } as MediaQueryListEvent);
    });
    expect(result.current).toBe(true);
  });
}); 
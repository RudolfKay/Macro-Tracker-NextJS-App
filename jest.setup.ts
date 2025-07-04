import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Improved window.matchMedia mock for responsive tests
const MOBILE_BREAKPOINT = 640;
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => {
    // Extract the max-width value from the query
    const match = /\(max-width:\s*(\d+)px\)/.exec(query);
    const maxWidth = match ? parseInt(match[1], 10) : 0;
    return {
      matches: window.innerWidth < maxWidth,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
  }),
}); 
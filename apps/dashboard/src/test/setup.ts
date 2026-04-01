import '@testing-library/jest-dom/vitest';

if (!navigator.clipboard) {
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: {
      writeText: async () => undefined,
    },
  });
}

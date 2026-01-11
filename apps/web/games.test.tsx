import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import GamesListPage from './src/app/games/page';
import React from 'react';

// Mock global fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ games: [] }),
  })
) as unknown as typeof fetch;

describe('Web Games List', () => {
  it('renders correctly', async () => {
    render(<GamesListPage />);
    expect(screen.getByText(/Loading.../i)).toBeDefined();
  });
});


import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from './src/app/page';
import React from 'react';

// Mock Lucide icons
vi.mock('lucide-react', () => ({
  Share2: () => <div data-testid="share-icon" />,
  Globe: () => <div data-testid="globe-icon" />,
}));

describe('Web Skeleton', () => {
  it('renders landing page sections', () => {
    render(<Home />);
    expect(screen.getByText(/놀이짝/i)).toBeDefined();
    expect(screen.getByText(/게임 찾기/i)).toBeDefined();
    expect(screen.getByText(/경기장 예약/i)).toBeDefined();
    expect(screen.getByText(/업적/i)).toBeDefined();
  });

  it('toggles language', () => {
    render(<Home />);
    const toggleButton = screen.getByText(/언어/i);
    fireEvent.click(toggleButton);
    expect(screen.getByText(/Language/i)).toBeDefined();
    expect(screen.getByText(/Find Games/i)).toBeDefined();
  });
});


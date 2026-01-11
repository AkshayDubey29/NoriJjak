import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardPage from './src/app/dashboard/page';
import { AuthProvider } from './src/context/AuthContext';
import React from 'react';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('Web Auth Protected Route', () => {
  it('shows loading initially', () => {
    render(
      <AuthProvider>
        <DashboardPage />
      </AuthProvider>
    );
    expect(screen.getByText(/Loading.../i)).toBeDefined();
  });
});


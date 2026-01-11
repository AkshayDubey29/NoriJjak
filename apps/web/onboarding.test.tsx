import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import DashboardPage from './src/app/dashboard/page';
import { AuthProvider } from './src/context/AuthContext';
import React from 'react';

const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('Web Onboarding Gating', () => {
  it('redirects to onboarding if step is not DONE', () => {
    // Mock localStorage to simulate a logged in user with START step
    const user = { id: '1', email: 'test@example.com', onboardingStep: 'START', locale: 'ko-KR' };
    localStorage.setItem('user', JSON.stringify(user));

    render(
      <AuthProvider>
        <DashboardPage />
      </AuthProvider>
    );
    
    expect(mockPush).toHaveBeenCalledWith('/onboarding');
  });
});


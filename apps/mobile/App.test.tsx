import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import App from './App';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mock expo-linking
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('expo-linking', () => ({
  createURL: jest.fn(() => 'mock://'),
}));

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

describe('Mobile Auth Flow', () => {
  it('renders login screen when not authenticated', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    const { getAllByText, getByPlaceholderText } = render(<App />);
    
    await waitFor(() => {
      expect(getAllByText(/로그인/i)[0]).toBeTruthy();
      expect(getByPlaceholderText(/example@email.com/i)).toBeTruthy();
    });
  });
});

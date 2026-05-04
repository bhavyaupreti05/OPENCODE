import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Dashboard from './Dashboard';
import API from '../services/api';

// Mock API
jest.mock('../services/api');

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders dashboard with user profile', async () => {
    const mockUser = {
      email: 'test@example.com',
      role: { name: 'normal' },
      onboardingCompleted: true,
      selectedStack: { name: 'JavaScript' },
      selectedSkill: { name: 'JavaScript Fundamentals' },
      selectedDifficulty: { name: 'beginner' },
      confidenceLevel: 'beginner',
      experience: 'Just starting out'
    };

    API.get.mockResolvedValue({
      data: {
        data: { user: mockUser }
      }
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Your Dashboard')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
      expect(screen.getByText('beginner')).toBeInTheDocument();
    });
  });

  test('displays error when profile fetch fails', async () => {
    API.get.mockRejectedValue({
      response: { data: { message: 'Unable to load profile' } }
    });

    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText('Unable to load profile')).toBeInTheDocument();
    });
  });
});

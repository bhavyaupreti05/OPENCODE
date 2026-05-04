import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import OnboardingFlow from './OnboardingFlow';
import API from '../../services/api';

// Mock API
jest.mock('../../services/api');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('OnboardingFlow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    API.get.mockResolvedValue({
      data: {
        data: [
          { _id: 'stack1', name: 'JavaScript' },
          { _id: 'stack2', name: 'React' }
        ]
      }
    });
    API.get.mockResolvedValueOnce({
      data: {
        data: [
          { _id: 'diff1', name: 'beginner' },
          { _id: 'diff2', name: 'intermediate' }
        ]
      }
    });
  });

  test('renders onboarding form with initial options', async () => {
    render(
      <BrowserRouter>
        <OnboardingFlow />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Welcome to OPEN-bridge')).toBeInTheDocument();
      expect(screen.getByLabelText(/tech stack/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/difficulty/i)).toBeInTheDocument();
    });
  });

  test('loads skills when stack is selected', async () => {
    API.get.mockResolvedValueOnce({
      data: {
        data: [
          { _id: 'skill1', name: 'JavaScript Fundamentals' },
          { _id: 'skill2', name: 'Open Source Contribution' }
        ]
      }
    });

    render(
      <BrowserRouter>
        <OnboardingFlow />
      </BrowserRouter>
    );

    await waitFor(() => {
      const stackSelect = screen.getByLabelText(/tech stack/i);
      fireEvent.change(stackSelect, { target: { value: 'stack1' } });
    });

    await waitFor(() => {
      expect(API.get).toHaveBeenCalledWith('/stacks/stack1/skills');
    });
  });

  test('submits onboarding form successfully', async () => {
    API.post.mockResolvedValue({
      data: { success: true }
    });

    render(
      <BrowserRouter>
        <OnboardingFlow />
      </BrowserRouter>
    );

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/tech stack/i), {
        target: { value: 'stack1' }
      });
      fireEvent.change(screen.getByLabelText(/skill focus/i), {
        target: { value: 'skill1' }
      });
      fireEvent.change(screen.getByLabelText(/difficulty/i), {
        target: { value: 'diff1' }
      });
      fireEvent.click(screen.getByLabelText('I\'m starting from the beginning'));
      fireEvent.click(screen.getByRole('button', { name: /continue/i }));
    });

    await waitFor(() => {
      expect(API.post).toHaveBeenCalledWith('/onboarding', {
        stackId: 'stack1',
        skillId: 'skill1',
        difficultyId: 'diff1',
        confidenceLevel: 'beginner',
        experience: ''
      });
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});

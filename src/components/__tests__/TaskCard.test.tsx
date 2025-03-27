import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MantineProvider } from '@mantine/core';
import { TaskCard } from '../TaskCard';
import taskReducer from '../../store/taskSlice';
import { Task } from '../../types/task';

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    info: jest.fn(),
  },
}));

const mockTask: Task = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  dueDate: new Date('2024-12-31'),
  completed: false,
  createdAt: new Date('2024-01-01'),
};

const renderWithProviders = (component: React.ReactNode) => {
  const store = configureStore({
    reducer: {
      tasks: taskReducer,
    },
  });

  return render(
    <Provider store={store}>
      <MantineProvider>
        {component}
      </MantineProvider>
    </Provider>
  );
};

describe('TaskCard', () => {
  it('renders task details correctly', () => {
    renderWithProviders(<TaskCard task={mockTask} />);

    expect(screen.getByText(mockTask.title)).toBeInTheDocument();
    expect(screen.getByText(mockTask.description)).toBeInTheDocument();
  });

  it('shows overdue badge for past due tasks', () => {
    const pastDueTask = {
      ...mockTask,
      dueDate: new Date('2024-01-01'),
    };
    renderWithProviders(<TaskCard task={pastDueTask} />);
    expect(screen.getByText('Overdue')).toBeInTheDocument();
  });

  it('shows correct status badge', () => {
    renderWithProviders(<TaskCard task={mockTask} />);
    expect(screen.getByText('Pending')).toBeInTheDocument();

    renderWithProviders(<TaskCard task={{ ...mockTask, completed: true }} />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('toggles task completion when checkbox is clicked', () => {
    renderWithProviders(<TaskCard task={mockTask} />);
    const checkbox = screen.getByRole('checkbox', { name: /toggle task completion/i });
    
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('opens edit modal when edit button is clicked', () => {
    renderWithProviders(<TaskCard task={mockTask} />);
    const editButton = screen.getByRole('button', { name: /edit/i });
    
    fireEvent.click(editButton);
    expect(screen.getByText('Edit Task')).toBeInTheDocument();
  });
});

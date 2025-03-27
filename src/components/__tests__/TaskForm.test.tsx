import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MantineProvider } from '@mantine/core';
import { TaskForm } from '../TaskForm';
import taskReducer from '../../store/taskSlice';
import { Task, TaskFilter } from '../../types/task';

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
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

interface TaskState {
  tasks: Task[];
  filter: TaskFilter;
}

const renderWithProviders = (component: React.ReactNode) => {
  const store = configureStore<{ tasks: TaskState }>({
    reducer: {
      tasks: taskReducer,
    },
    preloadedState: {
      tasks: {
        tasks: [mockTask],
        filter: 'all',
      },
    },
  });

  return {
    store,
    ...render(
      <Provider store={store}>
        <MantineProvider>
          {component}
        </MantineProvider>
      </Provider>
    ),
  };
};

describe('TaskForm', () => {
  it('renders empty form for new task', () => {
    renderWithProviders(<TaskForm onClose={() => {}} />);

    expect(screen.getByLabelText(/title/i)).toHaveValue('');
    expect(screen.getByLabelText(/description/i)).toHaveValue('');
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  it('renders form with task data for editing', () => {
    renderWithProviders(<TaskForm task={mockTask} onClose={() => {}} />);

    expect(screen.getByLabelText(/title/i)).toHaveValue(mockTask.title);
    expect(screen.getByLabelText(/description/i)).toHaveValue(mockTask.description);
    expect(screen.getByText('Update Task')).toBeInTheDocument();
  });

  it('prevents submission with empty title', async () => {
    const onClose = jest.fn();
    renderWithProviders(<TaskForm onClose={onClose} />);

    const submitButton = screen.getByRole('button', { name: /add task/i });
    fireEvent.click(submitButton);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('prevents duplicate task titles', async () => {
    const onClose = jest.fn();
    renderWithProviders(<TaskForm onClose={onClose} />);

    await userEvent.type(screen.getByLabelText(/title/i), mockTask.title);
    await userEvent.type(screen.getByLabelText(/description/i), 'New Description');
    
    const submitButton = screen.getByRole('button', { name: /add task/i });
    fireEvent.click(submitButton);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('allows editing the same task with the same title', async () => {
    const onClose = jest.fn();
    renderWithProviders(<TaskForm task={mockTask} onClose={onClose} />);

    // Update description only
    const descriptionInput = screen.getByLabelText(/description/i);
    await userEvent.clear(descriptionInput);
    await userEvent.type(descriptionInput, 'Updated Description');

    const submitButton = screen.getByRole('button', { name: /update task/i });
    fireEvent.click(submitButton);
    expect(onClose).toHaveBeenCalled();
  });
});

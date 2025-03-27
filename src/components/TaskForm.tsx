import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextInput, Textarea, Button, Group, Stack } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { addTask, editTask } from '../store/taskSlice';
import { Task } from '../types/task';
import { RootState } from '../store/store';
import { toast } from 'react-toastify';

interface TaskFormProps {
  task?: Task;
  onClose?: () => void;
}

export const TaskForm = ({ task, onClose }: TaskFormProps) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dueDate, setDueDate] = useState<Date | null>(task?.dueDate ? new Date(task.dueDate) : null);
  const tasks = useSelector((state: RootState) => state.tasks.tasks);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    const trimmedTitle = title.trim();
    const existingTask = tasks.find(
      t => t.title.toLowerCase() === trimmedTitle.toLowerCase() && t.id !== task?.id
    );

    if (existingTask) {
      toast.error('A task with this title already exists');
      return;
    }

    const taskData: Task = {
      id: task?.id || crypto.randomUUID(),
      title: trimmedTitle,
      description: description.trim(),
      dueDate,
      completed: task?.completed || false,
      createdAt: task?.createdAt || new Date(),
    };

    if (task) {
      dispatch(editTask(taskData));
      toast.success('Task updated successfully');
    } else {
      dispatch(addTask(taskData));
      toast.success('Task added successfully');
    }

    onClose?.();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        <TextInput
          required
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
        />
        <Textarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          autosize
          minRows={3}
        />
        <DatePickerInput
          required
          label="Due Date"
          value={dueDate}
          onChange={setDueDate}
          placeholder="Select due date"
          clearable
        />
        <Group justify="flex-end" mt="md">
          {onClose && (
            <Button variant="subtle" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button type="submit">{task ? 'Update Task' : 'Add Task'}</Button>
        </Group>
      </Stack>
    </form>
  );
};

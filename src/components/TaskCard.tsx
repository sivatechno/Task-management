import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Card, Text, Group, Button, Badge, Modal, Checkbox, Stack } from '@mantine/core';
import { deleteTask, toggleTaskComplete } from '../store/taskSlice';
import { Task } from '../types/task';
import { TaskForm } from './TaskForm';
import { toast } from 'react-toastify';

interface TaskCardProps {
  task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const dispatch = useDispatch();
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleDelete = () => {
    dispatch(deleteTask(task.id));
    toast.info(`Task "${task.title}" deleted`);
  };

  const handleToggleComplete = () => {
    dispatch(toggleTaskComplete(task.id));
    const newStatus = !task.completed ? 'completed' : 'pending';
    toast.success(`Task "${task.title}" marked as ${newStatus}`);
  };

  const isOverdue = !task.completed && new Date(task.dueDate) < new Date();

  return (
    <>
      <Card shadow="sm" p="md" radius="md" withBorder>
        <Stack gap="xs">
          <Group justify="space-between" wrap="nowrap">
            <Group wrap="nowrap" style={{ flex: 1 }}>
              <Checkbox
                checked={task.completed}
                onChange={handleToggleComplete}
                aria-label="Toggle task completion"
              />
              <Text fw={500} lineClamp={1} style={{ 
                textDecoration: task.completed ? 'line-through' : 'none',
                flex: 1,
                color: isOverdue ? 'red' : undefined
              }}>
                {task.title}
              </Text>
            </Group>
            <Badge color={task.completed ? 'green' : isOverdue ? 'red' : 'blue'}>
              {task.completed ? 'Completed' : isOverdue ? 'Overdue' : 'Pending'}
            </Badge>
          </Group>

          {task.description && (
            <Text size="sm" c={ isOverdue ? 'red' : undefined} lineClamp={2}>
              {task.description}
            </Text>
          )}

          <Text size="sm" c={isOverdue ? 'red' : 'dimmed'}>
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </Text>

          <Group justify="flex-end" gap="xs">
            <Button variant="light" color="blue" size="xs" onClick={() => setEditModalOpen(true)}>
              Edit
            </Button>
            <Button variant="light" color="red" size="xs" onClick={handleDelete}>
              Delete
            </Button>
          </Group>
        </Stack>
      </Card>

      <Modal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Task"
      >
        <TaskForm task={task} onClose={() => {
          setEditModalOpen(false);
          toast.success(`Task "${task.title}" updated`);
        }} />
      </Modal>
    </>
  );
};

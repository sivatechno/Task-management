import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Stack, Group, Title, Paper, Box } from '@mantine/core';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { RootState } from '../store/store';
import { TaskCard } from './TaskCard';
import { toggleTaskComplete } from '../store/taskSlice';
import { toast } from 'react-toastify';

export const TaskList = () => {
  const dispatch = useDispatch();
  const { tasks, filter } = useSelector((state: RootState) => state.tasks);

  const { pendingTasks, completedTasks } = useMemo(() => {
    return {
      pendingTasks: tasks.filter(task => !task.completed),
      completedTasks: tasks.filter(task => task.completed),
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    switch (filter) {
      case 'completed':
        return completedTasks;
      case 'pending':
        return pendingTasks;
      default:
        return tasks;
    }
  }, [tasks, filter, completedTasks, pendingTasks]);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return;

    const sourceList = source.droppableId === 'pending' ? pendingTasks : completedTasks;
    const task = sourceList[source.index];

    if (source.droppableId !== destination.droppableId) {
      dispatch(toggleTaskComplete(task.id));
      const newStatus = destination.droppableId === 'completed' ? 'completed' : 'pending';
      toast.success(`Task "${task.title}" marked as ${newStatus}`);
    }
  };

  if (filter !== 'all') {
    return (
      <Stack gap="md">
        {filteredTasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </Stack>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Group grow align="stretch">
        <Box>
          <Paper p="md" radius="md" withBorder h="100%">
            <Title order={3} mb="md" ta="center">
              Pending Tasks ({pendingTasks.length})
            </Title>
            <Droppable droppableId="pending">
              {(provided) => (
                <Stack
                  gap="md"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ minHeight: 100 }}
                >
                  {pendingTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Stack>
              )}
            </Droppable>
          </Paper>
        </Box>

        <Box>
          <Paper p="md" radius="md" withBorder h="100%">
            <Title order={3} mb="md" ta="center">
              Completed Tasks ({completedTasks.length})
            </Title>
            <Droppable droppableId="completed">
              {(provided) => (
                <Stack
                  gap="md"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={{ minHeight: 100 }}
                >
                  {completedTasks.map((task, index) => (
                    <Draggable key={task.id} draggableId={task.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <TaskCard task={task} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Stack>
              )}
            </Droppable>
          </Paper>
        </Box>
      </Group>
    </DragDropContext>
  );
};

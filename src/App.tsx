import { useState } from 'react';
import { Container, Title, SegmentedControl, Button, Modal, Group, Switch, useMantineColorScheme } from '@mantine/core';
import { useDispatch } from 'react-redux';
import { QuoteDisplay } from './components/QuoteDisplay';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { setFilter } from './store/taskSlice';
import { TaskFilter } from './types/task';
import { IconSun, IconMoon } from '@tabler/icons-react';
import { toast } from 'react-toastify';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  const handleFilterChange = (value: string) => {
    dispatch(setFilter(value as TaskFilter));
    toast.info(`Filtered tasks: ${value}`);
  };

  return (
    <div className="content-container">
      <Container size="md" py="xl">
        <Group justify="space-between" mb="xl">
          <Title order={1}>Task Management App</Title>
          <Switch
            size="lg"
            onLabel={<IconSun size="1.25rem" stroke={2.5} />}
            offLabel={<IconMoon size="1.25rem" stroke={2.5} />}
            checked={colorScheme === 'dark'}
            onChange={toggleColorScheme}
          />
        </Group>

        <QuoteDisplay />

        <Group justify="space-between" mb="xl">
          <SegmentedControl
            data={[
              { label: 'All', value: 'all' },
              { label: 'Pending', value: 'pending' },
              { label: 'Completed', value: 'completed' },
            ]}
            onChange={handleFilterChange}
          />
          <Button onClick={() => setIsModalOpen(true)}>Add New Task</Button>
        </Group>

        <TaskList />

        <Modal
          opened={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add New Task"
        >
          <TaskForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      </Container>
    </div>
  );
}

export default App;

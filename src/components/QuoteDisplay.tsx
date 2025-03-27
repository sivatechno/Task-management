import { useEffect, useState } from 'react';
import { Paper, Text, Skeleton, Button, Group } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';
import { Quote } from '../types/task';
import { fetchRandomQuote } from '../utils/api';
import { toast } from 'react-toastify';

export const QuoteDisplay = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  const loadQuote = async () => {
    setLoading(true);
    try {
      const newQuote = await fetchRandomQuote();
      setQuote(newQuote);
    } catch (error) {
      console.error('Failed to fetch quote:', error);
      toast.error('Failed to fetch quote');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuote();
  }, []);

  if (loading) {
    return <Skeleton height={100} radius="md" />;
  }

  if (!quote) {
    return null;
  }

  return (
    <Paper p="md" radius="md" withBorder mb="xl">
      <Group justify="space-between" align="flex-start">
        <Text size="lg" fs="italic" style={{ flex: 1 }}>
          "{quote.quote}"
        </Text>
        <Button
          variant="subtle"
          size="sm"
          onClick={loadQuote}
          loading={loading}
          leftSection={<IconRefresh size="1rem" />}
        >
          New Quote
        </Button>
      </Group>
      <Text size="sm" color="dimmed" ta="right" mt="xs">
        — {quote.author}
      </Text>
    </Paper>
  );
};

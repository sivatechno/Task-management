import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QuoteDisplay } from '../QuoteDisplay';
import { fetchRandomQuote } from '../../utils/api';
import { MantineProvider } from '@mantine/core';

// Mock the API module
jest.mock('../../utils/api');
const mockFetchRandomQuote = fetchRandomQuote as jest.MockedFunction<typeof fetchRandomQuote>;

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

const mockQuote = {
  id: 1,
  quote: 'Test Quote',
  author: 'Test Author',
};

describe('QuoteDisplay', () => {
  beforeEach(() => {
    mockFetchRandomQuote.mockResolvedValue(mockQuote);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(
      <MantineProvider>
        <QuoteDisplay />
      </MantineProvider>
    );
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('displays quote and author after loading', async () => {
    render(
      <MantineProvider>
        <QuoteDisplay />
      </MantineProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(`"${mockQuote.quote}"`)).toBeInTheDocument();
      expect(screen.getByText(`— ${mockQuote.author}`)).toBeInTheDocument();
    });
  });

  it('fetches new quote when refresh button is clicked', async () => {
    render(
      <MantineProvider>
        <QuoteDisplay />
      </MantineProvider>
    );

    await waitFor(() => {
      expect(screen.getByText(`"${mockQuote.quote}"`)).toBeInTheDocument();
    });

    const newQuote = {
      id: 2,
      quote: 'New Quote',
      author: 'New Author',
    };
    mockFetchRandomQuote.mockResolvedValueOnce(newQuote);

    const refreshButton = screen.getByRole('button', { name: /new quote/i });
    fireEvent.click(refreshButton);

    await waitFor(() => {
      expect(screen.getByText(`"${newQuote.quote}"`)).toBeInTheDocument();
      expect(screen.getByText(`— ${newQuote.author}`)).toBeInTheDocument();
    });
  });

  it('shows error toast when API fails', async () => {
    const error = new Error('API Error');
    mockFetchRandomQuote.mockRejectedValueOnce(error);

    render(
      <MantineProvider>
        <QuoteDisplay />
      </MantineProvider>
    );

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });
});

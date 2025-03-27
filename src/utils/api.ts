import axios from 'axios';
import { Quote } from '../types/task';

export const fetchRandomQuote = async (): Promise<Quote> => {
  try {
    const response = await axios.get('https://dummyjson.com/quotes/random');
    return response.data;
  } catch (error) {
    return {
      id: 0,
      quote: 'The only way to do great work is to love what you do.',
      author: 'Steve Jobs',
    };
  }
};

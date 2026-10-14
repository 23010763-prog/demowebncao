import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders content returned by the API', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      items: [{
        id: 1,
        category: 'Research',
        date: 'Jun 12, 2026',
        title: 'A story from the API',
        summary: 'Content loaded successfully.',
        image: 'https://example.com/story.jpg',
        imageAlt: 'Illustration'
      }]
    })
  });

  render(<App />);

  expect(screen.getByRole('heading', { name: /shape the future/i })).toBeInTheDocument();
  expect(await screen.findByRole('heading', { name: 'A story from the API' })).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith('/api/data');

  fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
  fireEvent.click(screen.getByRole('button', { name: 'Options' }));
  expect(screen.getByRole('menuitem', { name: 'Latest stories' })).toBeInTheDocument();
});

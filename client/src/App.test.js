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
  expect(await screen.findByRole('rowheader', { name: /a story from the api/i })).toBeInTheDocument();
  expect(global.fetch).toHaveBeenCalledWith('/api/data');

  fireEvent.click(screen.getByRole('button', { name: 'Open navigation' }));
  fireEvent.click(screen.getByRole('button', { name: 'Options' }));
  expect(screen.getByRole('menuitem', { name: 'Latest stories' })).toBeInTheDocument();
});

test('filters, sorts, and paginates stories in groups of ten', async () => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      items: Array.from({ length: 12 }, (_, index) => ({
        id: index + 1,
        category: index === 10 ? 'Community' : 'Research',
        date: `Jun ${String(index + 1).padStart(2, '0')}, 2026`,
        title: `Story ${String(index + 1).padStart(2, '0')}`,
        summary: `Summary ${index + 1}`,
        image: 'https://example.com/story.jpg',
        imageAlt: 'Illustration'
      }))
    })
  });

  render(<App />);

  expect(await screen.findByRole('rowheader', { name: /story 01/i })).toBeInTheDocument();
  expect(screen.getByRole('rowheader', { name: /story 10/i })).toBeInTheDocument();
  expect(screen.queryByRole('rowheader', { name: /story 11/i })).not.toBeInTheDocument();
  expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Next' }));
  expect(screen.getByRole('rowheader', { name: /story 11/i })).toBeInTheDocument();
  expect(screen.getByRole('rowheader', { name: /story 12/i })).toBeInTheDocument();
  expect(screen.queryByRole('rowheader', { name: /story 01/i })).not.toBeInTheDocument();

  fireEvent.change(screen.getByRole('searchbox', { name: 'Filter by Category' }), {
    target: { value: 'community' }
  });
  expect(screen.getByRole('rowheader', { name: /story 11/i })).toBeInTheDocument();
  expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();

  fireEvent.change(screen.getByRole('searchbox', { name: 'Filter by Category' }), {
    target: { value: 'research' }
  });
  fireEvent.click(screen.getByRole('button', { name: /story/i }));
  expect(screen.getAllByRole('columnheader').some((header) => header.getAttribute('aria-sort') === 'ascending')).toBe(true);
  fireEvent.click(screen.getByRole('button', { name: /story/i }));
  expect(screen.getByRole('rowheader', { name: /story 12/i })).toBeInTheDocument();
  expect(screen.queryByRole('rowheader', { name: /story 01/i })).not.toBeInTheDocument();
});

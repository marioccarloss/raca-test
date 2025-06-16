import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import App from './App.jsx';

describe('App', () => {
  test('renders the loading skeleton initially', async () => {
    render(<App />);
    const skeletonItems = await screen.findAllByLabelText('skeleton-item');
    expect(skeletonItems.length).toBeGreaterThan(0);
    for (const item of skeletonItems) {
      expect(item).toBeInTheDocument();
    }
  });

  test('renders the main layout eventually', async () => {
    render(<App />);

    expect(
      await screen.findByText('raca store', {}, { timeout: 3000 })
    ).toBeInTheDocument();
  });
});

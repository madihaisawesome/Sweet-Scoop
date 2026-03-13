import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('switches between the two exercise pages', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /user directory/i })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /exercise 2: tic-tac-toe/i }));
  expect(screen.getByRole('heading', { name: /tic-tac-toe/i })).toBeInTheDocument();
});

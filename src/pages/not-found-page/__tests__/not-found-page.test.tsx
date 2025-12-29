import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotFoundPage from '../not-found-page';

describe('NotFoundPage', () => {
  it('should render correctly', () => {
    const { container } = render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });

  it('should display 404 message', () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page Not Found')).toBeInTheDocument();
  });

  it('should display link to home page', () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );
    const homeLink = screen.getByText('Return to home page');
    expect(homeLink).toBeInTheDocument();
    expect(homeLink.closest('a')).toHaveAttribute('href', '/');
  });

  it('should have correct page structure', () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );
    const page = screen.getByText('404').closest('.page');
    expect(page).toBeInTheDocument();
  });
});


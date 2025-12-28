import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
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
    const { getByText } = render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );
    expect(getByText('404')).toBeInTheDocument();
    expect(getByText('Page Not Found')).toBeInTheDocument();
  });

  it('should display link to home page', () => {
    const { getByText } = render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );
    expect(getByText('Return to home page')).toBeInTheDocument();
  });
});


import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Spinner from '../spinner';

describe('Spinner', () => {
  it('should render correctly', () => {
    const { container } = render(<Spinner />);
    expect(container).toBeTruthy();
  });

  it('should display loading spinner with correct styles', () => {
    const { container } = render(<Spinner />);
    const spinner = container.querySelector('div[style*="border"]');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveStyle({
      width: '50px',
      height: '50px',
      borderRadius: '50%',
    });
  });

  it('should have flex container', () => {
    const { container } = render(<Spinner />);
    const flexContainer = container.firstChild as HTMLElement;
    expect(flexContainer).toHaveStyle({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    });
  });
});


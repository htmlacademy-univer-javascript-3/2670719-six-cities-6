import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Spinner from '../spinner';

describe('Spinner', () => {
  it('should render correctly', () => {
    const { container } = render(<Spinner />);
    expect(container).toBeTruthy();
  });
});


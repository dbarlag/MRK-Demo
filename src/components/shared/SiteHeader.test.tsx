import { render, screen } from '@testing-library/react';
import SiteHeader from './SiteHeader';

jest.mock('rk-designsystem');

describe('SiteHeader', () => {
  it('renders the Header component', () => {
    render(<SiteHeader />);
    expect(screen.getByTestId('Header')).toBeInTheDocument();
  });

  it('accepts a custom secondaryLogoSrc', () => {
    render(<SiteHeader secondaryLogoSrc="/test-logo.png" />);
    const header = screen.getByTestId('Header');
    expect(header).toHaveAttribute('secondaryLogoSrc', '/test-logo.png');
  });
});

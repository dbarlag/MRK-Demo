import { render, screen } from '@testing-library/react';
import SiteHeader from './SiteHeader';

jest.mock('rk-designsystem');
jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null, status: 'unauthenticated' }),
  signOut: jest.fn(),
}));

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

import { render, screen } from '@testing-library/react';
import MinsideTopSection from './MinsideTopSection';

jest.mock('rk-designsystem');
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

const mockStyles: Record<string, string> = new Proxy({}, {
  get: (_target, prop) => String(prop),
});

describe('MinsideTopSection', () => {
  it('renders the Tilbake button', () => {
    render(<MinsideTopSection activeTab="profil" styles={mockStyles} />);
    expect(screen.getByText('Tilbake')).toBeInTheDocument();
  });

  it('renders Min side heading', () => {
    render(<MinsideTopSection activeTab="profil" styles={mockStyles} />);
    expect(screen.getByText('Min side')).toBeInTheDocument();
  });

  it('renders all three tabs', () => {
    render(<MinsideTopSection activeTab="engasjement" styles={mockStyles} />);
    expect(screen.getByText('Profil')).toBeInTheDocument();
    expect(screen.getByText('Engasjement')).toBeInTheDocument();
    expect(screen.getByText('Kompetanse')).toBeInTheDocument();
  });
});

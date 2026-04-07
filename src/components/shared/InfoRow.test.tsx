import { render, screen } from '@testing-library/react';
import InfoRow from './InfoRow';

jest.mock('rk-designsystem');

const mockStyles: Record<string, string> = new Proxy({}, {
  get: (_target, prop) => String(prop),
});

describe('InfoRow', () => {
  it('renders label and value', () => {
    render(<InfoRow label="Navn:" value="Ola Norman" styles={mockStyles} />);
    expect(screen.getByText('Navn:')).toBeInTheDocument();
    expect(screen.getByText('Ola Norman')).toBeInTheDocument();
  });

  it('renders icon when iconSrc provided', () => {
    const { container } = render(
      <InfoRow label="Test" value="Val" iconSrc="/test.png" styles={mockStyles} />
    );
    const img = container.querySelector('img');
    expect(img).toHaveAttribute('src', '/test.png');
  });

  it('does not render icon when iconSrc omitted', () => {
    const { container } = render(
      <InfoRow label="Test" value="Val" styles={mockStyles} />
    );
    const img = container.querySelector('img');
    expect(img).toBeNull();
  });
});

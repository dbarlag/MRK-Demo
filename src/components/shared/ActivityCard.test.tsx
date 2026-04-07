import { render, screen } from '@testing-library/react';
import ActivityCard from './ActivityCard';

jest.mock('rk-designsystem');

const mockStyles: Record<string, string> = new Proxy({}, {
  get: (_target, prop) => String(prop),
});

describe('ActivityCard', () => {
  it('renders the title', () => {
    render(
      <ActivityCard
        title="Besøkstjenesten"
        tagLabel="Pågående"
        tagColor="success"
        rows={[]}
        styles={mockStyles}
      />
    );
    expect(screen.getByText('Besøkstjenesten')).toBeInTheDocument();
  });

  it('renders the status tag', () => {
    render(
      <ActivityCard
        title="Test"
        tagLabel="Fullfort"
        tagColor="info"
        rows={[]}
        styles={mockStyles}
      />
    );
    expect(screen.getByText('Fullfort')).toBeInTheDocument();
  });

  it('renders data rows', () => {
    render(
      <ActivityCard
        title="Test"
        tagLabel="Pågående"
        tagColor="success"
        rows={[
          { label: 'Førening:', value: 'Volda Røde Kors' },
          { label: 'Startdato:', value: '05.05.2024' },
        ]}
        styles={mockStyles}
      />
    );
    expect(screen.getByText('Førening:')).toBeInTheDocument();
    expect(screen.getByText('Volda Røde Kors')).toBeInTheDocument();
    expect(screen.getByText('Startdato:')).toBeInTheDocument();
    expect(screen.getByText('05.05.2024')).toBeInTheDocument();
  });
});

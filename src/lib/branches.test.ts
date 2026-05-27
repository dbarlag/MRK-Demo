import { getAllActivities } from './branches';

describe('getAllActivities', () => {
  const activities = getAllActivities();

  it('returns a non-empty array', () => {
    expect(activities.length).toBeGreaterThan(0);
  });

  it('produces activities with the expected shape', () => {
    const first = activities[0];
    expect(first).toMatchObject({
      id: expect.any(String),
      branchId: expect.any(String),
      branchName: expect.any(String),
      globalActivityName: expect.any(String),
      localActivityName: expect.any(String),
      haystack: expect.any(String),
    });
  });

  it('uses branchId-index format for IDs', () => {
    expect(activities[0].id).toMatch(/^[^-]+-\d+$/);
  });

  it('produces unique IDs across the full set', () => {
    const ids = new Set(activities.map((a) => a.id));
    expect(ids.size).toBe(activities.length);
  });

  it('builds a lowercase haystack for substring filtering', () => {
    for (const a of activities.slice(0, 50)) {
      expect(a.haystack).toBe(a.haystack.toLowerCase());
    }
  });

  it('resolves at least some Oslo neighborhoods on Oslo branches', () => {
    const oslo = activities.filter((a) => a.municipality?.toLowerCase() === 'oslo');
    const withNeighborhood = oslo.filter((a) => a.neighborhood !== null);
    expect(withNeighborhood.length).toBeGreaterThan(0);
  });

  it('does not assign a neighborhood to non-Oslo branches', () => {
    const nonOslo = activities.filter((a) => a.municipality?.toLowerCase() !== 'oslo');
    for (const a of nonOslo) {
      expect(a.neighborhood).toBeNull();
    }
  });

  it('resolves coords for at least some entries', () => {
    const withCoords = activities.filter((a) => a.lat !== null && a.lng !== null);
    expect(withCoords.length).toBeGreaterThan(0);
  });
});

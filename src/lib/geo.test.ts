import { resolvePlace, municipalityToCoords, haversineKm } from './geo';

describe('haversineKm', () => {
  it('returns 0 for identical points', () => {
    expect(haversineKm({ lat: 59.913, lng: 10.752 }, { lat: 59.913, lng: 10.752 })).toBe(0);
  });

  it('is symmetric', () => {
    const a = { lat: 59.913, lng: 10.752 };
    const b = { lat: 60.391, lng: 5.322 };
    expect(haversineKm(a, b)).toBeCloseTo(haversineKm(b, a), 6);
  });

  it('approximates the Oslo–Bergen great-circle distance (~308 km)', () => {
    const oslo = { lat: 59.913, lng: 10.752 };
    const bergen = { lat: 60.391, lng: 5.322 };
    const km = haversineKm(oslo, bergen);
    expect(km).toBeGreaterThan(300);
    expect(km).toBeLessThan(320);
  });
});

describe('municipalityToCoords', () => {
  it('returns null for null input', () => {
    expect(municipalityToCoords(null)).toBeNull();
  });

  it('returns null for unknown municipality', () => {
    expect(municipalityToCoords('Nowhere-Land')).toBeNull();
  });

  it('returns coords for a known municipality (Oslo)', () => {
    expect(municipalityToCoords('Oslo')).toEqual({ lat: 59.913, lng: 10.752 });
  });

  it('is case-insensitive', () => {
    expect(municipalityToCoords('OSLO')).toEqual({ lat: 59.913, lng: 10.752 });
    expect(municipalityToCoords('oslo')).toEqual({ lat: 59.913, lng: 10.752 });
  });
});

describe('resolvePlace', () => {
  it('returns null for empty input', () => {
    expect(resolvePlace('')).toBeNull();
  });

  it('returns null for whitespace-only input', () => {
    expect(resolvePlace('   ')).toBeNull();
  });

  it('matches an exact name', () => {
    expect(resolvePlace('Oslo')?.name).toBe('Oslo');
  });

  it('matches case-insensitively', () => {
    expect(resolvePlace('oslo')?.name).toBe('Oslo');
    expect(resolvePlace('OSLO')?.name).toBe('Oslo');
  });

  it('matches via alias when no place name is an exact match', () => {
    // Sandnessjøen exists only as an alias of Alstahaug.
    expect(resolvePlace('Sandnessjøen')?.name).toBe('Alstahaug');
  });

  it('prefers an exact name match over an alias on another place', () => {
    // "Grorud" is both a standalone place AND an alias of Oslo — the exact
    // name match must win.
    expect(resolvePlace('Grorud')?.name).toBe('Grorud');
  });

  it('matches by prefix', () => {
    expect(resolvePlace('Akersh')?.name).toBe('Akershus');
  });

  it('does not substring-match when query is shorter than 3 chars', () => {
    expect(resolvePlace('xq')).toBeNull();
  });

  it('falls through to substring match when no shorter tier hits', () => {
    // "kers" is a substring of "Akershus" but no name starts with "kers"
    expect(resolvePlace('kers')).not.toBeNull();
  });

  it('returns null when nothing matches', () => {
    expect(resolvePlace('zzznonexistent')).toBeNull();
  });
});

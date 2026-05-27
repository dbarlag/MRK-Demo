import { audienceFor, ALL_ACTIVITIES, AUDIENCE_LABELS, AUDIENCE_ORDER } from './audience';

describe('audienceFor', () => {
  it('maps a known activity to its bucket', () => {
    expect(audienceFor('Besøkstjeneste')).toBe('voksneEldre');
    expect(audienceFor('Hjelpekorps')).toBe('beredskap');
    expect(audienceFor('Barnas Røde Kors')).toBe('barnFamilie');
  });

  it('falls back to "tilleggsaktivitet" for unknown activity names', () => {
    expect(audienceFor('Made up activity that does not exist')).toBe('tilleggsaktivitet');
  });

  it('handles the exact double-space "Øvrige aktiviteter -  Røde Kors Ungdom" key', () => {
    expect(audienceFor('Øvrige aktiviteter -  Røde Kors Ungdom')).toBe('ungdom');
  });
});

describe('ALL_ACTIVITIES', () => {
  it('contains every mapped activity name', () => {
    expect(ALL_ACTIVITIES.length).toBeGreaterThan(40);
    expect(ALL_ACTIVITIES).toContain('Besøkstjeneste');
    expect(ALL_ACTIVITIES).toContain('Hjelpekorps');
  });

  it('orders entries so bucket index is monotonically non-decreasing', () => {
    let lastBucketIdx = 0;
    for (const name of ALL_ACTIVITIES) {
      const bucketIdx = AUDIENCE_ORDER.indexOf(audienceFor(name));
      expect(bucketIdx).toBeGreaterThanOrEqual(lastBucketIdx);
      lastBucketIdx = bucketIdx;
    }
  });
});

describe('AUDIENCE_LABELS', () => {
  it('has a label for every audience in AUDIENCE_ORDER', () => {
    for (const a of AUDIENCE_ORDER) {
      expect(AUDIENCE_LABELS[a]).toBeTruthy();
    }
  });
});

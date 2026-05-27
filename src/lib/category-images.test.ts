import { slugifyCategory, imageFor, FALLBACK_IMAGE } from './category-images';

describe('slugifyCategory', () => {
  it('lowercases', () => {
    expect(slugifyCategory('HELLO')).toBe('hello');
  });

  it('replaces æ with ae', () => {
    expect(slugifyCategory('Læring')).toBe('laering');
  });

  it('replaces ø with o', () => {
    expect(slugifyCategory('Besøkstjeneste')).toBe('besokstjeneste');
  });

  it('replaces å with aa', () => {
    expect(slugifyCategory('Kors på Halsen')).toBe('kors-paa-halsen');
  });

  it('collapses non-alphanumeric runs to a single hyphen', () => {
    expect(slugifyCategory('Røde Kors Friluftsliv og Førstehjelp (RØFF)')).toBe(
      'rode-kors-friluftsliv-og-forstehjelp-roff',
    );
  });

  it('strips leading and trailing hyphens', () => {
    expect(slugifyCategory(' Hello ')).toBe('hello');
    expect(slugifyCategory('---test---')).toBe('test');
  });
});

describe('imageFor', () => {
  it('returns a path under /activities/', () => {
    expect(imageFor('Besøkstjeneste')).toBe('/activities/besokstjeneste.jpg');
  });
});

describe('FALLBACK_IMAGE', () => {
  it('points to the default placeholder', () => {
    expect(FALLBACK_IMAGE).toBe('/activities/_default.jpg');
  });
});

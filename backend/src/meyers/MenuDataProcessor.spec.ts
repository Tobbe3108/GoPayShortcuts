import { describe, it, expect } from 'vitest';
import { MenuDataProcessor } from './MenuDataProcessor';

describe('MenuDataProcessor', () => {
  it('trimStringFields trims trailing whitespace in nested objects and arrays', () => {
    const input = {
      a: 'hello ',
      b: ['one ', { c: 'two ' }],
    };

    const out = MenuDataProcessor.trimStringFields(input as any);
    expect(out.a).toBe('hello');
    expect(Array.isArray(out.b)).toBe(true);
    expect(out.b[0]).toBe('one');
    expect(out.b[1].c).toBe('two');
  });

  it('extractMenuItems returns empty object when offers are missing', () => {
    expect(MenuDataProcessor.extractMenuItems({})).toEqual({});
    expect(
      MenuDataProcessor.extractMenuItems({ offers: {} })
    ).toEqual({});
  });

  it('extractMenuItems transforms a simple offers payload into date-keyed menu items', () => {
    const targetOfferId = 'ob6V4HfZK9Gs95sii4Cf';
    const timestamp = Math.floor(new Date('2023-03-01T00:00:00Z').getTime() / 1000).toString();

    const data: any = {
      offers: {
        [targetOfferId]: {
          items: [
            {
              id: 'item-1',
              name: 'Chicken ',
              category: 'Main ',
              dates: {
                [timestamp]: {
                  available: true,
                  menu: {
                    name: 'Lunch Menu ',
                    description: 'Tasty ',
                    pictograms: { veg: true },
                    labels: {},
                    allergens: {},
                  },
                },
              },
            },
          ],
        },
      },
    };

    const result = MenuDataProcessor.extractMenuItems(data);
    const dateStr = new Date(Number(timestamp) * 1000).toISOString().slice(0, 10);
    expect(result[dateStr]).toBeDefined();
    expect(result[dateStr].items).toHaveLength(1);
    const item = result[dateStr].items[0];
    expect(item.item_name).toBe('Chicken');
    expect(item.item_category).toBe('Main');
    expect(item.menu_name).toBe('Lunch Menu');
  });

  it('trimStringFields leaves non-string values alone', () => {
    const input = { n: 5, b: true, arr: [1, 'ok '] };
    const out = MenuDataProcessor.trimStringFields(input as any);
    expect(out.n).toBe(5);
    expect(out.b).toBe(true);
    expect(out.arr[1]).toBe('ok');
  });

  it('extractMenuItems skips unavailable or malformed date entries', () => {
    const targetOfferId = 'ob6V4HfZK9Gs95sii4Cf';
    const timestamp = Math.floor(new Date('2023-04-01T00:00:00Z').getTime() / 1000).toString();
    const data: any = {
      offers: {
        [targetOfferId]: {
          items: [
            { id: 'i1', name: 'X', category: 'C', dates: { [timestamp]: { available: false, menu: { name: 'M' } } } },
            { id: 'i2', name: 'Y', category: 'C', dates: { ['bad']: { menu: {} } } },
          ],
        },
      },
    };

    const result = MenuDataProcessor.extractMenuItems(data);
    expect(Object.keys(result)).toHaveLength(0);
  });

  it('returns menu items with localized weekday names', () => {
    const targetOfferId = 'ob6V4HfZK9Gs95sii4Cf';
    const timestamp = Math.floor(new Date('2023-05-01T00:00:00Z').getTime() / 1000).toString();
    const data: any = {
      offers: {
        [targetOfferId]: {
          items: [
            {
              id: 'i3',
              name: 'Z',
              category: 'Cat',
              dates: {
                [timestamp]: { available: true, menu: { name: 'M' } },
              },
            },
          ],
        },
      },
    };

    const result = MenuDataProcessor.extractMenuItems(data);
    const key = Object.keys(result)[0];
    expect(result[key].day_of_week).toBeDefined();
  });
});

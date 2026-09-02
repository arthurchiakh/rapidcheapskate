import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('getPublicHolidaysByDateRange', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('fetches every covered year and returns only holidays inside the range', async () => {
    const fetchMock = vi.fn(async (path: string) => ({
      json: async () =>
        path.endsWith('2025.json')
          ? [
              { date: '2025-12-24', holiday: 'Before range', unixTimeStamp: 1 },
              { date: '2025-12-31', holiday: 'Year end', unixTimeStamp: 2 }
            ]
          : [
              { date: '2026-01-01', holiday: 'New year', unixTimeStamp: 3 },
              { date: '2026-01-03', holiday: 'After range', unixTimeStamp: 4 }
            ]
    }));
    vi.stubGlobal('fetch', fetchMock);
    const { getPublicHolidaysByDateRange, Region } = await import('./getPublicHoliday');

    const result = await getPublicHolidaysByDateRange(
      Region.Selangor,
      new Date(2025, 11, 30),
      new Date(2026, 0, 2, 23, 59)
    );

    expect(result.map(({ holiday }) => holiday)).toEqual(['Year end', 'New year']);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls.map(([path]) => path)).toEqual([
      expect.stringMatching(/\/publicHolidays\/selangor-2025\.json$/),
      expect.stringMatching(/\/publicHolidays\/selangor-2026\.json$/)
    ]);
  });

  it('caches holiday data by region and year', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue([])
    } as unknown as Response);
    vi.stubGlobal('fetch', fetchMock);
    const { getPublicHolidaysByDateRange, Region } = await import('./getPublicHoliday');
    const start = new Date(2026, 0, 1);
    const end = new Date(2026, 0, 31);

    await getPublicHolidaysByDateRange(Region.KualaLumpur, start, end);
    await getPublicHolidaysByDateRange(Region.KualaLumpur, start, end);

    expect(fetchMock).toHaveBeenCalledOnce();
  });
});

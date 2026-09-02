import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Region } from './getPublicHoliday';

const { getPublicHolidaysByDateRange } = vi.hoisted(() => ({
  getPublicHolidaysByDateRange:
    vi.fn<
      [Region, Date, Date],
      Promise<{ date: string; holiday: string; unixTimeStamp: number }[]>
    >()
}));

vi.mock('./getPublicHoliday', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./getPublicHoliday')>()),
  getPublicHolidaysByDateRange
}));

describe('getDayUtilization', () => {
  beforeEach(() => {
    getPublicHolidaysByDateRange.mockReset().mockResolvedValue([]);
  });

  it('classifies working days, off days, and holidays with holiday precedence', async () => {
    getPublicHolidaysByDateRange.mockResolvedValue([
      { date: '2026-01-02', holiday: 'Test holiday', unixTimeStamp: 1 }
    ]);
    const { DayType, WorkingDay, getDayUtilization } = await import('./getPassUtilization');

    const result = await getDayUtilization(
      new Date(2026, 0, 1),
      [WorkingDay.Thursday, WorkingDay.Friday],
      Region.KualaLumpur,
      3
    );

    expect(result).toMatchObject({
      workingDayCount: 1,
      publicHolidayCount: 1,
      offDayCount: 1,
      utilizationDayCount: 1,
      totalDayCount: 3
    });
    const days = result.calendar.flat().filter(Boolean);
    expect(days.map((day) => day.type)).toEqual([
      DayType.WorkingDay,
      DayType.PublicHoliday,
      DayType.OffDay
    ]);
    expect(days[1].publicHoliday.holiday).toBe('Test holiday');
  });

  it('builds complete Sunday-to-Saturday calendar weeks', async () => {
    const { WorkingDay, getDayUtilization } = await import('./getPassUtilization');

    const result = await getDayUtilization(
      new Date(2026, 0, 1),
      [WorkingDay.Thursday],
      Region.Selangor,
      3
    );

    expect(result.calendar).toHaveLength(1);
    expect(result.calendar[0]).toHaveLength(7);
    expect(result.calendar[0].slice(0, 4)).toEqual([null, null, null, null]);
    expect(result.calendar[0].slice(4).map((day) => day.displayDate)).toEqual([
      '1/1',
      '1/2',
      '1/3'
    ]);
  });

  it('uses the 30-day default and does not mutate the supplied start date', async () => {
    const { WorkingDay, getDayUtilization } = await import('./getPassUtilization');
    const startDate = new Date(2026, 0, 1);

    const result = await getDayUtilization(
      startDate,
      [WorkingDay.Monday],
      Region.KualaLumpur
    );

    expect(result.totalDayCount).toBe(30);
    expect(startDate).toEqual(new Date(2026, 0, 1));
    expect(getPublicHolidaysByDateRange).toHaveBeenCalledWith(
      Region.KualaLumpur,
      startDate,
      new Date(2026, 0, 31)
    );
  });
});

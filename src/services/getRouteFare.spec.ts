import { beforeEach, describe, expect, it, vi } from 'vitest';

const fare = {
  from: 'KJ1',
  to: 'KJ2',
  fares: { cash: 2, cashless: 1.8, consession: 1, monthly: 0, weekly: 0 }
};

describe('getFare', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(fare)
      } as unknown as Response)
    );
  });

  it('normalizes the station order before fetching a fare', async () => {
    const { getFare } = await import('./getRouteFare');

    await expect(getFare('KJ2', 'KJ1')).resolves.toEqual(fare);

    expect(fetch).toHaveBeenCalledOnce();
    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/routeFares\/KJ1-KJ2\.json$/));
  });

  it('reuses the cached fare for either direction of the same route', async () => {
    const { getFare } = await import('./getRouteFare');

    await getFare('KJ1', 'KJ2');
    await getFare('KJ2', 'KJ1');

    expect(fetch).toHaveBeenCalledOnce();
  });

  it('propagates fetch failures', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('network unavailable'));
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const { getFare } = await import('./getRouteFare');

    await expect(getFare('KJ3', 'KJ4')).rejects.toThrow('network unavailable');
  });
});

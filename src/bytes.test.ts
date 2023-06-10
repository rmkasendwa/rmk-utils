import { formatBytes } from './bytes';

describe('formatBytes', () => {
  it('should format bytes correctly', () => {
    expect(formatBytes(500)).toBe('500 bytes');
    expect(formatBytes(1500000)).toBe('1.43 MB');
    expect(formatBytes(2000000000)).toBe('1.86 GB');
    expect(formatBytes(5000000000)).toBe('4.66 GB');
  });

  it('should handle edge case of 0 bytes', () => {
    expect(formatBytes(0)).toBe('0 bytes');
  });

  it('should handle negative values', () => {
    expect(formatBytes(-500)).toBe('-500 bytes');
    expect(formatBytes(-1500000)).toBe('-1.43 MB');
    expect(formatBytes(-2000000000)).toBe('-1.86 GB');
    expect(formatBytes(-5000000000)).toBe('-4.66 GB');
  });
});

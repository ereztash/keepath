import { formatCurrency, formatNumber, formatPercentage, calculatePercentageChange } from '../lib/utils';

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
    });
  });

  describe('formatNumber', () => {
    it('should format numbers correctly', () => {
      expect(formatNumber(1000)).toBe('1,000');
      expect(formatNumber(1234567)).toBe('1,234,567');
      expect(formatNumber(0)).toBe('0');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentages correctly', () => {
      expect(formatPercentage(12.5)).toBe('12.50%');
      expect(formatPercentage(100)).toBe('100.00%');
      expect(formatPercentage(0.5)).toBe('0.50%');
    });
  });

  describe('calculatePercentageChange', () => {
    it('should calculate percentage change correctly', () => {
      expect(calculatePercentageChange(150, 100)).toBe(50);
      expect(calculatePercentageChange(75, 100)).toBe(-25);
      expect(calculatePercentageChange(100, 0)).toBe(0);
      expect(calculatePercentageChange(100, 100)).toBe(0);
    });
  });
});

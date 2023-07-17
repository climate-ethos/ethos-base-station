import { describe, expect, it } from 'vitest';
import { parseCssLengthValue } from 'src/helpers/css';

describe('Helper CSS', () => {
  it('should parse px values', () => {
    expect(parseCssLengthValue('100px')).toBe(100);
  });

  it('should parse vh values', () => {
    window.innerHeight = 800;
    expect(parseCssLengthValue('50vh')).toBe(400);
  });

  it('should parse em values', () => {
    document.documentElement.style.fontSize = '16px';
    expect(parseCssLengthValue('2em')).toBe(32);
  });

  it('should parse vw values', () => {
    window.innerWidth = 1000;
    expect(parseCssLengthValue('50vw')).toBe(500);
  });

  it('should parse vmin values', () => {
    window.innerHeight = 800;
    window.innerWidth = 600;
    expect(parseCssLengthValue('50vmin')).toBe(300);
  });

  it('should parse vmax values', () => {
    window.innerHeight = 800;
    window.innerWidth = 600;
    expect(parseCssLengthValue('50vmax')).toBe(400);
  });

  it('should parse rem values', () => {
    document.documentElement.style.fontSize = '16px';
    expect(parseCssLengthValue('2rem')).toBe(32);
  });

  it('should parse cm values', () => {
    expect(parseCssLengthValue('2cm')).toBeCloseTo(75.59, 2);
  });

  it('should parse mm values', () => {
    expect(parseCssLengthValue('10mm')).toBeCloseTo(37.795, 3);
  });

  it('should parse in values', () => {
    expect(parseCssLengthValue('1in')).toBeCloseTo(96, 0);
  });

  it('should parse pt values', () => {
    expect(parseCssLengthValue('72pt')).toBeCloseTo(96, 0);
  });

  it('should parse pc values', () => {
    expect(parseCssLengthValue('1pc')).toBeCloseTo(16, 0);
  });

  it('returns undefined when the height is undefined', () => {
    expect(parseCssLengthValue(undefined)).toBe(undefined);
  });

  it('returns undefined when the height unit is unrecognized', () => {
    expect(parseCssLengthValue('100xyz')).toBe(undefined);
  });
});

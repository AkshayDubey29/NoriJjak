import { describe, it, expect } from 'vitest';
import { TRANSLATIONS } from '../index';

describe('Shared Translations', () => {
  it('should have ko-KR translations', () => {
    expect(TRANSLATIONS['ko-KR']).toBeDefined();
  });

  it('should have en-US translations', () => {
    expect(TRANSLATIONS['en-US']).toBeDefined();
  });
});


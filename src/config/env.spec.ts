import { parseUseMockApi } from './env';

describe('parseUseMockApi', () => {
  it('ativa com true ou 1', () => {
    expect(parseUseMockApi('true')).toBe(true);
    expect(parseUseMockApi('1')).toBe(true);
  });

  it('desativa com outros valores', () => {
    expect(parseUseMockApi(undefined)).toBe(false);
    expect(parseUseMockApi('false')).toBe(false);
    expect(parseUseMockApi('')).toBe(false);
  });
});

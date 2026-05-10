import { isCnpjLengthValid, normalizeCnpjDigits } from './cnpj';

describe('normalizeCnpjDigits', () => {
  it('remove não-dígitos e limita a 14', () => {
    expect(normalizeCnpjDigits('12.345.678/0001-90')).toBe('12345678000190');
    expect(normalizeCnpjDigits('123456789012345678')).toBe('12345678901234');
  });
});

describe('isCnpjLengthValid', () => {
  it('exige 14 dígitos', () => {
    expect(isCnpjLengthValid('12345678901234')).toBe(true);
    expect(isCnpjLengthValid('123')).toBe(false);
  });
});

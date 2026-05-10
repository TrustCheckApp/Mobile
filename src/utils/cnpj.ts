/** Apenas UX: dígitos e tamanho 14. Validação oficial fica na API. */
export function normalizeCnpjDigits(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 14);
}

export function isCnpjLengthValid(digits: string): boolean {
  return digits.length === 14;
}

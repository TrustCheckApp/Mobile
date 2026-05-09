/**
 * CNPJ validation utility
 * Validates CNPJ format and checksum according to Brazilian rules
 */

export function formatCNPJ(value: string): string {
  // Remove all non-numeric characters
  const numbers = value.replace(/\D/g, '');
  
  // Apply mask: XX.XXX.XXX/XXXX-XX
  if (numbers.length <= 2) {
    return numbers;
  }
  if (numbers.length <= 5) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2)}`;
  }
  if (numbers.length <= 8) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5)}`;
  }
  if (numbers.length <= 12) {
    return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8)}`;
  }
  return `${numbers.slice(0, 2)}.${numbers.slice(2, 5)}.${numbers.slice(5, 8)}/${numbers.slice(8, 12)}-${numbers.slice(12, 14)}`;
}

export function isValidCNPJ(cnpj: string): boolean {
  // Remove mask and non-numeric characters
  const numbers = cnpj.replace(/\D/g, '');
  
  // CNPJ must have 14 digits
  if (numbers.length !== 14) {
    return false;
  }
  
  // Check if all digits are the same (invalid CNPJ)
  if (/^(\d)\1+$/.test(numbers)) {
    return false;
  }
  
  // Calculate first verification digit
  let sum = 0;
  let weight = 5;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(numbers[i]) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  let remainder = sum % 11;
  const digit1 = remainder < 2 ? 0 : 11 - remainder;
  
  if (digit1 !== parseInt(numbers[12])) {
    return false;
  }
  
  // Calculate second verification digit
  sum = 0;
  weight = 6;
  for (let i = 0; i < 13; i++) {
    sum += parseInt(numbers[i]) * weight;
    weight = weight === 2 ? 9 : weight - 1;
  }
  remainder = sum % 11;
  const digit2 = remainder < 2 ? 0 : 11 - remainder;
  
  return digit2 === parseInt(numbers[13]);
}

export function getCNPJError(cnpj: string): string | null {
  const numbers = cnpj.replace(/\D/g, '');
  
  if (numbers.length !== 14) {
    return 'CNPJ deve ter 14 dígitos';
  }
  
  if (/^(\d)\1+$/.test(numbers)) {
    return 'CNPJ inválido: todos os dígitos são iguais';
  }
  
  if (!isValidCNPJ(cnpj)) {
    return 'CNPJ inválido: verifique os dígitos';
  }
  
  return null;
}

/**
 * Sri Lankan Phone Number Normalizer & Validator (E.164)
 */

export function normalizeSriLankanPhone(input: string): string | null {
  if (!input) return null;

  // Strip all non-numeric characters except leading '+'
  const cleaned = input.trim().replace(/[\s\-\(\)\.]/g, "");

  let normalized: string;

  if (cleaned.startsWith("+94")) {
    normalized = cleaned;
  } else if (cleaned.startsWith("0094")) {
    normalized = "+" + cleaned.slice(2);
  } else if (cleaned.startsWith("94")) {
    normalized = "+" + cleaned;
  } else if (cleaned.startsWith("0")) {
    normalized = "+94" + cleaned.slice(1);
  } else if (cleaned.length === 9) {
    // E.g., user entered 771234567 without leading 0
    normalized = "+94" + cleaned;
  } else {
    return null;
  }

  // Sri Lanka E.164 format: +94 followed by 9 digits (total 12 characters)
  if (!/^\+94\d{9}$/.test(normalized)) {
    return null;
  }

  return normalized;
}

export function isValidSriLankanPhone(input: string): boolean {
  return normalizeSriLankanPhone(input) !== null;
}

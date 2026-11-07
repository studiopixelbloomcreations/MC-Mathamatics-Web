/**
 * Sri Lankan Phone Number Normalizer & Validator (E.164)
 */

export function normalizeSriLankanPhone(input: string): string | null {
  if (!input) return null;

  // Strip all non-numeric characters except leading '+'
  const cleaned = input.trim().replace(/[\s\-\(\)\.]/g, "");

  // If already full international number without +, add +
  if (/^\d{10,15}$/.test(cleaned)) {
    // If starts with 0 (Sri Lanka local format 07xxxxxxxx)
    if (cleaned.startsWith("0") && cleaned.length === 10) {
      return "+94" + cleaned.slice(1);
    }
    // If starts with 94 (Sri Lanka without plus 947xxxxxxxx)
    if (cleaned.startsWith("94") && cleaned.length === 11) {
      return "+" + cleaned;
    }
    // If 9 digits (7xxxxxxxx)
    if (cleaned.length === 9) {
      return "+94" + cleaned;
    }
    // Any other international number from Meta (e.g. 1xxxxxxxxxx, 44xxxxxxxxx, etc.)
    return "+" + cleaned;
  }

  if (cleaned.startsWith("+")) {
    const digitsOnly = cleaned.slice(1);
    if (/^\d{9,15}$/.test(digitsOnly)) {
      return cleaned;
    }
  }

  return null;
}

export function isValidSriLankanPhone(input: string): boolean {
  return normalizeSriLankanPhone(input) !== null;
}

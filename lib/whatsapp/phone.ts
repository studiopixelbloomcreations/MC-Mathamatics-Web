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
    normalized = "+94" + cleaned.slice(4);
  } else if (cleaned.startsWith("94")) {
    normalized = "+94" + cleaned.slice(2);
  } else if (cleaned.startsWith("0") && cleaned.length === 10) {
    normalized = "+94" + cleaned.slice(1);
  } else if (cleaned.length === 9 && !cleaned.startsWith("+")) {
    normalized = "+94" + cleaned;
  } else {
    return null;
  }

  // Strict Sri Lanka E.164: +94 followed by 9 digits
  if (!/^\+94\d{9}$/.test(normalized)) {
    return null;
  }

  return normalized;
}

export function isValidSriLankanPhone(input: string): boolean {
  return normalizeSriLankanPhone(input) !== null;
}

/**
 * Normalizes any valid incoming phone number from Meta Cloud API (including international test numbers like +1 555 144 4070).
 */
export function normalizeAnyPhone(input: string): string | null {
  if (!input) return null;
  const cleaned = input.trim().replace(/[\s\-\(\)\.]/g, "");
  if (!cleaned) return null;

  if (cleaned.startsWith("+")) {
    const digits = cleaned.slice(1);
    if (/^\d{9,15}$/.test(digits)) return cleaned;
  } else if (/^\d{9,15}$/.test(cleaned)) {
    // If Sri Lankan format
    const sl = normalizeSriLankanPhone(cleaned);
    if (sl) return sl;
    return "+" + cleaned;
  }
  return null;
}

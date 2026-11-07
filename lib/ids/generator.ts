export function formatStudentId(grade: number, classType: "T" | "TP", serial: number): string {
  return `MCG${grade}${classType}${serial}`;
}

export function parseStudentId(id: string): {
  valid: boolean;
  grade?: number;
  classType?: "T" | "TP";
  serial?: number;
} {
  const normalized = id.trim().toUpperCase();
  const match = normalized.match(/^MCG(6|7|8|9|10|11|12|13)(T|TP)(\d{4,})$/);
  if (!match) return { valid: false };

  return {
    valid: true,
    grade: parseInt(match[1], 10),
    classType: match[2] as "T" | "TP",
    serial: parseInt(match[3], 10),
  };
}

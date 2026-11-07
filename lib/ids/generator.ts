export function formatStudentId(grade: number, classType: "T" | "TP", serial: number): string {
  return `MCG${grade}${classType}${serial}`;
}

export function getStudentIdPrefix(grade: number, classType: "T" | "TP"): string {
  return `MCG${grade}${classType}`;
}

export function parseStudentId(id: string): {
  valid: boolean;
  grade?: number;
  classType?: "T" | "TP";
  serial?: number;
} {
  const normalized = id.trim().toUpperCase();
  const match = normalized.match(/^MCG(0?[6-9]|1[0-3])(TP|T)(\d{4,})$/);
  if (!match) return { valid: false };

  return {
    valid: true,
    grade: parseInt(match[1], 10),
    classType: match[2] as "T" | "TP",
    serial: parseInt(match[3], 10),
  };
}

export function syntheticEmailFromId(uniqueId: string): string {
  return `${uniqueId.trim().toLowerCase()}@students.mcmaths.lk`;
}

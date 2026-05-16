/**
 * Case-insensitive check if a note indicates absence ("vắng").
 * Handles: vắng, Vắng, VẮNG, vẮng, etc.
 */
export function isAbsentNote(note: string | null | undefined): boolean {
  if (!note) return false;
  return note.toLowerCase().includes("vắng");
}

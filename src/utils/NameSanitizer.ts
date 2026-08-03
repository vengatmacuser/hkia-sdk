/**
 * NameSanitizer - Sanitizes passenger surnames and given names according to
 * ICAO Doc 9303 MRZ passport specifications.
 */
export class NameSanitizer {
  /**
   * Sanitizes surname or given name by removing accents, non-letters, and converting to uppercase.
   */
  static sanitize(name?: string): string {
    if (!name) return '';
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Strip diacritics / accents
      .replace(/[^a-zA-Z\s]/g, '') // Keep ASCII letters and spaces
      .trim()
      .toUpperCase();
  }

  /**
   * Checks if surname and given name match scanned passport MRZ data.
   */
  static isMatch(expectedName: string, scannedName: string): boolean {
    const s1 = this.sanitize(expectedName);
    const s2 = this.sanitize(scannedName);
    return s1.includes(s2) || s2.includes(s1);
  }
}

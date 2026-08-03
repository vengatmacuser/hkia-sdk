/**
 * DateFormatterHelper - Produces ISO-8601 millisecond timestamps.
 */
export class DateFormatterHelper {
  /**
   * Returns current high-precision ISO-8601 UTC timestamp (e.g. "2026-08-03T17:04:15.123Z").
   */
  static getIsoTimestamp(date = new Date()): string {
    return date.toISOString();
  }

  /**
   * Formats a date for HKIA API requests ("yyyyMMddHHmmssSSS").
   */
  static getHkiaTimestamp(date = new Date()): string {
    const pad = (n: number, z = 2) => ('00' + n).slice(-z);
    return (
      date.getUTCFullYear() +
      pad(date.getUTCMonth() + 1) +
      pad(date.getUTCDate()) +
      pad(date.getUTCHours()) +
      pad(date.getUTCMinutes()) +
      pad(date.getUTCSeconds()) +
      pad(date.getUTCMilliseconds(), 3)
    );
  }
}

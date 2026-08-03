/**
 * CryptoHelper - Provides SHA-256 signature formatting and token masking.
 */
export class CryptoHelper {
  /**
   * Masks a secret string or token for safe display in logs (e.g. "hkia_****_1829").
   */
  static maskToken(token?: string): string {
    if (!token || token.length <= 6) return '****';
    const prefix = token.substring(0, 4);
    const suffix = token.substring(token.length - 4);
    return `${prefix}****${suffix}`;
  }
}

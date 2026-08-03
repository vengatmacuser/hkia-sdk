import { HKIABCBPSummary } from '../types/bcbp';

/**
 * BCBPHelper - Utility class for parsing, validating, and formatting
 * IATA Bar-Coded Boarding Pass (BCBP) strings.
 */
export class BCBPHelper {
  /**
   * Parses a raw IATA BCBP string into a structured summary object.
   */
  static parseBCBP(rawBCBP: string): HKIABCBPSummary {
    const trimmed = (rawBCBP || '').trim();
    if (!trimmed || trimmed.length < 20) {
      return {
        rawBCBP: trimmed,
        passengerName: '',
        surname: '',
        givenName: '',
        pnr: '',
        origin: '',
        destination: '',
        carrier: '',
        flightNumber: '',
        julianDate: '',
        compartmentCode: '',
        seatNumber: '',
        sequenceNumber: '',
        isValid: false,
      };
    }

    try {
      // Standard IATA BCBP format starts with 'M1'
      const isHeaderValid = trimmed.startsWith('M1') || trimmed.startsWith('M2');
      const passengerName = trimmed.substring(2, 22).trim();
      const pnr = trimmed.substring(23, 30).trim();
      const origin = trimmed.substring(30, 33).trim();
      const destination = trimmed.substring(33, 36).trim();
      const carrier = trimmed.substring(36, 39).trim();
      const flightNumber = trimmed.substring(39, 44).trim();
      const julianDate = trimmed.substring(44, 47).trim();
      const compartmentCode = trimmed.substring(47, 48).trim();
      const seatNumber = trimmed.substring(48, 52).trim();
      const sequenceNumber = trimmed.substring(52, 57).trim();

      const nameParts = passengerName.split('/');
      const surname = (nameParts[0] || '').trim();
      const givenName = (nameParts[1] || '').trim();

      return {
        rawBCBP: trimmed,
        passengerName,
        surname,
        givenName,
        pnr,
        origin,
        destination,
        carrier,
        flightNumber,
        julianDate,
        compartmentCode,
        seatNumber,
        sequenceNumber,
        isValid: isHeaderValid,
      };
    } catch {
      return {
        rawBCBP: trimmed,
        passengerName: '',
        surname: '',
        givenName: '',
        pnr: '',
        origin: '',
        destination: '',
        carrier: '',
        flightNumber: '',
        julianDate: '',
        compartmentCode: '',
        seatNumber: '',
        sequenceNumber: '',
        isValid: false,
      };
    }
  }

  /**
   * Validates if a string matches basic BCBP specifications.
   */
  static isValidBCBP(rawBCBP: string): boolean {
    return this.parseBCBP(rawBCBP).isValid;
  }
}

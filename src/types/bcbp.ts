/**
 * Parsed IATA Bar-Coded Boarding Pass (BCBP) Data Structure.
 */
export interface HKIABCBPSummary {
  rawBCBP: string;
  passengerName: string;
  surname: string;
  givenName: string;
  pnr: string;
  origin: string;
  destination: string;
  carrier: string;
  flightNumber: string;
  julianDate: string;
  compartmentCode: string;
  seatNumber: string;
  sequenceNumber: string;
  isValid: boolean;
}

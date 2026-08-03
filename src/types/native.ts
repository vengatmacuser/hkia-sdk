/**
 * Strict TypeScript Definitions for Native Bridge Module API Contracts.
 */

export interface HKIAInitConfig {
  appId: string;
  apiKey: string;
  /** Optional language override: 'cn' | 'de' | 'en' | 'fr' | 'gb' | 'hk' | 'it' | 'jp' | 'ko' | 'th' | 'tw' | 'zh' */
  language?: string;
}

export interface HKIAPassportProcessResult {
  success: boolean;
  message: string;
  passengerName?: string;
  bcbp?: string;
  enrollmentToken?: string;
}

export interface HKIABagDropOptions {
  bcbp?: string;
  isSandbox?: boolean;
  pairInfo?: string;
}

export interface HKIABagDropResult {
  success: boolean;
  claimTagJson?: string;
}

export interface HKIALogEntryTS {
  timestamp: string;
  epochMs: number;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  tag: string;
  step: string;
  message: string;
  metadata?: Record<string, any>;
}

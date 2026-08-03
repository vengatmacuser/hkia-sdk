export interface HKIAErrorReport {
  errorCode: string;
  errorMessage: string;
  userFacingSummary: string;
  nativeSource: 'Android' | 'iOS' | 'JavaScript';
  timestamp: string;
  callStack?: string;
  technicalDetails?: Record<string, any>;
}

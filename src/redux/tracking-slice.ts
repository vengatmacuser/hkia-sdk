import { HKIALogEntryTS } from '../types/native';
import { HKIAErrorReport } from '../types/error';

export interface HKIATrackingState {
  currentStep: 'IDLE' | 'CONFIGURING' | 'SCANNING_PASSPORT' | 'ENROLLING_TOKEN' | 'BAGDROP_ACTIVE' | 'COMPLETED' | 'ERROR';
  isNativeScanning: boolean;
  nfcProgress: number;
  lastPassportScanSuccess: boolean;
  lastEnrollmentToken: string | null;
  claimTagResult: any | null;
  nativeLogs: HKIALogEntryTS[];
  errorReport: HKIAErrorReport | null;
}

const initialState: HKIATrackingState = {
  currentStep: 'IDLE',
  isNativeScanning: false,
  nfcProgress: 0,
  lastPassportScanSuccess: false,
  lastEnrollmentToken: null,
  claimTagResult: null,
  nativeLogs: [],
  errorReport: null,
};

export const HKIA_NATIVE_EVENT = 'hkia/tracking/nativeEvent';

export function hkiaTrackingReducer(
  state = initialState,
  action: { type: string; payload?: any }
): HKIATrackingState {
  switch (action.type) {
    case HKIA_NATIVE_EVENT:
      const { eventName, message } = action.payload || {};
      if (eventName === 'HKIA_NATIVE_PASSPORT_SCAN_LAUNCHED') {
        return { ...state, currentStep: 'SCANNING_PASSPORT', isNativeScanning: true };
      }
      if (eventName === 'HKIA_NATIVE_PASSPORT_READ_SUCCESS') {
        return { ...state, currentStep: 'ENROLLING_TOKEN', isNativeScanning: false, lastPassportScanSuccess: true };
      }
      if (eventName === 'HKIA_NATIVE_SEMI_TOKEN_ENROLLED') {
        return { ...state, currentStep: 'COMPLETED', lastEnrollmentToken: message };
      }
      return state;
    default:
      return state;
  }
}

export default hkiaTrackingReducer;

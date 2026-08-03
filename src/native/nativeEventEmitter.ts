import { NativeEventEmitter, NativeModules } from 'react-native';
import { HKIALogger } from './logger';

const { CheckInSDKModule } = NativeModules;

export type HKIANativeEventListener = (event: {
  eventName: string;
  timestamp?: string;
  message?: string;
  step?: string;
  claimTagJson?: string;
}) => void;

class HKIANativeTelemetryBridge {
  private eventEmitter: NativeEventEmitter | null = null;
  private listeners: Set<HKIANativeEventListener> = new Set();

  constructor() {
    if (CheckInSDKModule) {
      try {
        this.eventEmitter = new NativeEventEmitter(CheckInSDKModule);
        this.eventEmitter.addListener('HKIA_TELEMETRY_EVENT', (data) => {
          HKIALogger.info('HKIA:NativeBridge', data.step || 'TELEMETRY', data.message || data.eventName);
          this.listeners.forEach((listener) => listener(data));
        });
      } catch (e) {
        HKIALogger.warn('HKIA:NativeBridge', 'INIT_WARN', 'Failed to attach NativeEventEmitter listener');
      }
    }
  }

  addListener(listener: HKIANativeEventListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  removeAllListeners() {
    this.listeners.clear();
  }
}

export const hkiaNativeTelemetryBridge = new HKIANativeTelemetryBridge();

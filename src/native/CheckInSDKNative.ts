import { NativeModules } from 'react-native';
import { HKIAInitConfig, HKIAPassportProcessResult } from '../types/native';
import { HKIALanguage } from '../types/i18n';
import { HKIALogger } from './logger';
import { NameSanitizer } from '../utils/NameSanitizer';

const { CheckInSDKModule } = NativeModules;

/**
 * CheckInSDKService - Strongly-typed, exception-guarded JS Proxy for HKIA Check-In SDK.
 */
export class CheckInSDKService {
  private static isConfigured = false;
  private static activeLanguage: HKIALanguage = 'en';

  private static getNativeModule() {
    if (!CheckInSDKModule) {
      HKIALogger.warn('HKIA:CheckIn', 'NATIVE_MODULE_MISSING', 'CheckInSDKModule is unlinked or running in mock environment.');
      return null;
    }
    return CheckInSDKModule;
  }

  /**
   * Initialises Check-In SDK API credentials and optional default language.
   *
   * @param config HKIA credentials configuration object with optional language.
   * @returns Promise resolving to boolean success status.
   */
  static async initializeConfig(config: HKIAInitConfig): Promise<boolean> {
    HKIALogger.info('HKIA:CheckIn', 'STEP 1/4: CONFIG_INIT', `Initializing CheckIn config (appId=${config.appId})`);
    if (config.language) {
      this.activeLanguage = config.language as HKIALanguage;
    }
    const native = this.getNativeModule();
    if (!native) {
      this.isConfigured = true;
      return true;
    }
    try {
      const ok = await native.initializeCheckInConfig(config.appId, config.apiKey);
      this.isConfigured = ok;
      return ok;
    } catch (e: any) {
      HKIALogger.error('HKIA:CheckIn', 'ERROR_CONFIG', `Config failed: ${e.message}`);
      throw e;
    }
  }

  /**
   * Returns current active language setting.
   */
  static getActiveLanguage(): HKIALanguage {
    return this.activeLanguage;
  }

  /**
   * Returns current native application bundle ID / package name dynamically.
   */
  static async getBundleId(): Promise<string> {
    const native = this.getNativeModule();
    if (!native) return 'com.hkia.app';
    try {
      return await native.getBundleId();
    } catch {
      return 'com.hkia.app';
    }
  }

  /**
   * Launches passport scanning activity/view with optional passenger surname, given name, and language.
   * Package name is automatically resolved natively on Android and iOS.
   */
  static async initializeWithNames(
    surname?: string,
    givenName?: string,
    language?: HKIALanguage
  ): Promise<boolean> {
    const lang = language || this.activeLanguage;
    const cleanSurname = NameSanitizer.sanitize(surname);
    const cleanGivenName = NameSanitizer.sanitize(givenName);

    HKIALogger.info(
      'HKIA:CheckIn',
      'STEP 2/4: PASSPORT_SCAN',
      `Launching scan for ${cleanSurname}/${cleanGivenName} (lang=${lang})`
    );

    const native = this.getNativeModule();
    if (!native) {
      // Mock environment fallback
      HKIALogger.info('HKIA:CheckIn', 'STEP 2/4: MOCK_SCAN', 'Simulating successful passport scan in sandbox mode');
      return true;
    }

    try {
      return await native.initializeWithNames(cleanSurname, cleanGivenName);
    } catch (e: any) {
      HKIALogger.error('HKIA:CheckIn', 'ERROR_SCAN', `Passport scan failed: ${e.message}`);
      return false;
    }
  }

  /**
   * Lightweight alternative launching passport scan.
   */
  static async scanPassport(language?: HKIALanguage): Promise<boolean> {
    return this.initializeWithNames(undefined, undefined, language);
  }

  /**
   * Enrolls BCBP boarding pass string and creates biometric semi-token.
   */
  static async processPassport(bcbp: string): Promise<HKIAPassportProcessResult> {
    HKIALogger.info('HKIA:CheckIn', 'STEP 3/4: TOKEN_ENROLLMENT', `Processing BCBP (len=${bcbp.length})`);
    const native = this.getNativeModule();
    if (!native) {
      return {
        success: true,
        message: 'Mock Token Enrolled',
        passengerName: 'MOCK/PASSENGER',
        bcbp,
        enrollmentToken: `TOK_MOCK_${Date.now()}`,
      };
    }
    try {
      const res = await native.processPassport(bcbp);
      HKIALogger.info('HKIA:CheckIn', 'STEP 4/4: SUCCESS', `Token enrolled: ${res.enrollmentToken}`);
      return res;
    } catch (e: any) {
      HKIALogger.error('HKIA:CheckIn', 'ERROR_ENROLLMENT', `Token enrollment failed: ${e.message}`);
      return { success: false, message: e.message };
    }
  }

  /**
   * Returns whether passport token has been enrolled.
   */
  static async isPassportEnrolled(): Promise<boolean> {
    const native = this.getNativeModule();
    if (!native) return true;
    try {
      return await native.isPassportEnrolled();
    } catch {
      return false;
    }
  }
}

import { HKIAThemeConfig } from '../types/theme';

export const defaultTheme: HKIAThemeConfig = {
  primaryColor: '#5C2D91',
  secondaryColor: '#EAA123',
  accentColor: '#4A90E2',
  backgroundColor: '#F7F8FA',
  cardBackgroundColor: '#FFFFFF',
  textColor: '#1A1A1A',
  subtextColor: '#666666',
  borderRadius: 12,
  mode: 'light',
};

export class ThemeHelper {
  static getTheme(overrideTheme?: HKIAThemeConfig): HKIAThemeConfig {
    return { ...defaultTheme, ...overrideTheme };
  }
}

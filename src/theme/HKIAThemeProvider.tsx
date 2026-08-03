import React, { createContext, useContext } from 'react';
import { HKIAThemeConfig } from '../types/theme';
import { defaultThemeTokens } from './tokens';

const HKIAThemeContext = createContext<Required<HKIAThemeConfig>>(defaultThemeTokens);

export interface HKIAThemeProviderProps {
  theme?: HKIAThemeConfig;
  children: React.ReactNode;
}

export const HKIAThemeProvider: React.FC<HKIAThemeProviderProps> = ({ theme, children }) => {
  const mergedTheme: Required<HKIAThemeConfig> = {
    ...defaultThemeTokens,
    ...theme,
  };

  return <HKIAThemeContext.Provider value={mergedTheme}>{children}</HKIAThemeContext.Provider>;
};

export const useHKIATheme = (): Required<HKIAThemeConfig> => {
  return useContext(HKIAThemeContext);
};

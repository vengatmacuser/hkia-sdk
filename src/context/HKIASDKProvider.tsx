import React, { createContext, useContext, useState } from 'react';
import { HKIALanguage } from '../types/i18n';
import { HKIAInitConfig } from '../types/native';

export interface HKIASDKContextValue {
  config: HKIAInitConfig | null;
  language: HKIALanguage;
  isEnrolled: boolean;
  enrollmentToken: string | null;
  setLanguage: (lang: HKIALanguage) => void;
  setEnrolled: (token: string) => void;
}

const HKIASDKContext = createContext<HKIASDKContextValue>({
  config: null,
  language: 'en',
  isEnrolled: false,
  enrollmentToken: null,
  setLanguage: () => {},
  setEnrolled: () => {},
});

export interface HKIASDKProviderProps {
  initialConfig?: HKIAInitConfig;
  initialLanguage?: HKIALanguage;
  children: React.ReactNode;
}

export const HKIASDKProvider: React.FC<HKIASDKProviderProps> = ({
  initialConfig,
  initialLanguage = 'en',
  children,
}) => {
  const [config] = useState<HKIAInitConfig | null>(initialConfig || null);
  const [language, setLanguage] = useState<HKIALanguage>(initialLanguage);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollmentToken, setEnrollmentToken] = useState<string | null>(null);

  const setEnrolled = (token: string) => {
    setIsEnrolled(true);
    setEnrollmentToken(token);
  };

  return (
    <HKIASDKContext.Provider
      value={{
        config,
        language,
        isEnrolled,
        enrollmentToken,
        setLanguage,
        setEnrolled,
      }}
    >
      {children}
    </HKIASDKContext.Provider>
  );
};

export const useHKIASDK = () => useContext(HKIASDKContext);

import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { HKIAErrorBoundary } from '../components/HKIAErrorBoundary';
import { BCBPForm, EMPTY_ROUTE, RouteField } from '../components/BCBPForm';
import { MileageHeader } from '../components/MileageHeader';
import { useHKIATheme } from '../theme/HKIAThemeProvider';
import { HKIALanguage } from '../types/i18n';
import { CheckInSDKService } from '../native/CheckInSDKNative';
import { Toast } from '../components/Toast';

export interface BoardingPassGeneratorProps {
  initialSurname?: string;
  initialGivenName?: string;
  initialBookingRef?: string;
  language?: HKIALanguage;
  onExit?: () => void;
  onTokenGenerated?: (token: string) => void;
}

const BoardingPassGeneratorContent: React.FC<BoardingPassGeneratorProps> = ({
  initialSurname = '',
  initialGivenName = '',
  initialBookingRef = '',
  language,
  onTokenGenerated,
}) => {
  const { t } = useTranslation();
  const theme = useHKIATheme();
  const [surname, setSurname] = useState(initialSurname);
  const [givenName, setGivenName] = useState(initialGivenName);
  const [bookingRef, setBookingRef] = useState(initialBookingRef);
  const [numLegs, setNumLegs] = useState('1');
  const [routes, setRoutes] = useState<RouteField[]>([EMPTY_ROUTE()]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handleRouteFieldChange = (index: number, field: keyof RouteField, value: string) => {
    setRoutes((prev) => {
      const next = [...prev];
      if (!next[index]) next[index] = EMPTY_ROUTE();
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleProcessScan = async () => {
    try {
      const mockBCBP = `M1${(surname || 'SMITH').padEnd(20)} ${bookingRef.padEnd(7)}HKGBKK` +
        `${routes[0]?.carrier || 'TG'}${routes[0]?.flightNum || '603'} ${routes[0]?.journeyDate || '243'}W${routes[0]?.seatNumber || '012A'}0001`;

      const success = await CheckInSDKService.initializeWithNames(
        surname,
        givenName,
        language
      );
      if (success) {
        const tokenRes = await CheckInSDKService.processPassport(mockBCBP);
        setToastType('success');
        setToastMsg(t('scanSuccess', 'Passport scanned & token enrolled!'));
        setToastVisible(true);
        if (onTokenGenerated && tokenRes.enrollmentToken) {
          onTokenGenerated(tokenRes.enrollmentToken);
        }
      } else {
        setToastType('error');
        setToastMsg(t('scanFailed', 'Scan cancelled or failed.'));
        setToastVisible(true);
      }
    } catch (e: any) {
      setToastType('error');
      setToastMsg(e.message || 'SDK Error');
      setToastVisible(true);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <MileageHeader />
      <View style={styles.body}>
        <BCBPForm
          surname={surname}
          givenName={givenName}
          bookingRef={bookingRef}
          routes={routes}
          numLegs={numLegs}
          from="HKG"
          errors={{}}
          onSurnameChange={setSurname}
          onGivenNameChange={setGivenName}
          onBookingRefChange={setBookingRef}
          onNumLegsChange={setNumLegs}
          onRouteFieldChange={handleRouteFieldChange}
          language={language}
        />

        <TouchableOpacity
          style={[styles.scanBtn, { backgroundColor: theme.primaryColor }]}
          onPress={handleProcessScan}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={t('passportScanner', 'Scan Passport')}
        >
          <Text style={styles.scanBtnText}>{t('passportScanner', 'Scan Passport & Enroll Token')}</Text>
        </TouchableOpacity>
      </View>

      <Toast
        visible={toastVisible}
        message={toastMsg}
        type={toastType}
        onHide={() => setToastVisible(false)}
      />
    </ScrollView>
  );
};

export const BoardingPassGenerator: React.FC<BoardingPassGeneratorProps> = (props) => (
  <HKIAErrorBoundary>
    <BoardingPassGeneratorContent {...props} />
  </HKIAErrorBoundary>
);

export default BoardingPassGenerator;

const styles = StyleSheet.create({
  container: { flex: 1 },
  body: { padding: 16 },
  scanBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  scanBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

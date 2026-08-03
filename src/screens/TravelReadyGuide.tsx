import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { HKIAErrorBoundary } from '../components/HKIAErrorBoundary';
import { MileageHeader } from '../components/MileageHeader';
import { useHKIATheme } from '../theme/HKIAThemeProvider';
import { HKIALanguage } from '../types/i18n';
import { BagDropSDKService } from '../native/BagDropSDKNative';

export interface TravelReadyGuideProps {
  language?: HKIALanguage;
  onProceedToBagDrop?: () => void;
}

const TravelReadyGuideContent: React.FC<TravelReadyGuideProps> = ({
  language,
  onProceedToBagDrop,
}) => {
  const { t } = useTranslation();
  const theme = useHKIATheme();

  const handleStartBagDrop = async () => {
    await BagDropSDKService.startBagDropFlow({}, language);
    if (onProceedToBagDrop) onProceedToBagDrop();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
      <MileageHeader title={t('title', 'HKIA Travel Ready Guide')} />
      <View style={styles.content}>
        <View style={[styles.card, { backgroundColor: theme.cardBackgroundColor, borderRadius: theme.borderRadius }]}>
          <Text style={[styles.cardTitle, { color: theme.textColor }]}>
            {t('readyToFly', 'Ready to Fly with Biometric Token')}
          </Text>
          <Text style={[styles.cardDesc, { color: theme.subtextColor }]}>
            {t('bagDropDesc', 'Proceed to automated HKIA bag drop kiosk once your BCBP token is enrolled.')}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: theme.primaryColor }]}
          onPress={handleStartBagDrop}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={t('bagDropTitle', 'Self BagDrop')}
        >
          <Text style={styles.btnText}>{t('bagDropTitle', 'Launch Self BagDrop')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export const TravelReadyGuide: React.FC<TravelReadyGuideProps> = (props) => (
  <HKIAErrorBoundary>
    <TravelReadyGuideContent {...props} />
  </HKIAErrorBoundary>
);

export default TravelReadyGuide;

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  card: {
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 14,
    lineHeight: 22,
  },
  btn: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

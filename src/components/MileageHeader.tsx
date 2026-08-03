import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface MileageHeaderProps {
  title?: string;
  subtitle?: string;
}

export const MileageHeader: React.FC<MileageHeaderProps> = ({
  title = 'HKIA Self Check-In & BagDrop',
  subtitle = 'Hong Kong International Airport Biometric Travel Token',
}) => {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#5C2D91',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 12,
    color: '#EAA123',
    marginTop: 4,
  },
});

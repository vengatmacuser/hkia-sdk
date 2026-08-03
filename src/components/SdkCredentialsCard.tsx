import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CryptoHelper } from '../utils/CryptoHelper';

export interface SdkCredentialsCardProps {
  appId?: string;
  apiKey?: string;
  isConfigured?: boolean;
}

export const SdkCredentialsCard: React.FC<SdkCredentialsCardProps> = ({
  appId,
  apiKey,
  isConfigured = false,
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>HKIA SDK Credentials Status</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Status:</Text>
        <Text style={[styles.badge, isConfigured ? styles.active : styles.inactive]}>
          {isConfigured ? 'Active & Configured' : 'Pending Initialization'}
        </Text>
      </View>
      {appId ? <Text style={styles.infoText}>App ID: {appId}</Text> : null}
      {apiKey ? <Text style={styles.infoText}>API Key: {CryptoHelper.maskToken(apiKey)}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginVertical: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: '#64748B',
    marginRight: 8,
  },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: 'hidden',
  },
  active: {
    backgroundColor: '#D1FAE5',
    color: '#065F46',
  },
  inactive: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  infoText: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
    fontFamily: 'Platform',
  },
});

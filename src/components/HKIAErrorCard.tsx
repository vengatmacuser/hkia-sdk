import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Clipboard,
} from 'react-native';
import { HKIAErrorReport } from '../types/error';
import { useHKIATheme } from '../theme/HKIAThemeProvider';

export interface HKIAErrorCardProps {
  errorReport: HKIAErrorReport;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export const HKIAErrorCard: React.FC<HKIAErrorCardProps> = ({
  errorReport,
  onRetry,
  onDismiss,
}) => {
  const theme = useHKIATheme();
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const reportText = JSON.stringify(errorReport, null, 2);
    Clipboard.setString(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.cardBackgroundColor, borderRadius: theme.borderRadius },
      ]}
      accessible={true}
      accessibilityRole="alert"
      accessibilityLabel={`Error: ${errorReport.errorMessage}`}
    >
      <View style={styles.headerRow}>
        <View style={styles.iconContainer}>
          <Text style={styles.warningIcon}>⚠️</Text>
        </View>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.title, { color: theme.textColor }]}>
            {errorReport.errorCode || 'HKIA SDK Diagnostic Report'}
          </Text>
          <Text style={[styles.sourceBadge, { color: theme.subtextColor }]}>
            Source: {errorReport.nativeSource} • {errorReport.timestamp.split('T')[1]?.slice(0, 8) || ''}
          </Text>
        </View>
      </View>

      <Text style={[styles.summaryText, { color: theme.textColor }]}>
        {errorReport.userFacingSummary || errorReport.errorMessage}
      </Text>

      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setShowTechnicalDetails(!showTechnicalDetails)}
        accessibilityRole="button"
        accessibilityLabel="Toggle Technical Diagnostic Details"
      >
        <Text style={[styles.toggleButtonText, { color: theme.primaryColor }]}>
          {showTechnicalDetails ? '▼ Hide Technical Details' : '▶ Show Technical Details'}
        </Text>
      </TouchableOpacity>

      {showTechnicalDetails && (
        <View style={styles.technicalBox}>
          <ScrollView nestedScrollEnabled style={styles.scrollBox}>
            <Text style={styles.codeText}>Code: {errorReport.errorCode}</Text>
            <Text style={styles.codeText}>Message: {errorReport.errorMessage}</Text>
            {errorReport.callStack && (
              <Text style={styles.stackText}>Stack: {errorReport.callStack}</Text>
            )}
          </ScrollView>
          <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
            <Text style={styles.copyButtonText}>{copied ? '✓ Copied to Clipboard' : '📋 Copy Report'}</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.buttonRow}>
        {onRetry && (
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryButton, { backgroundColor: theme.primaryColor }]}
            onPress={onRetry}
            accessibilityRole="button"
            accessibilityLabel="Retry Operation"
          >
            <Text style={styles.primaryButtonText}>Retry Step</Text>
          </TouchableOpacity>
        )}
        {onDismiss && (
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={onDismiss}
            accessibilityRole="button"
            accessibilityLabel="Dismiss Error"
          >
            <Text style={[styles.secondaryButtonText, { color: theme.textColor }]}>Dismiss</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 18,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FEF3C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  warningIcon: {
    fontSize: 20,
  },
  headerTextContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  sourceBadge: {
    fontSize: 12,
    marginTop: 2,
  },
  summaryText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  toggleButton: {
    paddingVertical: 6,
    marginBottom: 8,
  },
  toggleButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  technicalBox: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  scrollBox: {
    maxHeight: 120,
  },
  codeText: {
    color: '#38BDF8',
    fontFamily: 'Platform',
    fontSize: 12,
    marginBottom: 4,
  },
  stackText: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 4,
  },
  copyButton: {
    marginTop: 8,
    alignSelf: 'flex-end',
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  copyButtonText: {
    color: '#F8FAFC',
    fontSize: 12,
    fontWeight: '600',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
    gap: 10,
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  primaryButton: {},
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
  },
  secondaryButtonText: {
    fontWeight: '600',
    fontSize: 14,
  },
});

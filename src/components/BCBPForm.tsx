import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useHKIATheme } from '../theme/HKIAThemeProvider';
import { HKIALanguage } from '../types/i18n';

export interface RouteField {
  carrier: string;
  flightNum: string;
  journeyDate: string;
  class: string;
  from: string;
  to: string;
  seatNumber?: string;
}

export interface BCBPFormProps {
  surname: string;
  givenName: string;
  bookingRef: string;
  routes: RouteField[];
  numLegs: string;
  from: string;
  errors: Record<string, string>;
  onSurnameChange: (v: string) => void;
  onGivenNameChange: (v: string) => void;
  onBookingRefChange: (v: string) => void;
  onNumLegsChange: (v: string) => void;
  onRouteFieldChange: (index: number, field: keyof RouteField, value: string) => void;
  fromEditable?: boolean;
  language?: HKIALanguage;
}

export const EMPTY_ROUTE = (): RouteField => ({
  carrier: '',
  flightNum: '',
  journeyDate: '',
  class: '',
  from: '',
  to: '',
});

const InputField = ({ label, hint, error, containerStyle, prefix, ...props }: any) => {
  const theme = useHKIATheme();
  return (
    <View style={[styles.inputWrapper, containerStyle]}>
      <Text style={[styles.inputLabel, { color: theme.subtextColor }]}>{label}</Text>
      <View
        style={[
          styles.inputBox,
          error && styles.inputErrorBorder,
          props.editable === false && styles.inputDisabled,
        ]}
      >
        {prefix && <Text style={[styles.inputPrefix, { color: theme.primaryColor }]}>{prefix}</Text>}
        <TextInput
          style={[
            styles.input,
            { color: theme.textColor },
            props.editable === false && styles.inputTextDisabled,
            error && styles.inputTextError,
          ]}
          placeholderTextColor="#94A3B8"
          autoCapitalize="characters"
          editable={props.editable !== false}
          {...props}
        />
      </View>
      {hint && !error && <Text style={styles.hintText}>{hint}</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export const BCBPForm: React.FC<BCBPFormProps> = ({
  surname,
  givenName,
  bookingRef,
  routes,
  numLegs,
  from,
  errors,
  onSurnameChange,
  onGivenNameChange,
  onBookingRefChange,
  onNumLegsChange,
  onRouteFieldChange,
  fromEditable = false,
}) => {
  const theme = useHKIATheme();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const legCount = Math.min(Math.max(parseInt(numLegs, 10) || 1, 1), 6);
  const visibleRoutes = routes.slice(0, legCount);
  const showBadgeForRoute = legCount >= 3;

  const toggleSection = (key: string) => {
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const SectionHeader = ({ title, sectionKey }: { title: string; sectionKey: string }) => (
    <Pressable onPress={() => toggleSection(sectionKey)} style={styles.sectionHeader}>
      <Text style={[styles.sectionHeading, { color: theme.textColor }]}>{title}</Text>
      <Text style={styles.chevron}>{collapsed[sectionKey] ? '▶' : '▼'}</Text>
    </Pressable>
  );

  const renderRouteFields = (r: RouteField, idx: number) => {
    const err = (s: string) => errors[`r${idx}__${s}`];
    return (
      <View key={idx}>
        {showBadgeForRoute && (
          <Text style={[styles.routeBadge, { color: theme.primaryColor }]}>Route {idx + 1}</Text>
        )}
        <View style={styles.row}>
          <InputField
            label="Carrier"
            hint="Airline code (e.g. TG)"
            value={r.carrier}
            onChangeText={(v: string) => onRouteFieldChange(idx, 'carrier', v.toUpperCase().slice(0, 3))}
            error={err('carrier')}
            placeholder="TG"
            maxLength={3}
            containerStyle={{ flex: 1 }}
          />
          <InputField
            label="Flight"
            hint="3-4 digits (e.g. 603)"
            value={r.flightNum}
            onChangeText={(v: string) => onRouteFieldChange(idx, 'flightNum', v.replace(/\D/g, '').slice(0, 4))}
            error={err('flightNum')}
            placeholder="603"
            keyboardType="number-pad"
            containerStyle={{ flex: 1.2 }}
          />
          <InputField
            label="Julian Date"
            hint="Day 001-366 (e.g. 243)"
            value={r.journeyDate}
            onChangeText={(v: string) => onRouteFieldChange(idx, 'journeyDate', v.replace(/\D/g, '').slice(0, 3))}
            error={err('journeyDate')}
            placeholder="243"
            keyboardType="number-pad"
            containerStyle={{ flex: 1.1 }}
          />
        </View>
        <View style={[styles.row, { marginTop: 10 }]}>
          {idx === 0 ? (
            <>
              <InputField
                label="Booking Ref (PNR)"
                hint="6-char PNR"
                value={bookingRef}
                onChangeText={onBookingRefChange}
                placeholder="PNR"
                maxLength={6}
                prefix="E"
                containerStyle={{ flex: 1.6 }}
              />
              <InputField
                label="Cabin Class"
                hint="F / J / Y / W"
                value={r.class}
                onChangeText={(v: string) => onRouteFieldChange(idx, 'class', v.toUpperCase().slice(0, 1))}
                error={err('class')}
                placeholder="W"
                maxLength={1}
                containerStyle={{ flex: 0.9 }}
              />
              <InputField
                label="Legs"
                hint="1 to 6"
                value={numLegs}
                onChangeText={onNumLegsChange}
                keyboardType="number-pad"
                containerStyle={{ flex: 0.7 }}
              />
            </>
          ) : (
            <InputField
              label="Cabin Class"
              hint="F / J / Y / W"
              value={r.class}
              onChangeText={(v: string) => onRouteFieldChange(idx, 'class', v.toUpperCase().slice(0, 1))}
              error={err('class')}
              placeholder="W"
              maxLength={1}
              containerStyle={{ flex: 0.5 }}
            />
          )}
        </View>
        <View style={[styles.row, { marginTop: 10 }]}>
          <InputField
            label="From Airport"
            hint="3-letter IATA (e.g. HKG)"
            value={idx === 0 ? (fromEditable ? r.from : from) : r.from}
            editable={idx !== 0 || fromEditable}
            onChangeText={(v: string) => onRouteFieldChange(idx, 'from', v.toUpperCase().slice(0, 3))}
            error={err('from')}
            placeholder="HKG"
            maxLength={3}
            containerStyle={{ flex: 1 }}
          />
          <InputField
            label="To Airport"
            hint="3-letter IATA (e.g. BKK)"
            value={r.to}
            onChangeText={(v: string) => onRouteFieldChange(idx, 'to', v.toUpperCase().slice(0, 3))}
            error={err('to')}
            placeholder="BKK"
            maxLength={3}
            containerStyle={{ flex: 1 }}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={{ marginBottom: 12 }}>
      <SectionHeader title="1 - Passenger Information" sectionKey="pax" />
      {!collapsed.pax && (
        <View style={[styles.sectionCard, { backgroundColor: theme.cardBackgroundColor, borderRadius: theme.borderRadius }]}>
          <View style={styles.row}>
            <InputField
              label="Surname"
              hint="Matches passport surname"
              value={surname}
              onChangeText={onSurnameChange}
              error={errors.surname}
              placeholder="SURNAME"
              containerStyle={{ flex: 1 }}
            />
            <InputField
              label="Given Name"
              hint="Matches passport given name"
              value={givenName}
              onChangeText={onGivenNameChange}
              error={errors.givenName}
              placeholder="GIVENNAME"
              containerStyle={{ flex: 1 }}
            />
          </View>
        </View>
      )}

      <SectionHeader title="2 - Flight & Route" sectionKey="route" />
      {!collapsed.route && (
        <View style={[styles.sectionCard, { backgroundColor: theme.cardBackgroundColor, borderRadius: theme.borderRadius }]}>
          {visibleRoutes.map((r, i) => (
            <View key={i}>
              {i > 0 && <View style={styles.routeDivider} />}
              {renderRouteFields(r, i)}
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default BCBPForm;

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 6,
    marginTop: 4,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  chevron: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '700',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionCard: {
    padding: 16,
    marginBottom: 12,
    shadowColor: '#3C096C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1.5,
    borderColor: '#EEF2F6',
  },
  row: { flexDirection: 'row', gap: 10 },
  routeDivider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 14 },
  routeBadge: {
    fontSize: 11,
    fontWeight: '700',
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
    overflow: 'hidden',
    marginBottom: 10,
  },
  inputWrapper: { gap: 6 },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
  },
  inputDisabled: { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1' },
  inputErrorBorder: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  inputPrefix: {
    fontSize: 13,
    backgroundColor: '#F3E8FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginRight: 6,
    fontWeight: '700',
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    height: '100%',
  },
  inputTextDisabled: { opacity: 0.9 },
  inputTextError: { color: '#EF4444' },
  hintText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  errorText: {
    fontSize: 11,
    color: '#EF4444',
    fontWeight: '500',
    marginTop: 2,
    letterSpacing: 0.2,
  },
});

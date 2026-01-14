import React, { useEffect, useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTrip } from '../lib/trip';
import {
  diffDays,
  formatRange,
  getFridayOfWeek,
  getMondayOfWeek,
  startOfDay,
} from '../lib/date';

export default function SettingsScreen() {
  const { startDate, endDate, setTrip, clearTrip, isLoaded } = useTrip();
  const [localStart, setLocalStart] = useState<Date>(startDate ?? new Date());
  const [localEnd, setLocalEnd] = useState<Date>(endDate ?? new Date());
  const [error, setError] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useEffect(() => {
    if (startDate) {
      setLocalStart(startDate);
    }
    if (endDate) {
      setLocalEnd(endDate);
    }
  }, [startDate, endDate]);

  const applyIfValid = async (start: Date, end: Date) => {
    if (diffDays(end, start) < 0) {
      setError('End date must be on or after the start date.');
      return;
    }
    setError('');
    await setTrip(startOfDay(start), startOfDay(end));
  };

  const onChangeStart = async (date: Date | undefined) => {
    if (!date) {
      return;
    }
    setLocalStart(date);
    await applyIfValid(date, localEnd);
  };

  const onChangeEnd = async (date: Date | undefined) => {
    if (!date) {
      return;
    }
    setLocalEnd(date);
    await applyIfValid(localStart, date);
  };

  const setThisWeek = async () => {
    const today = new Date();
    const start = getMondayOfWeek(today);
    const end = getFridayOfWeek(today);
    setLocalStart(start);
    setLocalEnd(end);
    await applyIfValid(start, end);
  };

  const setNextWeek = async () => {
    const nextMonday = getMondayOfWeek(new Date());
    nextMonday.setDate(nextMonday.getDate() + 7);
    const nextFriday = getFridayOfWeek(nextMonday);
    setLocalStart(nextMonday);
    setLocalEnd(nextFriday);
    await applyIfValid(nextMonday, nextFriday);
  };

  const clearTripDates = async () => {
    setError('');
    setLocalStart(new Date());
    setLocalEnd(new Date());
    await clearTrip();
  };

  const rangeText = useMemo(() => {
    if (!startDate || !endDate) {
      return 'No dates saved yet';
    }
    return formatRange(startDate, endDate);
  }, [startDate, endDate]);

  if (!isLoaded) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loading}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Selected trip range</Text>
      <Text style={styles.range}>{rangeText}</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Start Date</Text>
        <Pressable
          onPress={() => setShowStartPicker(true)}
          style={styles.dateButton}
        >
          <Text style={styles.dateText}>
            {startOfDay(localStart).toLocaleDateString()}
          </Text>
        </Pressable>
        {showStartPicker ? (
          <DateTimePicker
            value={localStart}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, date) => {
              setShowStartPicker(Platform.OS === 'ios');
              onChangeStart(date);
            }}
          />
        ) : null}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>End Date</Text>
        <Pressable
          onPress={() => setShowEndPicker(true)}
          style={styles.dateButton}
        >
          <Text style={styles.dateText}>
            {startOfDay(localEnd).toLocaleDateString()}
          </Text>
        </Pressable>
        {showEndPicker ? (
          <DateTimePicker
            value={localEnd}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, date) => {
              setShowEndPicker(Platform.OS === 'ios');
              onChangeEnd(date);
            }}
          />
        ) : null}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.buttons}>
        <Pressable onPress={setThisWeek} style={styles.quickButton}>
          <Text style={styles.quickText}>This week (Mon-Fri)</Text>
        </Pressable>
        <Pressable onPress={setNextWeek} style={styles.quickButton}>
          <Text style={styles.quickText}>Next week (Mon-Fri)</Text>
        </Pressable>
        <Pressable onPress={clearTripDates} style={styles.clearButton}>
          <Text style={styles.clearText}>Clear trip</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f3ee',
    padding: 20,
  },
  label: {
    fontSize: 14,
    color: '#4b4b4b',
    marginBottom: 6,
  },
  range: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
  },
  section: {
    marginBottom: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#d0c7bd',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#fffdf9',
  },
  dateText: {
    fontSize: 16,
    color: '#1f1f1f',
  },
  error: {
    color: '#b42318',
    marginTop: 4,
    marginBottom: 12,
  },
  buttons: {
    gap: 12,
    marginTop: 12,
  },
  quickButton: {
    backgroundColor: '#1f1f1f',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  quickText: {
    color: '#f6f3ee',
    fontSize: 15,
    textAlign: 'center',
  },
  clearButton: {
    borderWidth: 1,
    borderColor: '#b42318',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  clearText: {
    color: '#b42318',
    fontSize: 15,
    textAlign: 'center',
  },
  loading: {
    fontSize: 16,
    color: '#4b4b4b',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f6f3ee',
  },
});
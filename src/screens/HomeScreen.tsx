import React, { useMemo } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTrip } from '../lib/trip';
import { diffDays, formatRange, isFriday, isMonday, startOfDay } from '../lib/date';

const images = {
  pretrip: require('../../assets/pretrip.png'),
  tired: require('../../assets/tired.png'),
  cope: require('../../assets/cope.png'),
  almost: require('../../assets/almost.png'),
  celebration: require('../../assets/celebration.png'),
};

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { startDate, endDate, isLoaded } = useTrip();

  const { headline, subline, extraLine, imageSource } = useMemo(() => {
    if (!startDate || !endDate) {
      return {
        headline: 'No trip set',
        subline: 'Tap Settings to choose dates',
        extraLine: null as string | null,
        imageSource: images.pretrip,
      };
    }

    const today = startOfDay(new Date());
    const start = startOfDay(startDate);
    const end = startOfDay(endDate);

    const daysUntilStart = diffDays(start, today);
    const daysLeft = diffDays(end, today);

    const isDefaultWeek =
      isMonday(start) && isFriday(end) && diffDays(end, start) === 4;

    if (daysUntilStart > 0) {
      return {
        headline: `Trip starts in ${daysUntilStart} day${
          daysUntilStart === 1 ? '' : 's'
        }`,
        subline: formatRange(start, end),
        extraLine: null,
        imageSource: images.pretrip,
      };
    }

    if (daysLeft >= 0) {
      let statusImage = images.almost;
      if (daysLeft >= 4) {
        statusImage = images.tired;
      } else if (daysLeft >= 2) {
        statusImage = images.cope;
      }
      return {
        headline: `${daysLeft} day${daysLeft === 1 ? '' : 's'} left until ${
          isDefaultWeek ? 'Friday' : 'trip ends'
        }`,
        subline: formatRange(start, end),
        extraLine: null,
        imageSource: statusImage,
      };
    }

    const daysSince = Math.abs(daysLeft);
    return {
      headline: 'Trip finished \ud83c\udf89',
      subline: formatRange(start, end),
      extraLine: `Days since trip ended: ${daysSince}`,
      imageSource: images.celebration,
    };
  }, [startDate, endDate]);

  if (!isLoaded) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loading}>Loading trip...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.heroBlock}>
        <Text style={styles.headline}>{headline}</Text>
        <Text style={styles.subline}>{subline}</Text>
        {extraLine ? <Text style={styles.extra}>{extraLine}</Text> : null}
      </View>
      <Image source={imageSource} style={styles.image} resizeMode="contain" />
      <Pressable
        onPress={() => navigation.navigate('Settings')}
        style={styles.settingsButton}
      >
        <Text style={styles.settingsText}>Settings</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f3ee',
    paddingHorizontal: 20,
    paddingTop: 32,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroBlock: {
    alignItems: 'center',
    gap: 12,
  },
  headline: {
    fontSize: 36,
    fontWeight: '700',
    textAlign: 'center',
    color: '#1f1f1f',
  },
  subline: {
    fontSize: 16,
    color: '#4b4b4b',
  },
  extra: {
    fontSize: 14,
    color: '#6b6b6b',
  },
  image: {
    width: '90%',
    height: 240,
  },
  settingsButton: {
    backgroundColor: '#1f1f1f',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 28,
    marginBottom: 36,
  },
  settingsText: {
    color: '#f6f3ee',
    fontSize: 16,
    fontWeight: '600',
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
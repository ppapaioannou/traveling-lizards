import React, { useEffect, useMemo, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import storage from './src/lib/storage';
import { TripContext, TripContextValue } from './src/lib/trip';

type StoredTrip = { start: string; end: string };

const Stack = createNativeStackNavigator();

export default function App() {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const stored = await storage.get<StoredTrip>('tripDates');
      if (stored?.start && stored?.end) {
        const start = new Date(stored.start);
        const end = new Date(stored.end);
        if (isMounted) {
          setStartDate(start);
          setEndDate(end);
        }
      }
      if (isMounted) {
        setIsLoaded(true);
      }
    };
    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const setTrip = async (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
    await storage.set('tripDates', {
      start: start.toISOString(),
      end: end.toISOString(),
    });
  };

  const clearTrip = async () => {
    setStartDate(null);
    setEndDate(null);
    await storage.remove('tripDates');
  };

  const ctxValue: TripContextValue = useMemo(
    () => ({ startDate, endDate, isLoaded, setTrip, clearTrip }),
    [startDate, endDate, isLoaded]
  );

  return (
    <TripContext.Provider value={ctxValue}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShadowVisible: false }}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Trip Countdown' }}
          />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </TripContext.Provider>
  );
}
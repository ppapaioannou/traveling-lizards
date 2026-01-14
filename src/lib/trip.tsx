import React from 'react';

export type TripContextValue = {
  startDate: Date | null;
  endDate: Date | null;
  isLoaded: boolean;
  setTrip: (start: Date, end: Date) => Promise<void>;
  clearTrip: () => Promise<void>;
};

export const TripContext = React.createContext<TripContextValue | null>(null);

export const useTrip = () => {
  const ctx = React.useContext(TripContext);
  if (!ctx) {
    throw new Error('TripContext is missing');
  }
  return ctx;
};
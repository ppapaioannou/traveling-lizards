import AsyncStorage from '@react-native-async-storage/async-storage';

type StoredValue = string | number | boolean | object | null;

const storage = {
  async get<T extends StoredValue>(key: string): Promise<T | null> {
    const value = await AsyncStorage.getItem(key);
    if (!value) {
      return null;
    }
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      return null;
    }
  },
  async set<T extends StoredValue>(key: string, value: T): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  },
  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  },
};

export default storage;
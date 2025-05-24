import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@favorites_list';

export const getFavorites = async () => {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (err) {
    console.error('Error fetching favorites:', err);
    return [];
  }
};

export const addFavorite = async (item) => {
  try {
    const current = await getFavorites();
    const updated = [...current, item];
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error adding favorite:', err);
  }
};

export const removeFavorite = async (itemId) => {
  try {
    const current = await getFavorites();
    const updated = current.filter((i) => i.id !== itemId);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Error removing favorite:', err);
  }
};

export const isFavorited = async (itemId) => {
  const current = await getFavorites();
  return current.some((i) => i.id === itemId);
};

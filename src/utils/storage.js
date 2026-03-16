import AsyncStorage from '@react-native-async-storage/async-storage';

export const KEYS = {
    THEME_PREF: 'theme_pref',
    PURITY_PREF: 'purity_pref',
    FAVORITES: 'favorites_list',
};

export const saveItem = async (key, value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        console.error('Error saving item', e);
    }
};

export const getItem = async (key, defaultValue = null) => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : defaultValue;
    } catch (e) {
        console.error('Error reading item', e);
        return defaultValue;
    }
};

export const getFavorites = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(KEYS.FAVORITES);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error('Error getting favorites:', e);
        return [];
    }
};

export const saveFavorites = async (favoritesArray) => {
    try {
        await AsyncStorage.setItem(KEYS.FAVORITES, JSON.stringify(favoritesArray));
    } catch (e) {
        console.error('Error saving favorites:', e);
    }
};

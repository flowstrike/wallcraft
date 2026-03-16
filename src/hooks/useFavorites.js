import { useState, useEffect, useCallback } from 'react';
import { getFavorites, saveFavorites } from '../utils/storage';

export const useFavorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadFavorites = useCallback(async () => {
        setLoading(true);
        const savedFavorites = await getFavorites();
        setFavorites(savedFavorites);
        setLoading(false);
    }, []);

    useEffect(() => {
        loadFavorites();
    }, [loadFavorites]);

    const addFavorite = async (wallpaper) => {
        const newFavorites = [wallpaper, ...favorites];
        setFavorites(newFavorites);
        await saveFavorites(newFavorites);
    };

    const removeFavorite = async (id) => {
        const newFavorites = favorites.filter((item) => item.id !== id);
        setFavorites(newFavorites);
        await saveFavorites(newFavorites);
    };

    const isFavorite = useCallback(
        (id) => {
            return favorites.some((item) => item.id === id);
        },
        [favorites]
    );

    const toggleFavorite = async (wallpaper) => {
        if (!wallpaper) return;
        if (isFavorite(wallpaper.id)) {
            await removeFavorite(wallpaper.id);
        } else {
            await addFavorite(wallpaper);
        }
    };

    return {
        favorites,
        loading,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
        refreshFavorites: loadFavorites,
    };
};

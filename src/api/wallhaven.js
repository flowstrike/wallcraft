import { WALLHAVEN_API_KEY } from '@env';

const BASE_URL = 'https://wallhaven.cc/api/v1';
const API_KEY = WALLHAVEN_API_KEY;

export const searchWallpapers = async ({
    q = '',
    page = 1,
    purity = '100',
    categories = '111',
    sorting = 'random',
    seed = '',
    ratios = 'portrait',
} = {}) => {
    try {
        const queryParts = [`apikey=${API_KEY}`];
        if (q) queryParts.push(`q=${encodeURIComponent(q)}`);
        if (page) queryParts.push(`page=${page}`);
        if (purity) queryParts.push(`purity=${purity}`);
        if (categories) queryParts.push(`categories=${categories}`);
        if (sorting) queryParts.push(`sorting=${sorting}`);
        if (seed && sorting === 'random') queryParts.push(`seed=${seed}`);
        if (ratios) queryParts.push(`ratios=${ratios}`);

        const qs = `?${queryParts.join('&')}`;
        const response = await fetch(`${BASE_URL}/search${qs}`);

        if (response.status === 429) {
            throw new Error('Rate limit exceeded. Please try again later.');
        }
        if (response.status === 401) {
            throw new Error('Unauthorized. Invalid API key.');
        }

        const json = await response.json();
        return json;
    } catch (error) {
        console.error('Error fetching wallpapers API:', error);
        throw error;
    }
};

export const getWallpaperDetails = async (id) => {
    try {
        const qs = `?apikey=${API_KEY}`;
        const response = await fetch(`${BASE_URL}/w/${id}${qs}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch wallpaper details: ${response.status}`);
        }

        const json = await response.json();
        return json;
    } catch (error) {
        console.error('Error fetching wallpaper info:', error);
        throw error;
    }
};

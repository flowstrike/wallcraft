import { useState, useEffect, useCallback, useContext } from 'react';
import { searchWallpapers } from '../api/wallhaven';
import { useTheme } from '../context/ThemeContext';

export const useWallpapers = (initialQuery = '') => {
    const [wallpapers, setWallpapers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [query, setQuery] = useState(initialQuery);
    const [page, setPage] = useState(1);
    const [categories, setCategories] = useState('111');
    const [sorting, setSorting] = useState('hot');
    const [seed, setSeed] = useState('');
    const [hasMore, setHasMore] = useState(true);

    const { isIncognito } = useTheme();

    // Compute purity based on Incognito setting
    // Normal Mode: 100 (SFW)
    // Incognito Mode: 011 (Sketchy + NSFW) -> completely isolated feed
    const getPurity = () => {
        return isIncognito ? '011' : '100';
    };

    const fetchWallpapers = useCallback(async (isLoadMore = false) => {
        if (loading || (!hasMore && isLoadMore)) return;

        try {
            setLoading(true);
            setError(null);

            const currentPage = isLoadMore ? page : 1;
            const purity = getPurity();

            const data = await searchWallpapers({
                q: query,
                page: currentPage,
                purity,
                categories,
                sorting,
                seed,
                ratios: 'portrait',
            });

            if (data.meta) {
                setHasMore(data.meta.current_page < data.meta.last_page);
                if (data.meta.seed && !seed) {
                    setSeed(data.meta.seed);
                }
            }

            const results = data.data || [];
            if (isLoadMore) {
                setWallpapers(prev => [...prev, ...results]);
            } else {
                setWallpapers(results);
            }

        } catch (err) {
            setError(err.message || 'Error loading wallpapers');
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, page, query, categories, sorting, seed, isIncognito]);

    useEffect(() => {
        fetchWallpapers(false);
    }, [query, categories, sorting, isIncognito]);

    const loadMore = () => {
        if (!loading && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    useEffect(() => {
        if (page > 1) {
            fetchWallpapers(true);
        }
    }, [page]);

    const updateFilters = (newParams) => {
        if (newParams.q !== undefined) setQuery(newParams.q);
        // If a query is provided via topic pill, we often want to reset categories to default (search everything)
        if (newParams.categories !== undefined) setCategories(newParams.categories);
        else if (newParams.q !== undefined && newParams.q !== query) setCategories('111');

        if (newParams.sorting !== undefined) {
            setSorting(newParams.sorting);
            setSeed('');
        }
        setPage(1);
        setWallpapers([]);
    };

    return {
        wallpapers,
        loading,
        error,
        hasMore,
        filters: { query, categories, sorting },
        updateFilters,
        loadMore,
        refresh: () => {
            setPage(1);
            setSeed('');
            fetchWallpapers(false);
        }
    };
};

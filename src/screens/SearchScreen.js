import React, { useState } from 'react';
import { View, FlatList, StyleSheet, Text, TextInput, RefreshControl, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';
import { useWallpapers } from '../hooks/useWallpapers';
import WallpaperCard from '../components/WallpaperCard';
import CategoryChip from '../components/CategoryChip';
import LoadingSpinner from '../components/LoadingSpinner';

const SORT_OPTIONS = [
    { id: 'relevance', label: 'Relevant' },
    { id: 'hot', label: 'Hot' },
    { id: 'toplist', label: 'Top' },
    { id: 'random', label: 'Random' },
];

const SearchScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const [searchText, setSearchText] = useState('');

    const {
        wallpapers,
        loading,
        error,
        hasMore,
        filters,
        updateFilters,
        loadMore,
        refresh,
    } = useWallpapers('');

    const handleSearch = () => {
        if (searchText.trim()) {
            updateFilters({ q: searchText.trim(), sorting: 'relevance' });
        }
    };

    const handleClear = () => {
        setSearchText('');
        updateFilters({ q: '', sorting: 'hot' });
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            {/* Search Input */}
            <View style={[styles.searchBar, { backgroundColor: colors.surfaceElevated }]}>
                <Icon name="search" size={22} color={colors.textSecondary} />
                <TextInput
                    style={[styles.searchInput, { color: colors.text }]}
                    placeholder="Search wallpapers, tags, colors..."
                    placeholderTextColor={colors.textSecondary}
                    value={searchText}
                    onChangeText={setSearchText}
                    onSubmitEditing={handleSearch}
                    returnKeyType="search"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                {searchText.length > 0 && (
                    <TouchableOpacity onPress={handleClear}>
                        <Icon name="close" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                )}
            </View>

            {/* Sort chips */}
            {filters.query ? (
                <View style={styles.chipRow}>
                    {SORT_OPTIONS.map((opt) => (
                        <CategoryChip
                            key={opt.id}
                            label={opt.label}
                            isSelected={filters.sorting === opt.id}
                            onPress={() => updateFilters({ sorting: opt.id })}
                        />
                    ))}
                </View>
            ) : (
                <View style={styles.emptySearchHint}>
                    <Icon name="wallpaper" size={48} color={colors.textSecondary} style={{ opacity: 0.4 }} />
                    <Text style={[styles.hintText, { color: colors.textSecondary }]}>
                        Search for wallpapers by keyword, tag, or color
                    </Text>
                </View>
            )}
        </View>
    );

    const renderFooter = () => {
        if (loading && wallpapers.length > 0) return <LoadingSpinner />;
        if (!hasMore && wallpapers.length > 0) {
            return <Text style={[styles.endText, { color: colors.textSecondary }]}>End of results</Text>;
        }
        return null;
    };

    const renderEmpty = () => {
        if (loading) return <LoadingSpinner fullScreen />;
        if (error) return <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>;
        if (filters.query) return <Text style={[styles.endText, { color: colors.textSecondary }]}>No results found for "{filters.query}"</Text>;
        return null;
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
            <Text style={[styles.title, { color: colors.text }]}>Search</Text>
            <FlatList
                data={filters.query ? wallpapers : []}
                keyExtractor={(item, index) => item.id + index.toString()}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                renderItem={({ item }) => (
                    <WallpaperCard
                        item={item}
                        onPress={(wp) => navigation.navigate('WallpaperDetail', { wallpaperId: wp.id })}
                    />
                )}
                ListHeaderComponent={renderHeader()}
                ListFooterComponent={renderFooter()}
                ListEmptyComponent={renderEmpty()}
                onEndReached={loadMore}
                onEndReachedThreshold={0.5}
                refreshControl={
                    <RefreshControl
                        refreshing={loading && wallpapers.length === 0 && !!filters.query}
                        onRefresh={refresh}
                        tintColor={colors.primary}
                    />
                }
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 4,
        letterSpacing: -0.5,
    },
    headerContainer: {
        paddingBottom: 8,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        marginHorizontal: 16,
        marginVertical: 12,
        paddingHorizontal: 14,
        height: 52,
        gap: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        height: '100%',
    },
    chipRow: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingBottom: 10,
        flexWrap: 'wrap',
    },
    emptySearchHint: {
        alignItems: 'center',
        paddingVertical: 48,
        paddingHorizontal: 32,
    },
    hintText: {
        fontSize: 14,
        textAlign: 'center',
        marginTop: 12,
        lineHeight: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 12,
    },
    endText: {
        textAlign: 'center',
        padding: 20,
        fontSize: 14,
    },
    errorText: {
        textAlign: 'center',
        padding: 20,
        fontSize: 14,
        fontWeight: '600',
    },
});

export default SearchScreen;

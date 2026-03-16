import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, RefreshControl, TouchableOpacity, Dimensions, ScrollView, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';
import { useWallpapers } from '../hooks/useWallpapers';
import WallpaperCard from '../components/WallpaperCard';
import CategoryChip from '../components/CategoryChip';
import LoadingSpinner from '../components/LoadingSpinner';

const { width } = Dimensions.get('window');

const TOPICS = [
    { id: '100', label: 'All', icon: 'apps', isCategory: true },
    { id: 'nature', label: 'Nature', icon: 'landscape' },
    { id: 'cyberpunk', label: 'Cyberpunk', icon: 'memory' },
    { id: 'amoled', label: 'AMOLED', icon: 'dark-mode' },
    { id: 'space', label: 'Space', icon: 'rocket' },
    { id: 'cars', label: 'Cars', icon: 'directions-car' },
    { id: 'gaming', label: 'Gaming', icon: 'sports-esports' },
    { id: 'anime', label: 'Anime', icon: 'palette' },
];

const SORT_OPTIONS = [
    { id: 'hot', label: '🔥 Hot' },
    { id: 'toplist', label: '⭐ Top' },
    { id: 'random', label: '🎲 Random' },
    { id: 'date_added', label: '🕐 Latest' },
];

const HomeScreen = ({ navigation }) => {
    const { colors, isDark, isIncognito, toggleIncognito } = useTheme();
    const insets = useSafeAreaInsets();

    const {
        wallpapers,
        loading,
        error,
        hasMore,
        filters,
        updateFilters,
        loadMore,
        refresh,
    } = useWallpapers();

    const handleTopicSelect = (topic) => {
        if (topic.isCategory && topic.id === '100') {
            // General category - reset search
            updateFilters({ q: '', categories: '111', sorting: 'hot' });
        } else {
            // Search by topic tag
            updateFilters({ q: topic.id, sorting: 'relevance' });
        }
    };

    const handleToggleIncognito = () => {
        if (!isIncognito) {
            Alert.alert(
                "Enter Incognito Mode?",
                "This will switch your feed to only show adult/sketchy content. This session is private and will be cleared when you restart the app.",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Enter", style: "destructive", onPress: toggleIncognito }
                ]
            );
        } else {
            toggleIncognito();
        }
    };

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            {/* Top Bar */}
            <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
                <View>
                    <Text style={[styles.title, { color: isIncognito ? colors.danger : colors.text }]}>
                        {isIncognito ? 'Incognito' : 'WallCraft'}
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
                        {isIncognito ? 'Private session active' : 'Find your perfect wallpaper'}
                    </Text>
                </View>
                <View style={styles.topActions}>
                    <TouchableOpacity
                        onPress={handleToggleIncognito}
                        style={[styles.iconBtn, { backgroundColor: isIncognito ? colors.primaryGlow : colors.surfaceElevated }]}
                    >
                        <Icon
                            name={isIncognito ? 'policy' : 'lock'}
                            size={20}
                            color={isIncognito ? colors.primary : colors.textSecondary}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Topics */}
            <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Discover Topics</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollRow}>
                {TOPICS.map((topic) => {
                    // Logic to highlight selected topic
                    const isSelected = topic.isCategory ?
                        (!filters.query && filters.categories === '111') :
                        (filters.query === topic.id);

                    return (
                        <CategoryChip
                            key={topic.id}
                            label={topic.label}
                            icon={topic.icon}
                            isSelected={isSelected}
                            onPress={() => handleTopicSelect(topic)}
                        />
                    );
                })}
            </ScrollView>

            {/* Sort */}
            <View style={[styles.sectionHeader, { marginTop: 4 }]}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Trending Now</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollRow}>
                {SORT_OPTIONS.map((opt) => (
                    <CategoryChip
                        key={opt.id}
                        label={opt.label}
                        isSelected={filters.sorting === opt.id}
                        onPress={() => updateFilters({ sorting: opt.id })}
                        isSortChip={true}
                    />
                ))}
            </ScrollView>
        </View>
    );

    const renderFooter = () => {
        if (loading && wallpapers.length > 0) return <LoadingSpinner />;
        if (!hasMore && wallpapers.length > 0) {
            return <Text style={[styles.endText, { color: colors.textSecondary }]}>You've seen it all! 🎉</Text>;
        }
        return null;
    };

    const renderEmpty = () => {
        if (loading) return <LoadingSpinner fullScreen />;
        if (error) return <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>;
        return <Text style={[styles.endText, { color: colors.textSecondary }]}>No wallpapers found.</Text>;
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <FlatList
                data={wallpapers}
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
                        refreshing={loading && wallpapers.length === 0}
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
    headerContainer: {
        paddingBottom: 8,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 16,
        paddingBottom: 12,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 14,
        marginTop: 2,
    },
    topActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 8,
    },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionHeader: {
        paddingHorizontal: 16,
        paddingTop: 8,
        paddingBottom: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: -0.2,
    },
    scrollRow: {
        paddingHorizontal: 16,
        paddingBottom: 12,
        gap: 10,
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

export default HomeScreen;

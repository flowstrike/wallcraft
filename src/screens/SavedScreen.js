import React, { useCallback } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../hooks/useFavorites';
import WallpaperCard from '../components/WallpaperCard';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

const SavedScreen = ({ navigation }) => {
    const { colors, isIncognito } = useTheme();
    const insets = useSafeAreaInsets();

    const { favorites, loading, refreshFavorites } = useFavorites();

    // Refresh favorites when bringing screen into focus
    useFocusEffect(
        useCallback(() => {
            refreshFavorites();
        }, [refreshFavorites])
    );

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
                <View>
                    <Text style={[styles.title, { color: isIncognito ? colors.danger : colors.text }]}>Saved</Text>
                    <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Your favorite wallpapers</Text>
                </View>
                <View style={styles.topActions}>
                    <View style={[styles.iconBtn, { backgroundColor: colors.surfaceElevated }]}>
                        <Icon name="favorite" size={20} color={colors.primary} />
                    </View>
                </View>
            </View>
        </View>
    );

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: colors.surfaceElevated }]}>
                <Icon name="favorite-border" size={40} color={colors.textSecondary} />
            </View>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No favorites yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Wallpapers you save will appear here. Find some amazing art and tap the heart!
            </Text>
            <TouchableOpacity
                style={[styles.browseBtn, { backgroundColor: colors.primary }]}
                onPress={() => navigation.navigate('HomeTab')}
            >
                <Text style={styles.browseBtnText}>Browse Wallpapers</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {renderHeader()}

            <FlatList
                data={favorites}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.columnWrapper}
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={!loading ? renderEmpty : null}
                renderItem={({ item, index }) => (
                    <WallpaperCard
                        item={item}
                        index={index}
                        onPress={() => navigation.navigate('WallpaperDetail', { wallpaper: item })}
                        width={COLUMN_WIDTH}
                    />
                )}
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
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: '800',
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: 14,
        marginTop: 4,
    },
    topActions: {
        flexDirection: 'row',
        gap: 12,
    },
    iconBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContainer: {
        paddingTop: 16,
        paddingBottom: 100, // Space for bottom tab bar
    },
    columnWrapper: {
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 80,
        paddingHorizontal: 32,
    },
    emptyIconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 15,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    browseBtn: {
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 24,
    },
    browseBtnText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default SavedScreen;

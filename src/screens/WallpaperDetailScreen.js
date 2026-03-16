import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView,
    TouchableOpacity, ActivityIndicator, Alert,
    Linking, Dimensions, StatusBar, Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RNFS from 'react-native-fs';
import ManageWallpaper, { TYPE } from 'react-native-manage-wallpaper';
import { useTheme } from '../context/ThemeContext';
import { useFavorites } from '../hooks/useFavorites';
import { getWallpaperDetails } from '../api/wallhaven';
import { useDownload } from '../hooks/useDownload';
import ApplyWallpaperSheet from '../components/ApplyWallpaperSheet';

const { width, height } = Dimensions.get('window');

const formatBytes = (bytes, decimals = 1) => {
    if (!+bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
};

const WallpaperDetailScreen = ({ route, navigation }) => {
    const { wallpaperId } = route.params;
    const { colors, isIncognito } = useTheme();
    const insets = useSafeAreaInsets();
    const { download, isDownloading, progress } = useDownload();
    const { isFavorite, toggleFavorite } = useFavorites();

    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applySheetVisible, setApplySheetVisible] = useState(false);
    const [applying, setApplying] = useState(false);

    useEffect(() => { loadDetails(); }, [wallpaperId]);

    const loadDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getWallpaperDetails(wallpaperId);
            setDetails(res.data);
        } catch (err) {
            setError(err.message || 'Failed to load details');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        if (!details) return;
        const ext = details.file_type === 'image/png' ? 'png' : 'jpg';
        download(details.path, details.id, ext);
    };

    // ── REAL in-app wallpaper setter ──
    const handleApply = async (target) => {
        setApplySheetVisible(false);
        if (!details) return;

        try {
            setApplying(true);
            Alert.alert('Applying…', 'Downloading wallpaper, please wait.');

            const ext = details.file_type === 'image/png' ? 'png' : 'jpg';
            const tmpPath = `${RNFS.CachesDirectoryPath}/wallcraft_apply_${details.id}.${ext}`;

            // Download to temp cache
            const downloadResult = await RNFS.downloadFile({
                fromUrl: details.path,
                toFile: tmpPath,
            }).promise;

            if (downloadResult.statusCode !== 200) {
                throw new Error(`Download failed: ${downloadResult.statusCode}`);
            }

            // Map our target IDs to ManageWallpaper TYPE
            const wallpaperType =
                target === 'home' ? TYPE.HOME :
                    target === 'lock' ? TYPE.LOCK :
                        TYPE.BOTH;

            // Set wallpaper using native module
            ManageWallpaper.setWallpaper(
                { uri: `file://${tmpPath}` },
                (res) => {
                    setApplying(false);
                    if (res.status === 'success') {
                        Alert.alert('✅ Done!', 'Wallpaper applied successfully!');
                    } else {
                        Alert.alert('Error', res.msg || 'Could not set wallpaper');
                    }
                },
                wallpaperType,
            );
        } catch (err) {
            setApplying(false);
            console.error('Apply error:', err);
            Alert.alert('Apply Failed', err.message || 'Something went wrong.');
        }
    };

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    if (error || !details) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <Icon name="error-outline" size={48} color={colors.danger} style={{ marginBottom: 16 }} />
                <Text style={{ color: colors.danger, marginBottom: 20, textAlign: 'center' }}>
                    {error || 'Wallpaper not found'}
                </Text>
                <TouchableOpacity onPress={loadDetails} style={[styles.retryBtn, { backgroundColor: colors.primary }]}>
                    <Text style={{ color: '#fff', fontWeight: '600' }}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const favored = isFavorite(details.id);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

            {/* ── Scrollable Body ── */}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
            >
                {/* ── Hero Image ── */}
                <View style={styles.imageWrapper}>
                    <FastImage
                        style={styles.heroImage}
                        source={{ uri: details.path }}
                        resizeMode={FastImage.resizeMode.cover}
                    />
                    {/* Dark scrim at bottom of image */}
                    <View style={styles.imageScrim} />

                    {/* Resolution + Views pills over image */}
                    <View style={styles.imagePills}>
                        <View style={styles.pill}>
                            <Icon name="aspect-ratio" size={12} color="#fff" style={{ marginRight: 4 }} />
                            <Text style={styles.pillText}>{details.resolution}</Text>
                        </View>
                        <View style={styles.pill}>
                            <Icon name="visibility" size={12} color="#fff" style={{ marginRight: 4 }} />
                            <Text style={styles.pillText}>{details.views?.toLocaleString()}</Text>
                        </View>
                    </View>
                </View>

                {/* ── Info Card ── */}
                <View style={[styles.infoCard, { backgroundColor: colors.surface }]}>

                    {/* Color Palette */}
                    <View style={styles.row}>
                        <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Palette</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {details.colors?.map((c) => (
                                <View key={c} style={[styles.colorDot, { backgroundColor: c }]} />
                            ))}
                        </ScrollView>
                    </View>

                    {/* Stats 2×2 grid */}
                    <View style={styles.statsGrid}>
                        <StatCard icon="favorite" label="Wallhaven Faves" value={details.favorites?.toLocaleString()} colors={colors} />
                        <StatCard icon="insert-drive-file" label="File Size" value={formatBytes(details.file_size)} colors={colors} />
                        <StatCard icon="photo-size-select-actual" label="Purity" value={details.purity?.charAt(0).toUpperCase() + details.purity?.slice(1)} colors={colors} />
                        <StatCard icon="category" label="Category" value={details.category?.charAt(0).toUpperCase() + details.category?.slice(1)} colors={colors} />
                    </View>

                    {/* Tags */}
                    {details.tags?.length > 0 && (
                        <View style={styles.tagsSection}>
                            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Tags</Text>
                            <View style={styles.tagsWrap}>
                                {details.tags.slice(0, 14).map((tag) => (
                                    <View key={tag.id} style={[styles.tagChip, { backgroundColor: colors.surfaceElevated }]}>
                                        <Text style={[styles.tagText, { color: colors.textSecondary }]}>#{tag.name}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Source */}
                    {details.source ? (
                        <TouchableOpacity
                            style={[styles.sourceBtn, { backgroundColor: colors.surfaceElevated }]}
                            onPress={() => Linking.openURL(details.source).catch(() => Alert.alert('Error', 'Cannot open URL'))}
                        >
                            <Icon name="link" size={18} color={colors.primary} style={{ marginRight: 8 }} />
                            <Text style={[styles.sourceText, { color: colors.primary }]} numberOfLines={1}>
                                View Source
                            </Text>
                            <Icon name="open-in-new" size={14} color={colors.textSecondary} style={{ marginLeft: 'auto' }} />
                        </TouchableOpacity>
                    ) : null}
                </View>
            </ScrollView>

            {/* ── Floating Back Button ── */}
            <TouchableOpacity
                style={[styles.backBtn, { top: insets.top + 8 }]}
                onPress={() => navigation.goBack()}
            >
                <Icon name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>

            {/* ── Bottom Action Bar ── */}
            <View style={[styles.actionBar, { backgroundColor: colors.surface, paddingBottom: insets.bottom + 10, borderTopColor: colors.border }]}>
                {/* Save */}
                <TouchableOpacity style={styles.actionItem} onPress={() => toggleFavorite(details)} activeOpacity={0.75}>
                    <View style={[styles.actionIconWrap, { backgroundColor: favored ? 'rgba(233,30,99,0.15)' : colors.surfaceElevated }]}>
                        <Icon name={favored ? 'favorite' : 'favorite-border'} size={24} color={favored ? '#E91E63' : colors.textSecondary} />
                    </View>
                    <Text style={[styles.actionLabel, { color: favored ? '#E91E63' : colors.textSecondary }]}>
                        {favored ? 'Saved' : 'Save'}
                    </Text>
                </TouchableOpacity>

                {/* Download */}
                <TouchableOpacity style={styles.actionItem} onPress={handleDownload} disabled={isDownloading} activeOpacity={0.75}>
                    <View style={[styles.actionIconWrap, { backgroundColor: colors.surfaceElevated }]}>
                        {isDownloading
                            ? <ActivityIndicator size="small" color={colors.primary} />
                            : <Icon name="file-download" size={24} color={colors.primary} />
                        }
                    </View>
                    <Text style={[styles.actionLabel, { color: colors.primary }]}>
                        {isDownloading ? `${progress}%` : 'Download'}
                    </Text>
                </TouchableOpacity>

                {/* Apply */}
                <TouchableOpacity style={styles.actionItem} onPress={() => setApplySheetVisible(true)} disabled={applying} activeOpacity={0.75}>
                    <View style={[styles.actionIconWrap, { backgroundColor: colors.primaryGlow }]}>
                        {applying
                            ? <ActivityIndicator size="small" color={colors.primary} />
                            : <Icon name="wallpaper" size={24} color={colors.primary} />
                        }
                    </View>
                    <Text style={[styles.actionLabel, { color: colors.primary }]}>
                        {applying ? 'Applying…' : 'Apply'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* ── Apply Sheet Modal ── */}
            <ApplyWallpaperSheet
                visible={applySheetVisible}
                imageUri={details.path}
                onClose={() => setApplySheetVisible(false)}
                onApply={handleApply}
            />
        </View>
    );
};

const StatCard = ({ icon, label, value, colors }) => (
    <View style={[styles.statCard, { backgroundColor: colors.surfaceElevated }]}>
        <Icon name={icon} size={20} color={colors.primary} style={{ marginBottom: 8 }} />
        <Text style={[styles.statValue, { color: colors.text }]}>{value ?? '—'}</Text>
        <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: { flex: 1 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
    retryBtn: { paddingHorizontal: 28, paddingVertical: 12, borderRadius: 24 },

    // Image
    imageWrapper: { width, height: height * 0.62, position: 'relative' },
    heroImage: { width: '100%', height: '100%' },
    imageScrim: {
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
        backgroundColor: 'rgba(0,0,0,0)', // transparent — handled by pill bg
    },
    imagePills: {
        position: 'absolute', bottom: 16, left: 16,
        flexDirection: 'row', gap: 8,
    },
    pill: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.55)',
        paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14,
    },
    pillText: { color: '#fff', fontSize: 11, fontWeight: '600' },

    // Back btn
    backBtn: {
        position: 'absolute', left: 16, zIndex: 10,
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center', alignItems: 'center',
    },

    // Info card
    infoCard: {
        borderTopLeftRadius: 28, borderTopRightRadius: 28,
        marginTop: -24, paddingTop: 24,
        paddingHorizontal: 20, paddingBottom: 20,
    },
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
    sectionLabel: { fontSize: 12, fontWeight: '700', letterSpacing: 0.8, marginBottom: 12 },
    colorDot: {
        width: 26, height: 26, borderRadius: 13,
        marginRight: 8, borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)',
    },

    // Stats
    statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
    statCard: {
        flex: 1, minWidth: '44%', borderRadius: 16,
        padding: 16, alignItems: 'flex-start',
    },
    statValue: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
    statLabel: { fontSize: 11 },

    // Tags
    tagsSection: { marginBottom: 20 },
    tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    tagChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
    tagText: { fontSize: 12, fontWeight: '500' },

    // Source
    sourceBtn: {
        flexDirection: 'row', alignItems: 'center',
        padding: 14, borderRadius: 16,
    },
    sourceText: { fontSize: 14, fontWeight: '600', flex: 1 },

    // Action bar
    actionBar: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        flexDirection: 'row', justifyContent: 'space-around',
        paddingTop: 12, paddingHorizontal: 16,
        borderTopWidth: StyleSheet.hairlineWidth,
        elevation: 16,
    },
    actionItem: { alignItems: 'center', gap: 6 },
    actionIconWrap: {
        width: 54, height: 54, borderRadius: 27,
        justifyContent: 'center', alignItems: 'center',
    },
    actionLabel: { fontSize: 12, fontWeight: '600' },
});

export default WallpaperDetailScreen;

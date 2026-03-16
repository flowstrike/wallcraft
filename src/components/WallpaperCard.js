import React from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 36) / 2; // 12px padding each side + 12 gap
const CARD_HEIGHT = CARD_WIDTH * 1.8; // ~9:16 portrait ratio

const WallpaperCard = ({ item, onPress }) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: colors.surfaceElevated }]}
            onPress={() => onPress(item)}
            activeOpacity={0.85}
        >
            <FastImage
                style={styles.image}
                source={{
                    uri: item.thumbs.large || item.thumbs.original || item.thumbs.small,
                    priority: 'high',
                }}
                resizeMode={'cover'}
            />
            <View style={styles.overlay}>
                <View style={styles.badge}>
                    <FastImage
                        source={{ uri: `https://placehold.co/1x1/${(item.colors && item.colors[0] || '#333').replace('#', '')}/png` }}
                        style={[styles.colorDot, { backgroundColor: item.colors?.[0] || '#333' }]}
                    />
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 12,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 40,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        paddingHorizontal: 8,
        paddingBottom: 8,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    colorDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.3)',
    },
});

export default React.memo(WallpaperCard);

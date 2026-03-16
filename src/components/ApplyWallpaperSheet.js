import React from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    Modal, Image, Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

const APPLY_OPTIONS = [
    { id: 'home', label: 'Home Screen', icon: 'home', desc: 'Set as home screen wallpaper' },
    { id: 'lock', label: 'Lock Screen', icon: 'lock', desc: 'Set as lock screen wallpaper' },
    { id: 'both', label: 'Both Screens', icon: 'smartphone', desc: 'Set for both home & lock' },
];

const ApplyWallpaperSheet = ({ visible, imageUri, onClose, onApply }) => {
    const { colors } = useTheme();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.backdrop}
                activeOpacity={1}
                onPress={onClose}
            />
            <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
                {/* Handle */}
                <View style={[styles.handle, { backgroundColor: colors.border }]} />

                <Text style={[styles.title, { color: colors.text }]}>Apply Wallpaper</Text>

                {/* Mini Preview */}
                {imageUri ? (
                    <View style={styles.previewContainer}>
                        <Image
                            source={{ uri: imageUri }}
                            style={styles.previewImage}
                            resizeMode="cover"
                        />
                        <View style={[styles.previewOverlay, { backgroundColor: colors.primaryGlow }]}>
                            <Icon name="wallpaper" size={28} color={colors.primary} />
                        </View>
                    </View>
                ) : null}

                {/* Options */}
                <View style={styles.optionsList}>
                    {APPLY_OPTIONS.map((opt) => (
                        <TouchableOpacity
                            key={opt.id}
                            style={[styles.optionBtn, { backgroundColor: colors.surfaceElevated }]}
                            onPress={() => onApply(opt.id)}
                            activeOpacity={0.75}
                        >
                            <View style={[styles.optionIcon, { backgroundColor: colors.primaryGlow }]}>
                                <Icon name={opt.icon} size={22} color={colors.primary} />
                            </View>
                            <View style={styles.optionText}>
                                <Text style={[styles.optionLabel, { color: colors.text }]}>{opt.label}</Text>
                                <Text style={[styles.optionDesc, { color: colors.textSecondary }]}>{opt.desc}</Text>
                            </View>
                            <Icon name="chevron-right" size={20} color={colors.textSecondary} />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Cancel */}
                <TouchableOpacity
                    style={[styles.cancelBtn, { borderColor: colors.border }]}
                    onPress={onClose}
                >
                    <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    sheet: {
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 12,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        alignSelf: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: -0.3,
        marginBottom: 16,
        textAlign: 'center',
    },
    previewContainer: {
        alignSelf: 'center',
        width: 90,
        height: 160,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
        position: 'relative',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    previewOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionsList: {
        gap: 12,
        marginBottom: 20,
    },
    optionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
    },
    optionIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    optionText: {
        flex: 1,
    },
    optionLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    optionDesc: {
        fontSize: 12,
    },
    cancelBtn: {
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    cancelText: {
        fontSize: 15,
        fontWeight: '600',
    },
});

export default ApplyWallpaperSheet;

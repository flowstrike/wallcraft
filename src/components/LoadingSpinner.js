import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

const LoadingSpinner = ({ fullScreen = false }) => {
    const { colors } = useTheme();

    if (fullScreen) {
        return (
            <View style={[styles.fullScreen, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ActivityIndicator size="small" color={colors.primary} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default LoadingSpinner;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const SettingsScreen = () => {
    const { colors, isDark, isIncognito, toggleTheme } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: colors.background }]}
            contentContainerStyle={{ paddingBottom: insets.bottom + 100, paddingTop: insets.top + 8 }}
        >
            <Text style={[styles.pageTitle, { color: colors.text }]}>Settings</Text>

            {/* Appearance */}
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>APPEARANCE</Text>
                <View style={[styles.card, { backgroundColor: colors.surface }]}>
                    <View style={styles.row}>
                        <View style={styles.rowLeft}>
                            <View style={[styles.iconCircle, { backgroundColor: colors.surfaceElevated }]}>
                                <Icon name={isDark ? 'dark-mode' : 'light-mode'} size={20} color={colors.primary} />
                            </View>
                            <View>
                                <Text style={[styles.rowTitle, { color: colors.text }]}>Dark Mode</Text>
                                <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
                                    {isDark ? 'Currently dark' : 'Currently light'}
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            disabled={isIncognito}
                            trackColor={{ false: '#767577', true: colors.primaryGlow }}
                            thumbColor={isDark ? colors.primary : '#f4f3f4'}
                        />
                    </View>
                </View>
                {isIncognito && (
                    <Text style={[styles.hint, { color: colors.danger, marginTop: 8 }]}>
                        Theme cannot be changed while Incognito Mode is active.
                    </Text>
                )}
            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: '800',
        paddingHorizontal: 16,
        paddingBottom: 20,
        letterSpacing: -0.5,
    },
    section: {
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        marginBottom: 10,
        marginLeft: 4,
    },
    card: {
        borderRadius: 16,
        padding: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
    },
    rowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    rowTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    rowSubtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    hint: {
        fontSize: 12,
        marginTop: 8,
        marginLeft: 4,
        lineHeight: 16,
    },

});

export default SettingsScreen;

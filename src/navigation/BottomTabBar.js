import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

const TAB_CONFIG = [
    { name: 'HomeTab', icon: 'home', label: 'Home' },
    { name: 'SearchTab', icon: 'search', label: 'Search' },
    { name: 'SavedTab', icon: 'favorite', label: 'Saved' },
    { name: 'SettingsTab', icon: 'settings', label: 'Settings' },
];

const BottomTabBar = ({ state, descriptors, navigation }) => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <View style={[
            styles.wrapper,
            { paddingBottom: Math.max(insets.bottom, 8) }
        ]}>
            <View style={[
                styles.container,
                { backgroundColor: colors.tabBar }
            ]}>
                {state.routes.map((route, index) => {
                    const isFocused = state.index === index;
                    const config = TAB_CONFIG.find(t => t.name === route.name) || TAB_CONFIG[0];

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={onPress}
                            activeOpacity={0.7}
                            style={styles.tab}
                        >
                            <View style={[
                                styles.iconWrap,
                                isFocused && { backgroundColor: colors.primaryGlow }
                            ]}>
                                <Icon
                                    name={config.icon}
                                    size={24}
                                    color={isFocused ? colors.tabBarActive : colors.tabBarInactive}
                                />
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 24,
        paddingTop: 0,
    },
    container: {
        flexDirection: 'row',
        borderRadius: 28,
        paddingVertical: 8,
        paddingHorizontal: 8,
        elevation: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 6,
    },
    iconWrap: {
        width: 48,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default BottomTabBar;

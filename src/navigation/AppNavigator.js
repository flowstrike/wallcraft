import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { ThemeProvider, useTheme } from '../context/ThemeContext';

import BottomTabBar from './BottomTabBar';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import SavedScreen from '../screens/SavedScreen';
import SettingsScreen from '../screens/SettingsScreen';
import WallpaperDetailScreen from '../screens/WallpaperDetailScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStackScreen = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen
                name="WallpaperDetail"
                component={WallpaperDetailScreen}
                options={{
                    headerShown: true,
                    title: '',
                    headerTransparent: true,
                    headerTintColor: '#fff',
                }}
            />
        </Stack.Navigator>
    );
};

const SearchStackScreen = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen
            name="WallpaperDetail"
            component={WallpaperDetailScreen}
            options={{
                headerShown: true,
                title: '',
                headerTransparent: true,
                headerTintColor: '#fff',
            }}
        />
    </Stack.Navigator>
);

const SavedStackScreen = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SavedMain" component={SavedScreen} />
            <Stack.Screen
                name="WallpaperDetail"
                component={WallpaperDetailScreen}
                options={{
                    headerShown: true,
                    title: '',
                    headerTransparent: true,
                    headerTintColor: '#fff',
                }}
            />
        </Stack.Navigator>
    );
};

const AppNav = () => {
    const theme = useTheme();
    const { colors, isDark, isIncognito, fonts } = theme;

    return (
        <NavigationContainer theme={{
            dark: isIncognito ? true : isDark,
            colors: {
                background: colors.background,
                card: colors.surface,
                text: colors.text,
                border: colors.border,
                primary: colors.primary,
            },
            fonts: fonts,
        }}>
            <StatusBar
                barStyle={(isIncognito || isDark) ? 'light-content' : 'dark-content'}
                backgroundColor={colors.background}
            />
            <Tab.Navigator
                tabBar={(props) => {
                    // Hide bar when any nested stack is on WallpaperDetail
                    const currentRoute = props.state.routes[props.state.index];
                    const nestedState = currentRoute?.state;
                    const nestedRouteName = nestedState
                        ? nestedState.routes[nestedState.index]?.name
                        : null;
                    if (nestedRouteName === 'WallpaperDetail') return null;
                    return <BottomTabBar {...props} />;
                }}
                screenOptions={{
                    headerShown: false,
                }}
            >
                <Tab.Screen name="HomeTab" component={HomeStackScreen} />
                <Tab.Screen name="SearchTab" component={SearchStackScreen} />
                <Tab.Screen name="SavedTab" component={SavedStackScreen} />
                <Tab.Screen name="SettingsTab" component={SettingsScreen} />
            </Tab.Navigator>
        </NavigationContainer>
    );
};

const AppNavigator = () => {
    return (
        <ThemeProvider>
            <AppNav />
        </ThemeProvider>
    );
};

export default AppNavigator;

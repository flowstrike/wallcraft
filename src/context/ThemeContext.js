import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, incognitoTheme } from '../theme/colors';
import { getItem, saveItem, KEYS } from '../utils/storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const systemColorScheme = useColorScheme();
    const [isDark, setIsDark] = useState(systemColorScheme === 'dark');
    const [isIncognito, setIsIncognito] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadTheme = async () => {
            const savedTheme = await getItem(KEYS.THEME_PREF);
            if (savedTheme !== null) {
                setIsDark(savedTheme === 'dark');
            } else {
                setIsDark(systemColorScheme === 'dark');
            }
            setIsLoaded(true);
        };
        loadTheme();
    }, [systemColorScheme]);

    const toggleTheme = async () => {
        // Disallow toggling light/dark while in Incognito
        if (isIncognito) return;
        const newTheme = !isDark;
        setIsDark(newTheme);
        await saveItem(KEYS.THEME_PREF, newTheme ? 'dark' : 'light');
    };

    const toggleIncognito = () => {
        setIsIncognito(prev => !prev);
    };

    // Determine current colors
    const colors = isIncognito ? incognitoTheme : (isDark ? darkTheme : lightTheme);

    if (!isLoaded) return null; // Avoid jumping theme on initial render

    return (
        <ThemeContext.Provider value={{
            isDark,
            isIncognito,
            colors: colors,
            toggleTheme,
            toggleIncognito,
            fonts: {
                regular: { fontFamily: 'System', fontWeight: '400' },
                medium: { fontFamily: 'System', fontWeight: '500' },
                bold: { fontFamily: 'System', fontWeight: '700' },
                heavy: { fontFamily: 'System', fontWeight: '900' },
            }
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useTheme } from '../context/ThemeContext';

const CategoryChip = ({ label, isSelected, onPress, icon, isSortChip = false }) => {
    const { colors } = useTheme();

    return (
        <TouchableOpacity
            style={[
                styles.chip,
                isSortChip ? styles.sortChip : styles.topicChip,
                {
                    backgroundColor: isSelected ? colors.primary : colors.surfaceElevated,
                    borderColor: isSelected ? colors.primaryGlow : 'transparent',
                }
            ]}
            onPress={onPress}
            activeOpacity={0.8}
        >
            {icon && (
                <Icon
                    name={icon}
                    size={isSortChip ? 16 : 20}
                    color={isSelected ? '#FFF' : colors.text}
                    style={styles.icon}
                />
            )}
            <Text style={[
                styles.text,
                isSortChip ? styles.sortText : styles.topicText,
                { color: isSelected ? '#FFF' : colors.textSecondary }
            ]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    topicChip: {
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 24,
        minWidth: 80,
    },
    sortChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    icon: {
        marginRight: 8,
    },
    text: {
        fontWeight: '600',
    },
    topicText: {
        fontSize: 15,
        letterSpacing: 0.2,
    },
    sortText: {
        fontSize: 13,
    },
});

export default React.memo(CategoryChip);

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ParentHeaderProps {
    title: string;
    subtitle: string;
    showUpgrade?: boolean;
    onPressUpgrade?: () => void;
    colors?: [string, string];
}

export default function ParentHeader({
    title,
    subtitle,
    showUpgrade = false,
    onPressUpgrade,
    colors = ['#448AFF', '#2962FF'],
}: ParentHeaderProps) {
    const upgradeContent = (
        <>
            <MaterialCommunityIcons name="crown-outline" size={16} color="#FFF" style={{ marginRight: 4 }} />
            <Text style={styles.upgradeText}>업그레이드</Text>
        </>
    );

    return (
        <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.headerGradient}>
            <SafeAreaView edges={['top']} style={styles.safeAreaHeader}>
                <View style={styles.headerContent}>
                    <View style={styles.textWrap}>
                        <Text style={styles.headerTitle}>{title}</Text>
                        <Text style={styles.headerSubtitle}>{subtitle}</Text>
                    </View>
                    {showUpgrade && (
                        onPressUpgrade ? (
                            <TouchableOpacity style={styles.upgradeButton} onPress={onPressUpgrade}>
                                {upgradeContent}
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.upgradeButton}>{upgradeContent}</View>
                        )
                    )}
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    headerGradient: {
        paddingBottom: 20,
    },
    safeAreaHeader: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    textWrap: {
        flex: 1,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    upgradeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    upgradeText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 12,
    },
});

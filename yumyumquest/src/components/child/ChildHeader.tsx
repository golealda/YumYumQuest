import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ANT_MASCOT = require('../../../assets/ant_mascot.png');

type HeaderSyncStatus = 'synced' | 'offline' | 'error';

interface ChildHeaderProps {
    childName: string;
    subtitle?: string;
    grainCount: number;
    syncStatus?: HeaderSyncStatus;
}

export default function ChildHeader({
    childName,
    subtitle = '오늘도 열심히 일해볼까?',
    grainCount,
    syncStatus,
}: ChildHeaderProps) {
    return (
        <LinearGradient
            colors={['#FF6F00', '#FFA000', '#FFCA28']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.headerGradient}
        >
            <SafeAreaView edges={['top']} style={styles.safeAreaHeader}>
                <View style={styles.headerContent}>
                    <Image source={ANT_MASCOT} style={styles.headerMascot} resizeMode="contain" />
                    <View style={styles.headerTextContainer}>
                        <Text style={styles.greetingTitle}>안녕, {childName}!</Text>
                        <Text style={styles.greetingSubtitle}>{subtitle}</Text>
                    </View>
                    <View style={styles.headerRight}>
                        {syncStatus && syncStatus !== 'synced' && (
                            <View style={[styles.syncBadge, syncStatus === 'error' ? styles.syncBadgeError : styles.syncBadgeOffline]}>
                                <Ionicons
                                    name={syncStatus === 'error' ? 'alert-circle-outline' : 'cloud-offline-outline'}
                                    size={11}
                                    color="#FFF"
                                />
                                <Text style={styles.syncBadgeText}>{syncStatus === 'error' ? '동기화 실패' : '오프라인'}</Text>
                            </View>
                        )}
                        <View style={styles.grainBadge}>
                            <Text style={styles.grainCount}>{grainCount}</Text>
                            <Text style={styles.grainLabel}>곡식</Text>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    headerGradient: {
        paddingBottom: 30,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    safeAreaHeader: {
        paddingHorizontal: 20,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    headerMascot: {
        width: 60,
        height: 60,
        marginRight: 15,
    },
    headerTextContainer: {
        flex: 1,
    },
    greetingTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    },
    greetingSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
    },
    headerRight: {
        alignItems: 'flex-end',
    },
    syncBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 7,
        paddingVertical: 4,
        borderRadius: 999,
        marginBottom: 6,
        gap: 4,
    },
    syncBadgeOffline: {
        backgroundColor: 'rgba(71, 85, 105, 0.8)',
    },
    syncBadgeError: {
        backgroundColor: 'rgba(220, 38, 38, 0.9)',
    },
    syncBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: '700',
    },
    grainBadge: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        minWidth: 70,
    },
    grainCount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
    },
    grainLabel: {
        fontSize: 12,
        color: '#FFF',
    },
});

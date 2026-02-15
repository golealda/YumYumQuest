import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getSubscriptionActive } from '../services/subscriptionPreference';

/* 
 * UI Component for the Parent's "Manage" Screen 
 * This screen matches the reference image: Empty state for "Manage" tab
 */

export default function ParentManageScreen() {
    const [isPremium, setIsPremium] = useState(false);

    // Mock handlers
    const handleUpgrade = () => {
        Alert.alert("알림", "업그레이드 기능은 준비 중입니다.");
    };

    useFocusEffect(
        useCallback(() => {
            let mounted = true;
            const loadSubscription = async () => {
                const premium = await getSubscriptionActive();
                if (!mounted) return;
                setIsPremium(premium);
            };
            loadSubscription();
            return () => {
                mounted = false;
            };
        }, [])
    );

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Header Section with Blue Gradient - Reuse from Connection Screen for consistency */}
            <LinearGradient
                colors={['#448AFF', '#2962FF']} // Blue gradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <SafeAreaView edges={['top']} style={styles.safeAreaHeader}>
                    {/* Back Button (Visual only since this is main tab) */}


                    <View style={styles.headerContent}>
                        <View>
                            <Text style={styles.headerTitle}>부모님 관리 페이지</Text>
                            <Text style={styles.headerSubtitle}>과제와 보상을 관리해주세요</Text>
                        </View>
                        {!isPremium && (
                            <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
                                <MaterialCommunityIcons name="crown-outline" size={16} color="#FFF" style={{ marginRight: 4 }} />
                                <Text style={styles.upgradeText}>업그레이드</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </SafeAreaView>
            </LinearGradient>

            {/* Main Content Area */}
            <View style={styles.contentContainer}>

                {/* Empty State Card */}
                <View style={styles.emptyCard}>
                    <Text style={styles.babyEmoji}>👶</Text>
                    <Text style={styles.emptyStateTitle}>아직 연결된 아이가 없어요</Text>
                    <Text style={styles.emptyStateSubtitle}>가족 연결 탭에서 아이를 추가해주세요</Text>
                </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8E1', // Cream background
    },
    headerGradient: {
        paddingBottom: 20,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    safeAreaHeader: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    navBack: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 10,
    },
    navBackText: {
        color: '#FFF',
        fontSize: 16,
        marginLeft: 5,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
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
    contentContainer: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        paddingTop: 40,
    },
    emptyCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        paddingVertical: 60,
        paddingHorizontal: 20,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    babyEmoji: {
        fontSize: 64,
        marginBottom: 20,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#37474F', // Dark Blue Grey
        marginBottom: 10,
    },
    emptyStateSubtitle: {
        fontSize: 15,
        color: '#78909C', // Blue Grey
        textAlign: 'center',
    },
});

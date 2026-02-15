import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ParentHeader from '../../components/parent/ParentHeader';
import { ConnectedChildSummary, getConnectedChildrenForCurrentParent } from '../../services/childConnectionService';
import { getSubscriptionActive } from '../../services/subscriptionPreference';

/* 
 * UI Component for the Parent's "Manage" Screen 
 * This screen matches the reference image: Empty state for "Manage" tab
 */

export default function ParentManageScreen() {
    const [isPremium, setIsPremium] = useState(false);
    const [connectedChildren, setConnectedChildren] = useState<ConnectedChildSummary[]>([]);

    // Mock handlers
    const handleUpgrade = () => {
        Alert.alert("알림", "업그레이드 기능은 준비 중입니다.");
    };

    useFocusEffect(
        useCallback(() => {
            let mounted = true;
            const loadSubscription = async () => {
                const [premium, children] = await Promise.all([
                    getSubscriptionActive(),
                    getConnectedChildrenForCurrentParent(),
                ]);
                if (!mounted) return;
                setIsPremium(premium);
                setConnectedChildren(children);
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
            <ParentHeader
                title="부모님 관리 페이지"
                subtitle="과제와 보상을 관리해주세요"
                showUpgrade={!isPremium}
                onPressUpgrade={handleUpgrade}
            />

            {/* Main Content Area */}
            <ScrollView style={styles.contentContainer} contentContainerStyle={styles.contentScroll}>
                <View style={styles.childrenSummaryCard}>
                    <View style={styles.summaryHeader}>
                        <View style={styles.summaryTitleRow}>
                            <Ionicons name="people-outline" size={20} color="#2962FF" style={{ marginRight: 8 }} />
                            <Text style={styles.summaryTitle}>연결된 아이들</Text>
                        </View>
                        <View style={styles.countBadge}>
                            <Text style={styles.countText}>{connectedChildren.length}명</Text>
                        </View>
                    </View>

                    {connectedChildren.length === 0 ? (
                        <Text style={styles.summaryEmptyText}>아직 연결된 아이가 없어요</Text>
                    ) : (
                        connectedChildren.map((child) => (
                            <View key={child.childId} style={styles.childRow}>
                                <Text style={styles.childAvatar}>{child.avatar}</Text>
                                <View style={styles.childInfo}>
                                    <Text style={styles.childName}>{child.nickname}</Text>
                                    <Text style={styles.childMeta}>나이: {child.age ?? '미입력'}</Text>
                                </View>
                                <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
                            </View>
                        ))
                    )}
                </View>

                <View style={styles.emptyCard}>
                    <Text style={styles.babyEmoji}>👶</Text>
                    <Text style={styles.emptyStateTitle}>
                        {connectedChildren.length > 0 ? '관리 기능이 곧 추가됩니다' : '아직 연결된 아이가 없어요'}
                    </Text>
                    <Text style={styles.emptyStateSubtitle}>
                        {connectedChildren.length > 0 ? '연결된 아이 관리 기능을 준비 중입니다' : '가족 연결 탭에서 아이를 추가해주세요'}
                    </Text>
                </View>
            </ScrollView>
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
    },
    contentScroll: {
        padding: 20,
        paddingTop: 40,
    },
    childrenSummaryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 14,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#E8EEF7',
    },
    summaryHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    summaryTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    summaryTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F2D3D',
    },
    countBadge: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    countText: {
        color: '#1565C0',
        fontSize: 12,
        fontWeight: '700',
    },
    summaryEmptyText: {
        color: '#6E7F96',
        fontSize: 13,
    },
    childRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F7FAFF',
        borderWidth: 1,
        borderColor: '#DFEAF9',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 8,
    },
    childAvatar: {
        fontSize: 24,
        marginRight: 10,
    },
    childInfo: {
        flex: 1,
    },
    childName: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1F2D3D',
    },
    childMeta: {
        marginTop: 2,
        fontSize: 12,
        color: '#6E7F96',
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

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ParentHeader from '../../components/parent/ParentHeader';
import { ConnectedChildSummary, getConnectedChildrenForCurrentParent } from '../../services/childConnectionService';
import { getSubscriptionActive } from '../../services/subscriptionPreference';

/* 
 * UI Component for the Parent's "Connection" Screen 
 * This screen matches the reference image: Family Connection, Code Generation, Connected Children, Demo Test
 */

export default function ParentConnectionScreen() {
    const [connectedChildren, setConnectedChildren] = useState<ConnectedChildSummary[]>([]);
    const [isPremium, setIsPremium] = useState(false);

    // Mock handlers
    const handleUpgrade = () => {
        Alert.alert("알림", "업그레이드 기능은 준비 중입니다.");
    };

    const handleAddChildManually = () => {
        Alert.alert("아이 추가", "아이 직접 추가하기 화면으로 이동합니다.");
    };

    useFocusEffect(
        useCallback(() => {
            let mounted = true;
            const loadScreenData = async () => {
                const [premium, children] = await Promise.all([
                    getSubscriptionActive(),
                    getConnectedChildrenForCurrentParent(),
                ]);
                if (!mounted) return;
                setIsPremium(premium);
                setConnectedChildren(children);
            };
            loadScreenData();
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
            <ScrollView style={styles.contentContainer} contentContainerStyle={styles.scrollContent}>

                {/* Family Connection Section Title */}
                <View style={styles.sectionHeader}>
                    <View style={styles.iconTitleRow}>
                        <Ionicons name="people-outline" size={24} color="#2962FF" style={{ marginRight: 8 }} />
                        <Text style={styles.sectionTitle}>가족 연결</Text>
                    </View>
                    <Text style={styles.sectionSubtitle}>아이와 앱을 연결하여 함께 사용하세요</Text>
                </View>

                {/* Connected Children Card */}
                <View style={styles.childrenCard}>
                    <View style={styles.childrenHeader}>
                        <View style={styles.iconTitleRow}>
                            <Ionicons name="person-add-outline" size={20} color="#448AFF" style={{ marginRight: 8 }} />
                            <Text style={styles.cardSectionTitle}>연결된 아이들</Text>
                        </View>
                        <View style={styles.countBadge}>
                            <Text style={styles.countText}>{connectedChildren.length}</Text>
                            <Text style={styles.countLabel}>명</Text>
                        </View>
                    </View>

                    {connectedChildren.length === 0 ? (
                        <View style={styles.emptyStateContainer}>
                            <Text style={styles.babyEmoji}>👶</Text>
                            <Text style={styles.emptyStateTitle}>아직 연결된 아이가 없어요</Text>
                            <Text style={styles.emptyStateSubtitle}>아이 모드에서 가족 코드를 입력하면 연결됩니다</Text>
                        </View>
                    ) : (
                        <View style={styles.childListContainer}>
                            {connectedChildren.map((child) => (
                                <View key={child.childId} style={styles.childRow}>
                                    <Text style={styles.childAvatar}>{child.avatar}</Text>
                                    <View style={styles.childInfo}>
                                        <Text style={styles.childName}>{child.nickname}</Text>
                                        <Text style={styles.childMeta}>나이: {child.age ?? '미입력'}</Text>
                                    </View>
                                    <Ionicons name="checkmark-circle" size={20} color="#2E7D32" />
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                {/* Demo Test Card */}
                <View style={styles.demoCard}>
                    <View style={styles.demoHeader}>
                        <MaterialCommunityIcons name="lightbulb-on-outline" size={18} color="#EDA22D" style={{ marginRight: 8 }} />
                        <Text style={styles.demoTitle}>
                            <Text style={{ fontWeight: 'bold' }}>데모 테스트:</Text> 수동으로 아이를 추가할 수 있습니다
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.demoButton} onPress={handleAddChildManually}>
                        <Text style={styles.demoButtonText}>아이 직접 추가하기</Text>
                    </TouchableOpacity>
                </View>

                {/* Bottom Padding for scroll */}
                <View style={{ height: 100 }} />
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
    scrollContent: {
        padding: 20,
    },
    sectionHeader: {
        marginBottom: 20,
    },
    iconTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#666',
        marginLeft: 0,
    },
    childrenCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        minHeight: 200,
    },
    childrenHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    cardSectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    countBadge: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 15,
        alignItems: 'baseline',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 2,
    },
    countText: {
        color: '#1565C0',
        fontWeight: 'bold',
        fontSize: 15,
    },
    countLabel: {
        color: '#1565C0',
        fontSize: 11,
    },
    emptyStateContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    babyEmoji: {
        fontSize: 48,
        marginBottom: 15,
    },
    emptyStateTitle: {
        fontSize: 15,
        color: '#555',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    emptyStateSubtitle: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
    },
    childListContainer: {
        marginTop: -10,
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
        fontSize: 26,
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
    demoCard: {
        backgroundColor: '#FFFDE7', // Light yellow
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: '#FFE082',
        marginBottom: 20,
    },
    demoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        justifyContent: 'center',
    },
    demoTitle: {
        fontSize: 14,
        color: '#D84315', // Deep Orange
    },
    demoButton: {
        backgroundColor: '#FDD835', // Yellow
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
        shadowColor: '#FBC02D',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 2,
    },
    demoButtonText: {
        color: '#3E2723', // Dark Brown
        fontWeight: 'bold',
        fontSize: 15,
    },
});

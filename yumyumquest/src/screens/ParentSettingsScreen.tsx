import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { signOut } from 'firebase/auth';
import React, { useCallback, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../firebase';
import { getOrCreateFamilyCode } from '../services/onboardingService';
import { setAutoLoginEnabled } from '../services/sessionPreference';
import {
    getSelectedTheme,
    getSubscriptionActive,
    ParentThemeId,
    setSelectedTheme,
} from '../services/subscriptionPreference';
import { Parent } from '../types/firestore';

/* 
 * UI Component for the Parent's "Settings" Screen 
 * Matches provided screenshots: Tabbed interface (Theme, Report, Account)
 */

type TabType = 'theme' | 'report' | 'account';

export default function ParentSettingsScreen() {
    const [activeTab, setActiveTab] = useState<TabType>('report');
    const [isPremium, setIsPremium] = useState(false);
    const [selectedThemeId, setSelectedThemeId] = useState<ParentThemeId>('ant_and_grasshopper');
    const [profileName, setProfileName] = useState('보호자');
    const [profileEmail, setProfileEmail] = useState('');
    const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
    const [familyCode, setFamilyCode] = useState('');

    const handleUpgrade = () => router.push('/subscription');
    const handlePremiumInfo = () => router.push('/subscription');
    const handleOpenPremiumLab = () => router.push('/premium-lab');

    const handleCopyFamilyCode = async () => {
        if (!familyCode) return;

        try {
            await Clipboard.setStringAsync(familyCode);
            Alert.alert('복사 완료', '가족 연결 코드가 복사되었습니다.');
        } catch (_) {
            Alert.alert('오류', '복사에 실패했어요. 다시 시도해주세요.');
        }
    };

    useFocusEffect(
        useCallback(() => {
            let mounted = true;

            const loadThemeState = async () => {
                const user = auth.currentUser;
                const [premium, selectedTheme] = await Promise.all([getSubscriptionActive(), getSelectedTheme()]);

                let parentData: Partial<Parent> | null = null;
                if (user) {
                    const parentRef = doc(db, 'parents', user.uid);
                    const parentSnap = await getDoc(parentRef);
                    parentData = parentSnap.exists() ? (parentSnap.data() as Partial<Parent>) : null;
                }

                if (!mounted) return;
                setIsPremium(premium);
                setSelectedThemeId(selectedTheme);
                setProfileName(parentData?.displayName || user?.displayName || '보호자');
                setProfileEmail(parentData?.email || user?.email || '');
                setProfilePhotoUrl(parentData?.photoUrl || user?.photoURL || null);
                if (user) {
                    const code = await getOrCreateFamilyCode(user.uid);
                    setFamilyCode(code);
                } else {
                    setFamilyCode('');
                }
            };

            loadThemeState();
            return () => {
                mounted = false;
            };
        }, [])
    );

    const handleThemeSelect = async (themeId: ParentThemeId, premiumOnly: boolean) => {
        if (premiumOnly && !isPremium) {
            Alert.alert("프리미엄 전용", "이 테마는 구독 후 사용할 수 있어요.", [
                { text: "취소", style: "cancel" },
                { text: "구독하기", onPress: handleUpgrade },
            ]);
            return;
        }

        await setSelectedTheme(themeId);
        setSelectedThemeId(themeId);
        Alert.alert("테마 변경", "테마가 변경되었습니다.");
    };

    const handleLogout = () => {
        Alert.alert(
            "로그아웃",
            "정말 로그아웃 하시겠습니까?",
            [
                { text: "취소", style: "cancel" },
                {
                    text: "로그아웃",
                    style: "destructive",
                    onPress: async () => {
                        console.log("Logout initiated");
                        try {
                            await signOut(auth);
                            await setAutoLoginEnabled(false);
                            console.log("Firebase signOut successful");
                            router.replace('/login');
                        } catch (e) {
                            console.error("Logout error", e);
                            Alert.alert("로그아웃 실패", "로그아웃 중 문제가 발생했습니다. 다시 시도해주세요.");
                        }
                    }
                }
            ]
        );
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'report':
                return (
                    <View style={styles.reportContainer}>
                        {/* Report Placeholder Card */}
                        <View style={styles.reportCard}>
                            <MaterialCommunityIcons name="clipboard-text-outline" size={60} color="#90A4AE" style={{ marginBottom: 20 }} />
                            <Text style={styles.reportTitle}>경제 교육 리포트</Text>
                            <Text style={styles.reportSubtitle}>
                                우리 아이의 경제 습관을 분석한 맞춤형{'\n'}리포트를 확인하세요
                            </Text>

                            {!isPremium && (
                                <TouchableOpacity style={styles.premiumButton} onPress={handleUpgrade}>
                                    <MaterialCommunityIcons name="crown-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                                    <Text style={styles.premiumButtonText}>프리미엄으로 업그레이드</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity style={styles.reportActionButton} onPress={handleOpenPremiumLab}>
                                <Ionicons name="analytics-outline" size={18} color="#1E73E8" style={{ marginRight: 6 }} />
                                <Text style={styles.reportActionText}>고급 리포트/퀘스트/저축 목표 열기</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            case 'theme':
                return (
                    <View style={styles.themeContainer}>
                        {/* Theme Header */}
                        <View style={styles.themeSectionHeader}>
                            <View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={styles.themeSectionTitle}>테마 선택</Text>
                                    <View style={styles.goldBadge}>
                                        <MaterialCommunityIcons name="crown" size={12} color="#FFF" style={{ marginRight: 2 }} />
                                        <Text style={styles.goldBadgeText}>{isPremium ? '프리미엄' : '업그레이드'}</Text>
                                    </View>
                                </View>
                                <Text style={styles.themeSectionSubtitle}>아이와 함께 배울 이야기를 선택하세요</Text>
                            </View>
                        </View>

                        <TouchableOpacity onPress={() => handleThemeSelect('ant_and_grasshopper', false)} activeOpacity={0.9}>
                            <LinearGradient
                                colors={['#FFE0B2', '#FFCC80']}
                                style={[styles.themeCard, selectedThemeId === 'ant_and_grasshopper' && styles.selectedThemeCard]}
                            >
                                <View style={styles.activeThemeBadge}>
                                    <Ionicons
                                        name={selectedThemeId === 'ant_and_grasshopper' ? 'checkmark' : 'ellipse-outline'}
                                        size={16}
                                        color="#FFF"
                                    />
                                </View>
                                <View style={styles.themeEmojis}>
                                    <Text style={styles.themeEmojiText}>🐜 🦗</Text>
                                </View>
                                <Text style={styles.themeTitle}>개미와 베짱이</Text>
                                <Text style={styles.themeDesc}>성실함과 계획의 중요성</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => handleThemeSelect('tortoise_and_hare', true)} activeOpacity={0.9}>
                            <View style={[styles.themeCard, { backgroundColor: '#C8E6C9' }, selectedThemeId === 'tortoise_and_hare' && styles.selectedThemeCard]}>
                                <View style={isPremium ? styles.activeThemeBadge : styles.lockedBadge}>
                                    <Ionicons
                                        name={
                                            isPremium
                                                ? (selectedThemeId === 'tortoise_and_hare' ? 'checkmark' : 'ellipse-outline')
                                                : 'lock-closed'
                                        }
                                        size={16}
                                        color="#FFF"
                                    />
                                </View>
                                <View style={styles.themeEmojis}>
                                    <Text style={styles.themeEmojiText}>🐰 🐢</Text>
                                </View>
                                <Text style={[styles.themeTitle, { color: '#2E7D32' }]}>토끼와 거북이</Text>
                                <Text style={[styles.themeDesc, { color: '#388E3C' }]}>꾸준함이 이기는 법</Text>
                                <View style={styles.premiumLabelRow}>
                                    <MaterialCommunityIcons name="crown-outline" size={14} color="#FF6F00" />
                                    <Text style={styles.premiumLabel}>{isPremium ? '사용 가능' : '프리미엄'}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => handleThemeSelect('dolphin_and_fish', true)} activeOpacity={0.9}>
                            <View style={[styles.themeCard, { backgroundColor: '#E1F5FE' }, selectedThemeId === 'dolphin_and_fish' && styles.selectedThemeCard]}>
                                <View style={isPremium ? styles.activeThemeBadge : styles.lockedBadge}>
                                    <Ionicons
                                        name={
                                            isPremium
                                                ? (selectedThemeId === 'dolphin_and_fish' ? 'checkmark' : 'ellipse-outline')
                                                : 'lock-closed'
                                        }
                                        size={16}
                                        color="#FFF"
                                    />
                                </View>
                                <View style={styles.themeEmojis}>
                                    <Text style={styles.themeEmojiText}>🐬 🐠</Text>
                                </View>
                                <Text style={[styles.themeTitle, { color: '#0277BD' }]}>돌고래와 물고기</Text>
                                <Text style={[styles.themeDesc, { color: '#0288D1' }]}>협동과 나눔의 가치</Text>
                                <View style={styles.premiumLabelRow}>
                                    <MaterialCommunityIcons name="crown-outline" size={14} color="#FF6F00" />
                                    <Text style={styles.premiumLabel}>{isPremium ? '사용 가능' : '프리미엄'}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        {!isPremium && (
                            <View style={styles.promoCard}>
                                <View style={styles.promoHeader}>
                                    <MaterialCommunityIcons name="crown-outline" size={24} color="#D84315" style={{ marginRight: 8 }} />
                                    <Text style={styles.promoTitle}>더 많은 테마를 원하시나요?</Text>
                                </View>
                                <Text style={styles.promoDesc}>
                                    프리미엄 플랜으로 업그레이드하면 토끼와 거북이, 돌고래와 물고기 테마를 사용할 수 있어요!
                                </Text>
                                <TouchableOpacity style={styles.promoButton} onPress={handlePremiumInfo}>
                                    <Text style={styles.promoButtonText}>프리미엄 자세히 보기</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                );
            case 'account':
                return (
                    <View style={styles.accountContainer}>
                        <View style={styles.accountCard}>
                            <View style={styles.accountHeader}>
                                <View style={styles.avatarContainer}>
                                    {profilePhotoUrl ? (
                                        <Image source={{ uri: profilePhotoUrl }} style={styles.avatarImage} />
                                    ) : (
                                        <Text style={styles.avatarText}>👨‍👩‍👧‍👦</Text>
                                    )}
                                </View>
                                <View style={styles.accountInfo}>
                                    <Text style={styles.accountName}>{profileName}</Text>
                                    <Text style={styles.accountEmail}>{profileEmail}</Text>
                                </View>
                                <TouchableOpacity style={styles.editProfileButton} onPress={() => router.push('/profile-edit')}>
                                    <Text style={styles.editProfileText}>편집</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.familyCodeCard}>
                                <View style={styles.familyCodeHeader}>
                                    <Ionicons name="key-outline" size={18} color="#2962FF" style={{ marginRight: 6 }} />
                                    <Text style={styles.familyCodeTitle}>우리 가족 연결 코드</Text>
                                    <TouchableOpacity style={styles.copyCodeButton} onPress={handleCopyFamilyCode} disabled={!familyCode}>
                                        <Ionicons name="copy-outline" size={14} color="#2459AE" style={{ marginRight: 4 }} />
                                        <Text style={styles.copyCodeButtonText}>복사</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.familyCodeValue}>{familyCode || '생성 중...'}</Text>
                                <Text style={styles.familyCodeHint}>아이 모드에서 이 코드를 입력하면 연결됩니다.</Text>
                            </View>

                            <TouchableOpacity style={styles.menuItem}>
                                <Ionicons name="notifications-outline" size={22} color="#555" style={{ marginRight: 12 }} />
                                <Text style={styles.menuText}>알림 설정</Text>
                                <Ionicons name="chevron-forward" size={20} color="#BBB" style={{ marginLeft: 'auto' }} />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.menuItem}>
                                <Ionicons name="shield-checkmark-outline" size={22} color="#555" style={{ marginRight: 12 }} />
                                <Text style={styles.menuText}>계정 보안</Text>
                                <Ionicons name="chevron-forward" size={20} color="#BBB" style={{ marginLeft: 'auto' }} />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.menuItem}>
                                <Ionicons name="help-circle-outline" size={22} color="#555" style={{ marginRight: 12 }} />
                                <Text style={styles.menuText}>고객센터</Text>
                                <Ionicons name="chevron-forward" size={20} color="#BBB" style={{ marginLeft: 'auto' }} />
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleLogout}>
                                <MaterialCommunityIcons name="logout" size={22} color="#D32F2F" style={{ marginRight: 12 }} />
                                <Text style={[styles.menuText, { color: '#D32F2F' }]}>로그아웃</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.footerInfo}>
                            <Text style={styles.versionText}>버전 1.0.0</Text>
                        </View>
                    </View>
                );
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Header Section with Blue Gradient */}
            <LinearGradient
                colors={['#2979FF', '#2962FF']} // Blue gradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.headerGradient}
            >
                <SafeAreaView edges={['top']} style={styles.safeAreaHeader}>


                    <View style={styles.headerContent}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.headerTitle}>부모님 관리 페이지</Text>
                            <Text style={styles.headerSubtitle}>과제와 보상을 관리해주세요</Text>
                        </View>
                        {!isPremium && (
                            <TouchableOpacity style={styles.topUpgradeButton} onPress={handleUpgrade}>
                                <MaterialCommunityIcons name="crown-outline" size={16} color="#FFF" style={{ marginRight: 4 }} />
                                <Text style={styles.upgradeText}>업그레이드</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </SafeAreaView>
            </LinearGradient>

            {/* Main Content Area */}
            <ScrollView style={styles.contentContainer} contentContainerStyle={styles.scrollContent}>

                {/* Child Selection Section */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.familyEmoji}>👨‍👩‍👧‍👦</Text>
                        <Text style={styles.sectionTitle}>아이 선택</Text>
                    </View>

                    <View style={styles.childCardContainer}>
                        {/* Selected Child Card */}
                        <LinearGradient
                            colors={['#FFA000', '#FFB300']} // Orange gradient
                            style={styles.selectedChildCard}
                        >
                            <View style={styles.checkBadge}>
                                <Ionicons name="checkmark-sharp" size={16} color="#FFF" />
                            </View>
                            <Text style={styles.childEmoji}>🐼</Text>
                            <Text style={styles.childName}>민준</Text>
                            <Text style={styles.childGrain}>곡식 0개</Text>
                        </LinearGradient>
                    </View>
                </View>

                {/* Tab Navigation Buttons */}
                <View style={styles.tabsRow}>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'theme' && styles.activeTabTheme]}
                        onPress={() => setActiveTab('theme')}
                    >
                        <Ionicons name="color-palette-outline" size={24} color={activeTab === 'theme' ? '#FFF' : '#555'} />
                        <Text style={[styles.tabText, activeTab === 'theme' && styles.activeTabText]}>테마</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'report' && styles.activeTabReport]}
                        onPress={() => setActiveTab('report')}
                    >
                        <Ionicons name="bar-chart-outline" size={24} color={activeTab === 'report' ? '#FFF' : '#555'} />
                        <Text style={[styles.tabText, activeTab === 'report' && styles.activeTabText]}>리포트</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'account' && styles.activeTabAccount]}
                        onPress={() => setActiveTab('account')}
                    >
                        <Ionicons name="settings-outline" size={24} color={activeTab === 'account' ? '#FFF' : '#555'} />
                        <Text style={[styles.tabText, activeTab === 'account' && styles.activeTabText]}>계정</Text>
                    </TouchableOpacity>
                </View>

                {/* Conditional Content */}
                {renderTabContent()}

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
    },
    safeAreaHeader: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    navBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
        marginTop: 10,
    },
    navBack: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    navBackText: {
        color: '#FFF',
        fontSize: 16,
        marginLeft: 5,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    topUpgradeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.25)',
        paddingHorizontal: 15,
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
    sectionContainer: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    familyEmoji: {
        fontSize: 20,
        marginRight: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    childCardContainer: {
        flexDirection: 'row',
    },
    selectedChildCard: {
        width: 120,
        height: 120,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        shadowColor: '#FFA000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    checkBadge: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#00C853', // Green check
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    childEmoji: {
        fontSize: 40,
        marginBottom: 8,
    },
    childName: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    childGrain: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 12,
    },

    /* Tabs */
    tabsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 25,
        gap: 12,
    },
    tabButton: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#FFF',
        paddingVertical: 14,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        gap: 8,
    },
    activeTabTheme: {
        backgroundColor: '#FF4081', // Pink
    },
    activeTabReport: {
        backgroundColor: '#00BFA5', // Teal/Green
    },
    activeTabAccount: {
        backgroundColor: '#78909C', // Blue Grey
    },
    tabText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
    },
    activeTabText: {
        color: '#FFF',
    },

    /* Report Visuals */
    reportContainer: {
    },
    reportCard: {
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 24,
        padding: 40,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFF',
    },
    reportTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#37474F',
        marginBottom: 10,
    },
    reportSubtitle: {
        fontSize: 15,
        color: '#78909C',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 30,
    },
    premiumButton: {
        backgroundColor: '#FFC107',
        flexDirection: 'row',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#FFC107',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
        width: '100%',
        justifyContent: 'center',
    },
    premiumButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    reportActionButton: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#BFDBFE',
        backgroundColor: '#EFF6FF',
        borderRadius: 12,
        paddingVertical: 11,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        width: '100%',
    },
    reportActionText: {
        color: '#1E73E8',
        fontSize: 14,
        fontWeight: '700',
    },

    /* Account Tab Placeholder */
    /* Account Tab Styles */
    accountContainer: {},
    accountCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    accountHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    avatarContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#E3F2FD',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    avatarText: {
        fontSize: 30,
    },
    avatarImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    accountInfo: {
        flex: 1,
    },
    accountName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    accountEmail: {
        fontSize: 14,
        color: '#757575',
    },
    editProfileButton: {
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    editProfileText: {
        fontSize: 12,
        color: '#555',
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginBottom: 10,
    },
    familyCodeCard: {
        backgroundColor: '#F3F8FF',
        borderWidth: 1,
        borderColor: '#DCEBFF',
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
    },
    familyCodeHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    copyCodeButton: {
        marginLeft: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E5F0FF',
        borderWidth: 1,
        borderColor: '#C3DCFF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    copyCodeButtonText: {
        color: '#2459AE',
        fontSize: 12,
        fontWeight: '700',
    },
    familyCodeTitle: {
        fontSize: 13,
        fontWeight: '700',
        color: '#254C8A',
    },
    familyCodeValue: {
        fontSize: 26,
        fontWeight: '800',
        letterSpacing: 2,
        color: '#1A3A70',
    },
    familyCodeHint: {
        marginTop: 4,
        fontSize: 12,
        color: '#4D6A96',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F9F9F9',
    },
    menuText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    footerInfo: {
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30,
    },
    versionText: {
        fontSize: 12,
        color: '#BDBDBD',
    },

    /* Theme Tab Styles */
    themeContainer: {},
    themeSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 15,
    },
    themeSectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 8,
    },
    goldBadge: {
        backgroundColor: '#FFC107',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
    },
    goldBadgeText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    themeSectionSubtitle: {
        fontSize: 13,
        color: '#777',
        marginTop: 4,
    },
    themeCard: {
        borderRadius: 20,
        padding: 24,
        marginBottom: 16,
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    selectedThemeCard: {
        borderWidth: 2,
        borderColor: '#2979FF',
    },
    themeBadge: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: '#2979FF',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeThemeBadge: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: '#2979FF',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockedBadge: {
        position: 'absolute',
        top: 15,
        right: 15,
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    themeEmojis: {
        marginBottom: 10,
    },
    themeEmojiText: {
        fontSize: 32,
    },
    themeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#5D4037',
        marginBottom: 4,
    },
    themeDesc: {
        fontSize: 14,
        color: '#795548',
        marginBottom: 10,
    },
    premiumLabelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    premiumLabel: {
        color: '#FF6F00',
        fontSize: 12,
        fontWeight: '600',
        marginLeft: 4,
    },
    promoCard: {
        backgroundColor: '#FFFDE7', // Light yellow
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: '#FFE082',
        marginTop: 10,
        marginBottom: 20,
    },
    promoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    promoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#D84315',
    },
    promoDesc: {
        fontSize: 14,
        color: '#3E2723',
        lineHeight: 20,
        marginBottom: 15,
    },
    promoButton: {
        backgroundColor: '#FFC107',
        alignItems: 'center',
        paddingVertical: 12,
        borderRadius: 12,
    },
    promoButtonText: {
        color: '#3E2723',
        fontWeight: 'bold',
        fontSize: 14,
    },
});

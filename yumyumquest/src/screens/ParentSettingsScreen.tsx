import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* 
 * UI Component for the Parent's "Settings" Screen 
 * This screen matches the reference image: Child Selection, Theme Settings, Premium Themes
 */

export default function ParentSettingsScreen() {

    // Mock handlers
    const handleUpgrade = () => Alert.alert("알림", "업그레이드 기능은 준비 중입니다.");
    const handleThemeSetting = () => Alert.alert("테마 설정", "테마 설정 화면으로 이동합니다.");
    const handleReport = () => Alert.alert("경제 리포트", "경제 리포트 화면으로 이동합니다.");
    const handlePremiumInfo = () => Alert.alert("프리미엄", "프리미엄 플랜 안내 화면으로 이동합니다.");

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Header Section with Blue Gradient */}
            <LinearGradient
                colors={['#448AFF', '#2962FF']} // Blue gradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <SafeAreaView edges={['top']} style={styles.safeAreaHeader}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.navBack}>
                        <Ionicons name="arrow-back" size={24} color="#FFF" />
                        <Text style={styles.navBackText}>뒤로가기</Text>
                    </TouchableOpacity>

                    <View style={styles.headerContent}>
                        <View>
                            <Text style={styles.headerTitle}>부모님 관리 페이지</Text>
                            <Text style={styles.headerSubtitle}>과제와 보상을 관리해주세요</Text>
                        </View>
                        <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
                            <MaterialCommunityIcons name="crown-outline" size={16} color="#FFF" style={{ marginRight: 4 }} />
                            <Text style={styles.upgradeText}>업그레이드</Text>
                        </TouchableOpacity>
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
                                <Ionicons name="checkmark-circle" size={24} color="#00C853" />
                            </View>
                            <Text style={styles.childEmoji}>👦</Text>
                            <Text style={styles.childName}>민준</Text>
                            <Text style={styles.childGrain}>곡식 0개</Text>
                        </LinearGradient>
                    </View>
                </View>

                {/* Theme & Report Buttons */}
                <View style={styles.actionButtonsRow}>
                    <TouchableOpacity style={styles.themeSettingButton} onPress={handleThemeSetting}>
                        <Ionicons name="color-palette-outline" size={20} color="#FFF" style={{ marginRight: 8 }} />
                        <Text style={styles.themeButtonText}>테마 설정</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.reportButton} onPress={handleReport}>
                        <Ionicons name="bar-chart-outline" size={20} color="#555" style={{ marginRight: 8 }} />
                        <Text style={styles.reportButtonText}>경제 리포트</Text>
                    </TouchableOpacity>
                </View>

                {/* Theme Selection Title */}
                <View style={styles.themeSectionHeader}>
                    <View>
                        <Text style={styles.themeSectionTitle}>테마 선택</Text>
                        <Text style={styles.themeSectionSubtitle}>아이와 함께 배울 이야기를 선택하세요</Text>
                    </View>
                    <TouchableOpacity style={styles.smallUpgradeButton} onPress={handleUpgrade}>
                        <MaterialCommunityIcons name="crown" size={14} color="#FFF" style={{ marginRight: 4 }} />
                        <Text style={styles.smallUpgradeText}>업그레이드</Text>
                    </TouchableOpacity>
                </View>

                {/* Theme Cards */}
                {/* 1. Ant & Grasshopper (Active) */}
                <LinearGradient
                    colors={['#FFE0B2', '#FFCC80']}
                    style={styles.themeCard}
                >
                    <View style={styles.themeBadge}>
                        <MaterialCommunityIcons name="crown" size={16} color="#FFF" />
                    </View>
                    <View style={styles.themeEmojis}>
                        <Text style={styles.themeEmojiText}>🐜 🦗</Text>
                    </View>
                    <Text style={styles.themeTitle}>개미와 베짱이</Text>
                    <Text style={styles.themeDesc}>성실함과 계획의 중요성</Text>
                </LinearGradient>

                {/* 2. Tortoise & Hare (Locked) */}
                <View style={[styles.themeCard, { backgroundColor: '#C8E6C9' }]}>
                    <View style={styles.lockedBadge}>
                        <Ionicons name="lock-closed" size={16} color="#FFF" />
                    </View>
                    <View style={styles.themeEmojis}>
                        <Text style={styles.themeEmojiText}>🐰 🐢</Text>
                    </View>
                    <Text style={[styles.themeTitle, { color: '#2E7D32' }]}>토끼와 거북이</Text>
                    <Text style={[styles.themeDesc, { color: '#388E3C' }]}>꾸준함이 이기는 법</Text>
                    <View style={styles.premiumLabelRow}>
                        <MaterialCommunityIcons name="crown-outline" size={14} color="#FF6F00" />
                        <Text style={styles.premiumLabel}>프리미엄</Text>
                    </View>
                </View>

                {/* 3. Dolphin & Fish (Locked) */}
                <View style={[styles.themeCard, { backgroundColor: '#E1F5FE' }]}>
                    <View style={styles.lockedBadge}>
                        <Ionicons name="lock-closed" size={16} color="#FFF" />
                    </View>
                    <View style={styles.themeEmojis}>
                        <Text style={styles.themeEmojiText}>🐬 🐠</Text>
                    </View>
                    <Text style={[styles.themeTitle, { color: '#0277BD' }]}>돌고래와 물고기</Text>
                    <Text style={[styles.themeDesc, { color: '#0288D1' }]}>협동과 나눔의 가치</Text>
                    <View style={styles.premiumLabelRow}>
                        <MaterialCommunityIcons name="crown-outline" size={14} color="#FF6F00" />
                        <Text style={styles.premiumLabel}>프리미엄</Text>
                    </View>
                </View>

                {/* Premium Promo Card */}
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
    sectionContainer: {
        backgroundColor: '#FFF',
        borderRadius: 20,
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
        width: 140,
        height: 140,
        borderRadius: 16,
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
        top: -10,
        right: -10,
        backgroundColor: '#FFF',
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    childEmoji: {
        fontSize: 40,
        marginBottom: 10,
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
    actionButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    themeSettingButton: {
        flex: 0.48,
        flexDirection: 'row',
        backgroundColor: '#FF4081', // Pink
        paddingVertical: 15,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#FF4081',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    themeButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    reportButton: {
        flex: 0.48,
        flexDirection: 'row',
        backgroundColor: '#FFF',
        paddingVertical: 15,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEE',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    reportButtonText: {
        color: '#555',
        fontSize: 16,
        fontWeight: 'bold',
    },
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
        marginBottom: 4,
    },
    themeSectionSubtitle: {
        fontSize: 13,
        color: '#777',
    },
    smallUpgradeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFC107', // Amber
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 15,
    },
    smallUpgradeText: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
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

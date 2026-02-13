import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/*
 * Child Settings Screen
 * Features: Profile card, Theme info, App settings (Notifications, Sound, Dark mode), Help & Support, Logout
 */

const ANT_MASCOT = require('../../assets/ant_mascot.png');

export default function ChildSettingsScreen() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState(false);

    const handleLogout = () => {
        // Implement logout logic here
        // For now just navigate to root
        router.replace('/');
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Header Section (Consistent with other child screens) */}
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
                            <Text style={styles.greetingTitle}>안녕, 우리 개미!</Text>
                            <Text style={styles.greetingSubtitle}>오늘도 열심히 일해볼까?</Text>
                        </View>
                        <View style={styles.grainBadge}>
                            <Text style={styles.grainCount}>0</Text>
                            <Text style={styles.grainLabel}>곡식</Text>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                style={styles.contentContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Settings Card */}
                <LinearGradient
                    colors={['#7C4DFF', '#B388FF']} // Purple gradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.profileCard}
                >
                    <View style={styles.profileHeader}>
                        <Ionicons name="settings-outline" size={24} color="#FFF" />
                        <Text style={styles.profileTitle}>설정</Text>
                    </View>
                    <Text style={styles.profileSubtitle}>내 정보와 앱 설정을 관리해요</Text>

                    <View style={styles.userProfileRow}>
                        <Text style={styles.userAvatar}>🐼</Text>
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>민준</Text>
                            <Text style={styles.userTheme}>🐜 개미 테마</Text>
                        </View>
                        <TouchableOpacity style={styles.editButton}>
                            <Text style={styles.editButtonText}>편집</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>

                {/* Theme Info Section */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="color-palette-outline" size={20} color="#7E57C2" style={{ marginRight: 8 }} />
                        <Text style={styles.sectionTitle}>테마</Text>
                    </View>

                    <View style={styles.themeInfoCard}>
                        <Image source={ANT_MASCOT} style={styles.themeIcon} resizeMode="contain" />
                        <View style={styles.themeTextContainer}>
                            <Text style={styles.themeName}>개미 테마</Text>
                            <Text style={styles.themeDescription}>보호자님이 설정한 테마예요</Text>
                        </View>
                        <Ionicons name="checkmark" size={20} color="#FFF" />
                    </View>
                    <Text style={styles.themeNote}>💡 테마는 보호자 모드에서 변경할 수 있어요</Text>
                </View>

                {/* App Settings Section */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="settings-outline" size={20} color="#C2185B" style={{ marginRight: 8 }} />
                        <Text style={styles.sectionTitle}>앱 설정</Text>
                    </View>

                    {/* Notification Setting */}
                    <View style={styles.settingRow}>
                        <View style={styles.settingLabelContainer}>
                            <Ionicons name="notifications-outline" size={22} color="#555" style={{ marginRight: 12 }} />
                            <View>
                                <Text style={styles.settingLabel}>알림</Text>
                                <Text style={styles.settingSubLabel}>과제 완료 알림 받기</Text>
                            </View>
                        </View>
                        <Switch
                            trackColor={{ false: "#E0E0E0", true: "#AB47BC" }}
                            thumbColor={notificationsEnabled ? "#FFF" : "#F5F5F5"}
                            ios_backgroundColor="#E0E0E0"
                            onValueChange={setNotificationsEnabled}
                            value={notificationsEnabled}
                        />
                    </View>

                    {/* Sound Setting */}
                    <View style={styles.settingRow}>
                        <View style={styles.settingLabelContainer}>
                            <Ionicons name="volume-high-outline" size={22} color="#555" style={{ marginRight: 12 }} />
                            <View>
                                <Text style={styles.settingLabel}>효과음</Text>
                                <Text style={styles.settingSubLabel}>완료 시 소리 재생</Text>
                            </View>
                        </View>
                        <Switch
                            trackColor={{ false: "#E0E0E0", true: "#AB47BC" }}
                            thumbColor={soundEnabled ? "#FFF" : "#F5F5F5"}
                            ios_backgroundColor="#E0E0E0"
                            onValueChange={setSoundEnabled}
                            value={soundEnabled}
                        />
                    </View>

                    {/* Dark Mode Setting */}
                    <View style={[styles.settingRow, { borderBottomWidth: 0 }]}>
                        <View style={styles.settingLabelContainer}>
                            <Ionicons name="moon-outline" size={22} color="#555" style={{ marginRight: 12 }} />
                            <View>
                                <Text style={[styles.settingLabel, { color: '#AAA' }]}>다크 모드</Text>
                                <Text style={styles.settingSubLabel}>곧 출시 예정!</Text>
                            </View>
                        </View>
                        <Switch
                            disabled={true}
                            trackColor={{ false: "#E0E0E0", true: "#AB47BC" }}
                            thumbColor={darkModeEnabled ? "#FFF" : "#F5F5F5"}
                            ios_backgroundColor="#E0E0E0"
                            onValueChange={setDarkModeEnabled}
                            value={darkModeEnabled}
                        />
                    </View>
                </View>

                {/* Help & Support Section */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="help-circle-outline" size={20} color="#7B1FA2" style={{ marginRight: 8 }} />
                        <Text style={styles.sectionTitle}>도움말 & 지원</Text>
                    </View>

                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuText}>사용 가이드</Text>
                        <Ionicons name="chevron-forward" size={20} color="#BBB" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuItem}>
                        <Text style={styles.menuText}>자주 묻는 질문</Text>
                        <Ionicons name="chevron-forward" size={20} color="#BBB" />
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]}>
                        <Text style={styles.menuText}>문의하기</Text>
                        <Ionicons name="chevron-forward" size={20} color="#BBB" />
                    </TouchableOpacity>
                </View>

                {/* Privacy Info Box */}
                <View style={styles.privacyBox}>
                    <View style={styles.privacyHeader}>
                        <Ionicons name="shield-checkmark-outline" size={16} color="#1976D2" style={{ marginRight: 6 }} />
                        <Text style={styles.privacyTitle}>개인정보 보호</Text>
                    </View>
                    <Text style={styles.privacyText}>
                        여러분의 정보는 안전하게 보호돼요. 개미의 선물 상자는 아이들의 안전을 최우선으로 생각합니다.
                    </Text>
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <MaterialCommunityIcons name="logout" size={20} color="#FFF" style={{ marginRight: 8 }} />
                    <Text style={styles.logoutButtonText}>로그아웃</Text>
                </TouchableOpacity>

                {/* Footer Info */}
                <View style={styles.footerInfo}>
                    <Text style={styles.versionText}>개미의 선물 상자 v1.0.0</Text>
                    <Text style={styles.copyrightText}>© 2024 All rights reserved</Text>
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
        paddingBottom: 30,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    safeAreaHeader: {
        paddingHorizontal: 20,
    },
    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        marginLeft: 5,
        fontSize: 16,
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
    contentContainer: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    profileCard: {
        borderRadius: 20,
        padding: 24,
        marginBottom: 20,
        shadowColor: '#7C4DFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
        marginTop: -30, // Overlap header
    },
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    profileTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
        marginLeft: 8,
    },
    profileSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 20,
        marginLeft: 32,
    },
    userProfileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 16,
        padding: 12,
    },
    userAvatar: {
        fontSize: 40,
        marginRight: 15,
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    userTheme: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.8)',
    },
    editButton: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    editButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 12,
    },
    sectionCard: {
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
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    themeInfoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFA000', // Orange matching screenshot
        borderRadius: 16,
        padding: 15,
        marginTop: 5,
        marginBottom: 10,
    },
    themeIcon: {
        width: 40,
        height: 40,
        marginRight: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
    },
    themeTextContainer: {
        flex: 1,
    },
    themeName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 2,
    },
    themeDescription: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.9)',
    },
    themeNote: {
        fontSize: 12,
        color: '#9E9E9E',
        textAlign: 'center',
        marginTop: 5,
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    settingLabelContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingLabel: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    settingSubLabel: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    menuItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5', // Grey line
    },
    menuText: {
        fontSize: 15,
        color: '#333',
        fontWeight: 'bold',
    },
    privacyBox: {
        backgroundColor: '#E3F2FD', // Light Blue
        borderRadius: 16,
        padding: 20,
        marginBottom: 25,
        borderWidth: 1,
        borderColor: '#BBDEFB',
    },
    privacyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    privacyTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1565C0',
    },
    privacyText: {
        fontSize: 12,
        color: '#1976D2',
        lineHeight: 18,
    },
    logoutButton: {
        backgroundColor: '#78909C', // Blue Grey
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    logoutButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    footerInfo: {
        alignItems: 'center',
        marginBottom: 30,
    },
    versionText: {
        fontSize: 12,
        color: '#BDBDBD',
        marginBottom: 4,
    },
    copyrightText: {
        fontSize: 12,
        color: '#BDBDBD',
    },
});

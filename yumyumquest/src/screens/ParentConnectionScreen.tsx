import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* 
 * UI Component for the Parent's "Connection" Screen 
 * This screen matches the reference image: Family Connection, Code Generation, Connected Children, Demo Test
 */

export default function ParentConnectionScreen() {
    // Mock state for children, empty as per image
    const connectedChildrenCount = 0;

    // Mock handlers
    const handleUpgrade = () => {
        Alert.alert("알림", "업그레이드 기능은 준비 중입니다.");
    };

    const handleGenerateCode = () => {
        Alert.alert("코드 생성", "새로운 가족 코드가 생성되었습니다: A1B2C3");
    };

    const handleAddChildManually = () => {
        Alert.alert("아이 추가", "아이 직접 추가하기 화면으로 이동합니다.");
    };

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
                    {/* Back Button (Visual only since this is main tab) */}


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

                {/* Family Connection Section Title */}
                <View style={styles.sectionHeader}>
                    <View style={styles.iconTitleRow}>
                        <Ionicons name="people-outline" size={24} color="#2962FF" style={{ marginRight: 8 }} />
                        <Text style={styles.sectionTitle}>가족 연결</Text>
                    </View>
                    <Text style={styles.sectionSubtitle}>아이와 앱을 연결하여 함께 사용하세요</Text>
                </View>

                {/* Family Code Card */}
                <LinearGradient
                    colors={['#448AFF', '#7C4DFF']} // Blue to Purple gradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.codeCard}
                >
                    <View style={styles.codeHeader}>
                        <View>
                            <Text style={styles.codeTitle}>우리 가족 코드</Text>
                            <Text style={styles.codeSubtitle}>아이가 이 코드로 연결할 수 있어요</Text>
                        </View>
                        <Text style={styles.familyEmoji}>👨‍👩‍👧‍👦</Text>
                    </View>

                    <View style={styles.codeActionBox}>
                        <TouchableOpacity style={styles.generateButton} onPress={handleGenerateCode}>
                            <Text style={styles.generateButtonText}>코드 생성하기</Text>
                        </TouchableOpacity>
                        <Text style={styles.generateHint}>처음 사용하시나요? 가족 코드를 만들어보세요</Text>
                    </View>
                </LinearGradient>

                {/* Connected Children Card */}
                <View style={styles.childrenCard}>
                    <View style={styles.childrenHeader}>
                        <View style={styles.iconTitleRow}>
                            <Ionicons name="person-add-outline" size={20} color="#448AFF" style={{ marginRight: 8 }} />
                            <Text style={styles.cardSectionTitle}>연결된 아이들</Text>
                        </View>
                        <View style={styles.countBadge}>
                            <Text style={styles.countText}>{connectedChildrenCount}</Text>
                            <Text style={styles.countLabel}>명</Text>
                        </View>
                    </View>

                    <View style={styles.emptyStateContainer}>
                        <Text style={styles.babyEmoji}>👶</Text>
                        <Text style={styles.emptyStateTitle}>아직 연결된 아이가 없어요</Text>
                        <Text style={styles.emptyStateSubtitle}>아이 모드에서 가족 코드를 입력하면 연결됩니다</Text>
                    </View>
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
    codeCard: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    codeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    codeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 5,
    },
    codeSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.7)',
    },
    familyEmoji: {
        fontSize: 40,
    },
    codeActionBox: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
    },
    generateButton: {
        marginBottom: 8,
    },
    generateButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    generateHint: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
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
        paddingVertical: 6,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    countText: {
        color: '#1565C0',
        fontWeight: 'bold',
        fontSize: 14,
    },
    countLabel: {
        color: '#1565C0',
        fontSize: 10,
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

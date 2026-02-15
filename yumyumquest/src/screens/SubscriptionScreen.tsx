import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { setSubscriptionActive } from '../services/subscriptionPreference';

type PlanType = 'monthly' | 'yearly';

export default function SubscriptionScreen() {
    const [selectedPlan, setSelectedPlan] = useState<PlanType>('yearly');

    const priceText = useMemo(() => {
        return selectedPlan === 'yearly' ? '연 49,000원' : '월 4,900원';
    }, [selectedPlan]);

    const handleSubscribe = async () => {
        await setSubscriptionActive(true);
        Alert.alert('구독 완료', `${priceText} 구독이 활성화되었습니다. 이제 프리미엄 테마를 선택할 수 있어요.`, [
            {
                text: '확인',
                onPress: () => router.back(),
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" />

            <LinearGradient
                colors={['#1E88E5', '#1976D2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.header}
            >
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>프리미엄 구독</Text>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.heroCard}>
                    <View style={styles.heroTitleRow}>
                        <MaterialCommunityIcons name="crown" size={22} color="#FF8F00" />
                        <Text style={styles.heroTitle}>프리미엄으로 업그레이드</Text>
                    </View>
                    <Text style={styles.heroSubtitle}>아이 경제 습관 분석 리포트와 추가 테마를 이용해보세요.</Text>
                </View>

                <TouchableOpacity
                    style={[styles.planCard, selectedPlan === 'yearly' && styles.planCardSelected]}
                    onPress={() => setSelectedPlan('yearly')}
                >
                    <View>
                        <Text style={styles.planName}>연간 플랜</Text>
                        <Text style={styles.planPrice}>49,000원 / 년</Text>
                        <Text style={styles.planHint}>월 환산 4,083원 • 16% 절약</Text>
                    </View>
                    <Ionicons
                        name={selectedPlan === 'yearly' ? 'radio-button-on' : 'radio-button-off'}
                        size={22}
                        color={selectedPlan === 'yearly' ? '#1976D2' : '#9E9E9E'}
                    />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.planCard, selectedPlan === 'monthly' && styles.planCardSelected]}
                    onPress={() => setSelectedPlan('monthly')}
                >
                    <View>
                        <Text style={styles.planName}>월간 플랜</Text>
                        <Text style={styles.planPrice}>4,900원 / 월</Text>
                        <Text style={styles.planHint}>언제든 해지 가능</Text>
                    </View>
                    <Ionicons
                        name={selectedPlan === 'monthly' ? 'radio-button-on' : 'radio-button-off'}
                        size={22}
                        color={selectedPlan === 'monthly' ? '#1976D2' : '#9E9E9E'}
                    />
                </TouchableOpacity>

                <View style={styles.featureCard}>
                    <Text style={styles.featureTitle}>포함 기능</Text>
                    <Text style={styles.featureItem}>• 고급 리포트: 주간/월간 분석, 실패 패턴, 요일별 그래프</Text>
                    <Text style={styles.featureItem}>• 경제 성향 리포트 + PDF 자동 생성</Text>
                    <Text style={styles.featureItem}>• 무제한 퀘스트 + 연령별 템플릿 + 시즌 퀘스트 팩</Text>
                    <Text style={styles.featureItem}>• 저축 목표별 저금통 + 예상 달성일 + 자동 보너스 적립</Text>
                </View>

                <TouchableOpacity style={styles.subscribeButton} onPress={handleSubscribe}>
                    <Text style={styles.subscribeButtonText}>{priceText} 구독 시작하기</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F7FB',
    },
    header: {
        height: 92,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
    },
    backButton: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginRight: 10,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFF',
    },
    content: {
        padding: 16,
        paddingBottom: 36,
        gap: 12,
    },
    heroCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E8EEF7',
    },
    heroTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
    },
    heroTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#212121',
    },
    heroSubtitle: {
        fontSize: 14,
        color: '#616161',
        lineHeight: 20,
    },
    planCard: {
        backgroundColor: '#FFF',
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    planCardSelected: {
        borderColor: '#1976D2',
        backgroundColor: '#F2F8FF',
    },
    planName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1F1F1F',
    },
    planPrice: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0D47A1',
        marginTop: 2,
    },
    planHint: {
        marginTop: 4,
        fontSize: 13,
        color: '#757575',
    },
    featureCard: {
        backgroundColor: '#FFF',
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    featureTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#212121',
        marginBottom: 8,
    },
    featureItem: {
        fontSize: 14,
        color: '#424242',
        marginBottom: 5,
    },
    subscribeButton: {
        backgroundColor: '#1565C0',
        borderRadius: 14,
        height: 54,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 6,
    },
    subscribeButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

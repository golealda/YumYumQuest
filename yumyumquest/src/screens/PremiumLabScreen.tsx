import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useMemo, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    addQuest,
    applyStreakBonus,
    buildAdvancedReport,
    createReportPdfPayload,
    estimateGoalDate,
    getBonusRule,
    getQuestLimit,
    getQuestTemplates,
    getQuests,
    getSavingGoals,
    setBonusRule,
    upsertSavingGoal,
    type BonusRule,
    type QuestItem,
    type SavingGoal,
} from '../services/premiumFeatureService';
import { getSubscriptionActive } from '../services/subscriptionPreference';

export default function PremiumLabScreen() {
    const [isPremium, setIsPremium] = useState(false);
    const [quests, setQuests] = useState<QuestItem[]>([]);
    const [questLimit, setQuestLimit] = useState(3);
    const [goals, setGoals] = useState<SavingGoal[]>([]);
    const [bonusRule, setLocalBonusRule] = useState<BonusRule>({ enabled: true, streakDays: 7, bonusCoins: 20 });

    const report = useMemo(() => buildAdvancedReport(), []);

    const loadAll = useCallback(async () => {
        const [premium, savedQuests, limit, savedGoals, rule] = await Promise.all([
            getSubscriptionActive(),
            getQuests(),
            getQuestLimit(),
            getSavingGoals(),
            getBonusRule(),
        ]);

        setIsPremium(premium);
        setQuests(savedQuests);
        setQuestLimit(limit);
        setGoals(savedGoals);
        setLocalBonusRule(rule);
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadAll();
        }, [loadAll])
    );

    const handleGeneratePdf = () => {
        const payload = createReportPdfPayload(report);
        Alert.alert('PDF 생성', `데모 리포트가 생성되었습니다.\n\n${payload}`);
    };

    const handleAddBasicQuest = async () => {
        const result = await addQuest({
            title: `기본 퀘스트 ${quests.length + 1}`,
            rewardCoins: 10,
            difficulty: 'basic',
        });

        if (!result.ok) {
            Alert.alert('등록 제한', result.reason ?? '등록할 수 없습니다.');
            return;
        }

        await loadAll();
        Alert.alert('등록 완료', '기본 퀘스트가 추가되었습니다.');
    };

    const handleAddTemplateQuest = async () => {
        const templates = await getQuestTemplates(9);
        const template = templates[0];

        const result = await addQuest({
            title: template.title,
            rewardCoins: template.rewardCoins,
            difficulty: 'template',
        });

        if (!result.ok) {
            Alert.alert('등록 제한', result.reason ?? '등록할 수 없습니다.');
            return;
        }

        await loadAll();
        Alert.alert('등록 완료', `템플릿 퀘스트 '${template.title}'가 추가되었습니다.`);
    };

    const handleAddGoal = async () => {
        if (!isPremium) {
            Alert.alert('프리미엄 전용', '저축 목표 시스템은 프리미엄에서 사용할 수 있어요.');
            return;
        }

        await upsertSavingGoal({
            title: `새 목표 ${goals.length + 1}`,
            targetCoins: 300,
            currentCoins: 90,
            dailySavingCoins: 15,
        });
        await loadAll();
        Alert.alert('목표 추가', '저축 목표가 생성되었습니다.');
    };

    const handleApplyBonus = async () => {
        if (!goals.length) {
            Alert.alert('안내', '먼저 저축 목표를 만들어 주세요.');
            return;
        }

        const firstGoal = goals[0];
        const boostedCoins = await applyStreakBonus(firstGoal.currentCoins, 7);
        await upsertSavingGoal({ ...firstGoal, currentCoins: boostedCoins, id: firstGoal.id });
        await loadAll();
        Alert.alert('자동 적립', `연속 성공 보너스로 ${bonusRule.bonusCoins}코인이 적용되었습니다.`);
    };

    const toggleBonusRule = async () => {
        const next = { ...bonusRule, enabled: !bonusRule.enabled };
        await setBonusRule(next);
        setLocalBonusRule(next);
    };

    const limitText = questLimit >= Number.MAX_SAFE_INTEGER ? '무제한' : `${questLimit}개`;

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <LinearGradient colors={['#2962FF', '#1E88E5']} style={styles.header}>
                <SafeAreaView edges={['top']}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Ionicons name="chevron-back" size={22} color="#FFF" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>프리미엄 확장 기능</Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>1. 고급 리포트</Text>
                    <View style={styles.metricRow}>
                        <Text style={styles.metricLabel}>주간/월간 성실도</Text>
                        <Text style={styles.metricValue}>{report.weeklyScore} / {report.monthlyScore}점</Text>
                    </View>
                    <View style={styles.metricRow}>
                        <Text style={styles.metricLabel}>가장 성공한 습관</Text>
                        <Text style={styles.metricValue}>{report.topSuccessHabit}</Text>
                    </View>
                    <View style={styles.metricRow}>
                        <Text style={styles.metricLabel}>실패 패턴</Text>
                        <Text style={styles.metricValue}>{report.failurePattern}</Text>
                    </View>

                    <Text style={styles.subTitle}>요일별 수행률</Text>
                    {report.weekdayRates.map((day) => (
                        <View key={day.label} style={styles.graphRow}>
                            <Text style={styles.graphLabel}>{day.label}</Text>
                            <View style={styles.graphTrack}>
                                <View style={[styles.graphBar, { width: `${Math.max(day.rate, 4)}%` }]} />
                            </View>
                            <Text style={styles.graphRate}>{day.rate}%</Text>
                        </View>
                    ))}

                    <Text style={styles.subTitle}>경제 성향 분석</Text>
                    <Text style={styles.infoText}>• 성향: {report.spendingTendency}</Text>
                    <Text style={styles.infoText}>• 목표 달성 속도: {report.goalPace}</Text>
                    <Text style={styles.infoText}>• 보상 선호: {report.rewardPreference}</Text>

                    <TouchableOpacity style={styles.actionButton} onPress={handleGeneratePdf}>
                        <MaterialCommunityIcons name="file-pdf-box" size={18} color="#FFF" />
                        <Text style={styles.actionButtonText}>PDF 자동 생성</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>2. 무제한 퀘스트 / 템플릿</Text>
                    <Text style={styles.infoText}>현재 플랜: {isPremium ? 'Premium' : '무료'}</Text>
                    <Text style={styles.infoText}>퀘스트 제한: {limitText}</Text>
                    <Text style={styles.infoText}>등록된 퀘스트: {quests.length}개</Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={[styles.actionButton, styles.halfButton]} onPress={handleAddBasicQuest}>
                            <Text style={styles.actionButtonText}>기본 퀘스트 추가</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, styles.halfButton]} onPress={handleAddTemplateQuest}>
                            <Text style={styles.actionButtonText}>추천 템플릿 추가</Text>
                        </TouchableOpacity>
                    </View>

                    {quests.slice(-3).map((quest) => (
                        <View key={quest.id} style={styles.questRow}>
                            <Text style={styles.questTitle}>{quest.title}</Text>
                            <Text style={styles.questMeta}>{quest.rewardCoins}코인 · {quest.difficulty}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>3. 저축 목표 시스템</Text>
                    <Text style={styles.infoText}>목표별 저금통, 예상일 계산, 자동 적립 보너스</Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity style={[styles.actionButton, styles.halfButton]} onPress={handleAddGoal}>
                            <Text style={styles.actionButtonText}>목표 추가</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionButton, styles.halfButton]} onPress={handleApplyBonus}>
                            <Text style={styles.actionButtonText}>7일 보너스 적용</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.ruleButton} onPress={toggleBonusRule}>
                        <Text style={styles.ruleText}>자동 적립 보너스: {bonusRule.enabled ? 'ON' : 'OFF'}</Text>
                    </TouchableOpacity>

                    {goals.length === 0 ? (
                        <Text style={styles.emptyText}>생성된 저축 목표가 없습니다.</Text>
                    ) : (
                        goals.map((goal) => {
                            const progress = Math.round((goal.currentCoins / Math.max(goal.targetCoins, 1)) * 100);
                            return (
                                <View key={goal.id} style={styles.goalCard}>
                                    <Text style={styles.goalTitle}>{goal.title}</Text>
                                    <Text style={styles.goalMeta}>{goal.currentCoins}/{goal.targetCoins}코인 · 진행률 {progress}%</Text>
                                    <Text style={styles.goalMeta}>예상 달성일: {estimateGoalDate(goal)}</Text>
                                </View>
                            );
                        })
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F6F8FC' },
    header: { paddingHorizontal: 16, paddingBottom: 14 },
    headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
    backButton: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        marginRight: 10,
    },
    headerTitle: { color: '#FFF', fontSize: 20, fontWeight: '700' },
    content: { padding: 16, gap: 12, paddingBottom: 24 },
    sectionCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5EBF5',
        padding: 14,
    },
    sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1D2A3A', marginBottom: 8 },
    subTitle: { fontSize: 14, fontWeight: '700', color: '#2F3B4A', marginTop: 8, marginBottom: 4 },
    metricRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    metricLabel: { color: '#4D5C70', fontSize: 13 },
    metricValue: { color: '#162234', fontSize: 13, fontWeight: '700' },
    infoText: { color: '#4B5B6E', fontSize: 13, marginBottom: 4 },
    graphRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    graphLabel: { width: 20, fontSize: 12, color: '#59697E' },
    graphTrack: { flex: 1, height: 8, borderRadius: 999, backgroundColor: '#E9EFF8', marginHorizontal: 8 },
    graphBar: { height: 8, borderRadius: 999, backgroundColor: '#2D7EFF' },
    graphRate: { width: 40, fontSize: 12, color: '#30445D', textAlign: 'right' },
    actionButton: {
        marginTop: 8,
        backgroundColor: '#1E73E8',
        borderRadius: 12,
        height: 42,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 6,
    },
    actionButtonText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
    buttonRow: { flexDirection: 'row', gap: 8 },
    halfButton: { flex: 1 },
    questRow: {
        marginTop: 8,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#F5F8FD',
        borderWidth: 1,
        borderColor: '#E2EAF8',
    },
    questTitle: { fontSize: 13, fontWeight: '600', color: '#1D2A3A' },
    questMeta: { fontSize: 12, color: '#62758E', marginTop: 2 },
    ruleButton: {
        marginTop: 8,
        paddingVertical: 10,
        borderRadius: 10,
        alignItems: 'center',
        backgroundColor: '#EEF4FF',
        borderWidth: 1,
        borderColor: '#CEDCF9',
    },
    ruleText: { fontSize: 13, fontWeight: '700', color: '#2E5AAC' },
    emptyText: { fontSize: 13, color: '#73849A', marginTop: 10 },
    goalCard: {
        marginTop: 8,
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#F7FBF6',
        borderWidth: 1,
        borderColor: '#D9EEDA',
    },
    goalTitle: { fontSize: 13, fontWeight: '700', color: '#1F3D21' },
    goalMeta: { fontSize: 12, color: '#4E6A53', marginTop: 2 },
});

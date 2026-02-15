import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    approveChildLinkRequest,
    ChildLinkRequest,
    getPendingChildLinkRequestsForCurrentParent,
    ParentApprovalPayload,
    rejectChildLinkRequest,
} from '../services/childConnectionService';
import { getSubscriptionActive } from '../services/subscriptionPreference';

const DEFAULT_FORM = {
    confirmedNickname: '',
    confirmedAge: '5',
    serviceTermsAgreed: false,
    privacyAgreed: false,
    pushAgreed: false,
    rewardEnabled: true,
    baseCoinReward: '10',
    approvalMode: 'manual' as 'manual' | 'auto',
    recoveryEmail: '',
    usageStartTime: '07:00',
    usageEndTime: '20:00',
    dailyMaxCompletion: '10',
};

export default function ParentApprovalScreen() {
    const [isPremium, setIsPremium] = useState(false);
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState<ChildLinkRequest[]>([]);
    const [selectedRequest, setSelectedRequest] = useState<ChildLinkRequest | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState(DEFAULT_FORM);

    const hasPending = useMemo(() => requests.length > 0, [requests]);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [premium, pendingRequests] = await Promise.all([
                getSubscriptionActive(),
                getPendingChildLinkRequestsForCurrentParent(),
            ]);
            setIsPremium(premium);
            setRequests(pendingRequests);
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const startApprove = (request: ChildLinkRequest) => {
        setSelectedRequest(request);
        setForm({
            ...DEFAULT_FORM,
            confirmedNickname: request.childNickname,
            confirmedAge: String(request.childAge ?? 5),
        });
    };

    const handleReject = (request: ChildLinkRequest) => {
        Alert.alert('요청 거절', `${request.childNickname} 연결 요청을 거절할까요?`, [
            { text: '취소', style: 'cancel' },
            {
                text: '거절',
                style: 'destructive',
                onPress: async () => {
                    await rejectChildLinkRequest(request.id, '보호자가 요청을 거절했어요.');
                    await loadData();
                },
            },
        ]);
    };

    const submitApprove = async () => {
        if (!selectedRequest) return;

        if (!form.serviceTermsAgreed || !form.privacyAgreed) {
            Alert.alert('필수 동의', '서비스 이용 및 개인정보 동의는 필수입니다.');
            return;
        }

        const ageNum = Number(form.confirmedAge);
        const baseCoinRewardNum = Number(form.baseCoinReward);
        const dailyMaxNum = Number(form.dailyMaxCompletion);

        if (!form.confirmedNickname.trim() || Number.isNaN(ageNum) || Number.isNaN(baseCoinRewardNum) || Number.isNaN(dailyMaxNum)) {
            Alert.alert('입력 확인', '필수 항목을 올바르게 입력해주세요.');
            return;
        }

        const payload: ParentApprovalPayload = {
            confirmedNickname: form.confirmedNickname.trim(),
            confirmedAge: ageNum,
            serviceTermsAgreed: form.serviceTermsAgreed,
            privacyAgreed: form.privacyAgreed,
            pushAgreed: form.pushAgreed,
            rewardEnabled: form.rewardEnabled,
            baseCoinReward: baseCoinRewardNum,
            approvalMode: form.approvalMode,
            recoveryEmail: form.recoveryEmail.trim(),
            usageStartTime: form.usageStartTime.trim(),
            usageEndTime: form.usageEndTime.trim(),
            dailyMaxCompletion: dailyMaxNum,
        };

        setSubmitting(true);
        try {
            await approveChildLinkRequest(selectedRequest.id, payload);
            Alert.alert('승인 완료', '아이 연결이 승인되었습니다.');
            setSelectedRequest(null);
            await loadData();
        } catch (error) {
            Alert.alert('승인 실패', '승인 처리 중 문제가 발생했습니다.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            <LinearGradient colors={['#448AFF', '#2962FF']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.headerGradient}>
                <SafeAreaView edges={['top']} style={styles.safeAreaHeader}>
                    <View style={styles.headerContent}>
                        <View>
                            <Text style={styles.headerTitle}>부모님 관리 페이지</Text>
                            <Text style={styles.headerSubtitle}>아이 연결 요청 승인/거절</Text>
                        </View>
                        {!isPremium && (
                            <View style={styles.upgradeButton}>
                                <MaterialCommunityIcons name="crown-outline" size={16} color="#FFF" style={{ marginRight: 4 }} />
                                <Text style={styles.upgradeText}>업그레이드</Text>
                            </View>
                        )}
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView style={styles.contentContainer} contentContainerStyle={styles.scrollContent}>
                {loading ? (
                    <ActivityIndicator size="large" color="#2962FF" />
                ) : (
                    <>
                        {selectedRequest && (
                            <View style={styles.formCard}>
                                <Text style={styles.formTitle}>승인 정보 입력</Text>
                                <Text style={styles.formSubTitle}>{selectedRequest.childNickname} 요청 승인 전 정보 확정</Text>

                                <Text style={styles.label}>아이 닉네임</Text>
                                <TextInput style={styles.input} value={form.confirmedNickname} onChangeText={(v) => setForm((p) => ({ ...p, confirmedNickname: v }))} />

                                <Text style={styles.label}>아이 나이(3~6)</Text>
                                <TextInput style={styles.input} keyboardType="number-pad" value={form.confirmedAge} onChangeText={(v) => setForm((p) => ({ ...p, confirmedAge: v }))} />

                                <Text style={styles.label}>복구 이메일(권장)</Text>
                                <TextInput
                                    style={styles.input}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={form.recoveryEmail}
                                    onChangeText={(v) => setForm((p) => ({ ...p, recoveryEmail: v }))}
                                />

                                <View style={styles.toggleRow}>
                                    <Text style={styles.toggleText}>서비스 이용 동의(필수)</Text>
                                    <Switch value={form.serviceTermsAgreed} onValueChange={(v) => setForm((p) => ({ ...p, serviceTermsAgreed: v }))} />
                                </View>
                                <View style={styles.toggleRow}>
                                    <Text style={styles.toggleText}>개인정보 동의(필수)</Text>
                                    <Switch value={form.privacyAgreed} onValueChange={(v) => setForm((p) => ({ ...p, privacyAgreed: v }))} />
                                </View>
                                <View style={styles.toggleRow}>
                                    <Text style={styles.toggleText}>푸시 알림 동의(선택)</Text>
                                    <Switch value={form.pushAgreed} onValueChange={(v) => setForm((p) => ({ ...p, pushAgreed: v }))} />
                                </View>

                                <View style={styles.toggleRow}>
                                    <Text style={styles.toggleText}>보상(기프티콘/코인) 사용</Text>
                                    <Switch value={form.rewardEnabled} onValueChange={(v) => setForm((p) => ({ ...p, rewardEnabled: v }))} />
                                </View>

                                <Text style={styles.label}>기본 보상 코인</Text>
                                <TextInput style={styles.input} keyboardType="number-pad" value={form.baseCoinReward} onChangeText={(v) => setForm((p) => ({ ...p, baseCoinReward: v }))} />

                                <Text style={styles.label}>승인 방식</Text>
                                <View style={styles.modeRow}>
                                    <TouchableOpacity
                                        style={[styles.modeChip, form.approvalMode === 'manual' && styles.modeChipActive]}
                                        onPress={() => setForm((p) => ({ ...p, approvalMode: 'manual' }))}
                                    >
                                        <Text style={[styles.modeChipText, form.approvalMode === 'manual' && styles.modeChipTextActive]}>수동</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.modeChip, form.approvalMode === 'auto' && styles.modeChipActive]}
                                        onPress={() => setForm((p) => ({ ...p, approvalMode: 'auto' }))}
                                    >
                                        <Text style={[styles.modeChipText, form.approvalMode === 'auto' && styles.modeChipTextActive]}>자동</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.timeRow}>
                                    <View style={styles.timeCol}>
                                        <Text style={styles.label}>사용 시작</Text>
                                        <TextInput style={styles.input} value={form.usageStartTime} onChangeText={(v) => setForm((p) => ({ ...p, usageStartTime: v }))} />
                                    </View>
                                    <View style={styles.timeCol}>
                                        <Text style={styles.label}>사용 종료</Text>
                                        <TextInput style={styles.input} value={form.usageEndTime} onChangeText={(v) => setForm((p) => ({ ...p, usageEndTime: v }))} />
                                    </View>
                                </View>

                                <Text style={styles.label}>하루 최대 완료 횟수</Text>
                                <TextInput style={styles.input} keyboardType="number-pad" value={form.dailyMaxCompletion} onChangeText={(v) => setForm((p) => ({ ...p, dailyMaxCompletion: v }))} />

                                <View style={styles.actionRow}>
                                    <TouchableOpacity style={styles.cancelButton} onPress={() => setSelectedRequest(null)}>
                                        <Text style={styles.cancelButtonText}>취소</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.approveButton} onPress={submitApprove} disabled={submitting}>
                                        {submitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.approveButtonText}>승인 완료</Text>}
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {!hasPending ? (
                            <View style={styles.emptyCard}>
                                <Text style={styles.babyEmoji}>✅</Text>
                                <Text style={styles.emptyStateTitle}>대기 중인 요청이 없어요</Text>
                                <Text style={styles.emptyStateSubtitle}>아이가 코드를 입력하면 여기에 승인 요청이 나타나요</Text>
                            </View>
                        ) : (
                            requests.map((request) => (
                                <View key={request.id} style={styles.requestCard}>
                                    <View style={styles.requestTopRow}>
                                        <Text style={styles.requestAvatar}>{request.childAvatar}</Text>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.requestName}>{request.childNickname}</Text>
                                            <Text style={styles.requestMeta}>나이: {request.childAge ?? '미입력'} · 코드: {request.familyCode}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.requestActionRow}>
                                        <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(request)}>
                                            <Text style={styles.rejectButtonText}>거절</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.requestApproveButton} onPress={() => startApprove(request)}>
                                            <Text style={styles.requestApproveButtonText}>승인</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))
                        )}
                    </>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF8E1' },
    headerGradient: { paddingBottom: 20 },
    safeAreaHeader: { paddingHorizontal: 20, paddingBottom: 10 },
    headerContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFF', marginBottom: 5 },
    headerSubtitle: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
    upgradeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    upgradeText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
    contentContainer: { flex: 1 },
    scrollContent: { padding: 20 },
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
    babyEmoji: { fontSize: 64, marginBottom: 20 },
    emptyStateTitle: { fontSize: 18, fontWeight: 'bold', color: '#37474F', marginBottom: 10 },
    emptyStateSubtitle: { fontSize: 15, color: '#78909C', textAlign: 'center' },

    requestCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#E8EEF7',
    },
    requestTopRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    requestAvatar: { fontSize: 28, marginRight: 10 },
    requestName: { fontSize: 16, fontWeight: '700', color: '#203047' },
    requestMeta: { fontSize: 13, color: '#697B92', marginTop: 2 },
    requestActionRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
    rejectButton: {
        backgroundColor: '#FFF1F1',
        borderColor: '#F8C8C8',
        borderWidth: 1,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 14,
    },
    rejectButtonText: { color: '#C62828', fontWeight: '700' },
    requestApproveButton: {
        backgroundColor: '#2962FF',
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 14,
    },
    requestApproveButtonText: { color: '#FFF', fontWeight: '700' },

    formCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 14,
        borderWidth: 1,
        borderColor: '#DCE7FF',
        marginBottom: 12,
    },
    formTitle: { fontSize: 18, fontWeight: '800', color: '#203047' },
    formSubTitle: { fontSize: 13, color: '#6A7B90', marginTop: 4, marginBottom: 10 },
    label: { fontSize: 13, fontWeight: '700', color: '#314760', marginBottom: 6, marginTop: 8 },
    input: {
        borderWidth: 1,
        borderColor: '#D7DEE7',
        borderRadius: 10,
        backgroundColor: '#FFF',
        paddingHorizontal: 10,
        paddingVertical: 10,
        fontSize: 14,
        color: '#0F172A',
    },
    toggleRow: {
        marginTop: 8,
        paddingVertical: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    toggleText: { color: '#334155', fontSize: 13, fontWeight: '600' },
    modeRow: { flexDirection: 'row', gap: 8 },
    modeChip: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: 'center',
    },
    modeChipActive: { borderColor: '#2962FF', backgroundColor: '#EAF1FF' },
    modeChipText: { color: '#64748B', fontWeight: '600' },
    modeChipTextActive: { color: '#1E40AF', fontWeight: '700' },
    timeRow: { flexDirection: 'row', gap: 8 },
    timeCol: { flex: 1 },
    actionRow: { flexDirection: 'row', gap: 8, marginTop: 14 },
    cancelButton: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    cancelButtonText: { color: '#475569', fontWeight: '700' },
    approveButton: {
        flex: 1,
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: 'center',
        backgroundColor: '#2962FF',
    },
    approveButtonText: { color: '#FFF', fontWeight: '700' },
});

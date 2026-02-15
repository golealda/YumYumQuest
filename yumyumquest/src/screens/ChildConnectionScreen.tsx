import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';
import {
    clearActiveChildLinkRequestId,
    createChildLinkRequest,
    getActiveChildLinkRequestId,
    getChildLinkRequestById,
} from '../services/childConnectionService';
import {
    getChildAutoLoginEnabled,
    getChildSessionId,
    isChildSessionValid,
    setChildAutoLoginEnabled,
    setChildSessionId,
} from '../services/childSessionService';

const AVATARS = ['👦', '👧', '👱‍♀️', '👶', '🐻', '🐰', '🐼', '🦊'];
const AGE_OPTIONS = [3, 4, 5, 6];

export default function ChildConnectionScreen() {
    const [name, setName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
    const [familyCode, setFamilyCode] = useState('');
    const [selectedAge, setSelectedAge] = useState<number | null>(null);

    const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(false);

    useEffect(() => {
        const restoreState = async () => {
            const [requestId, autoEnabled, childSessionId] = await Promise.all([
                getActiveChildLinkRequestId(),
                getChildAutoLoginEnabled(),
                getChildSessionId(),
            ]);

            if (autoEnabled && childSessionId) {
                const valid = await isChildSessionValid(childSessionId);
                if (valid) {
                    router.replace('/(child)');
                    return;
                }
            }

            setActiveRequestId(requestId);
        };
        restoreState();
    }, []);

    const handleConnect = async () => {
        if (!name.trim()) {
            Alert.alert('입력 필요', '아이 닉네임을 입력해주세요.');
            return;
        }

        if (!familyCode.trim()) {
            Alert.alert('입력 필요', '가족 코드를 입력해주세요.');
            return;
        }

        setSubmitting(true);
        try {
            const req = await createChildLinkRequest({
                familyCode,
                childNickname: name,
                childAvatar: selectedAvatar,
                childAge: selectedAge ?? undefined,
            });

            setActiveRequestId(req.id);
            Alert.alert('요청 완료', '부모님의 승인을 기다리는 중이에요. 승인 후 앱을 사용할 수 있어요.');
        } catch (error: any) {
            if (error?.message === 'invalid-family-code') {
                Alert.alert('연결 실패', '가족 코드를 확인해주세요.');
            } else {
                Alert.alert('연결 실패', '요청 생성 중 문제가 발생했습니다.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleCheckApproval = async () => {
        if (!activeRequestId) return;

        setCheckingStatus(true);
        try {
            const request = await getChildLinkRequestById(activeRequestId);
            if (!request) {
                Alert.alert('안내', '요청 정보를 찾을 수 없어요. 다시 요청해주세요.');
                await clearActiveChildLinkRequestId();
                setActiveRequestId(null);
                return;
            }

            if (request.status === 'approved') {
                if (request.childId) {
                    await setChildSessionId(request.childId);
                    await setChildAutoLoginEnabled(true);
                }
                await clearActiveChildLinkRequestId();
                setActiveRequestId(null);
                Alert.alert('승인 완료', '보호자 승인이 완료되어 앱을 사용할 수 있어요.', [
                    { text: '확인', onPress: () => router.replace('/(child)') },
                ]);
                return;
            }

            if (request.status === 'rejected') {
                await clearActiveChildLinkRequestId();
                setActiveRequestId(null);
                Alert.alert('거절됨', request.rejectionReason ?? '보호자가 요청을 거절했어요. 코드를 다시 확인해 주세요.');
                return;
            }

            Alert.alert('대기 중', '아직 부모님의 승인을 기다리고 있어요.');
        } catch (error) {
            Alert.alert('오류', '승인 상태를 확인하지 못했어요.');
        } finally {
            setCheckingStatus(false);
        }
    };

    const handleResetRequest = async () => {
        await clearActiveChildLinkRequestId();
        setActiveRequestId(null);
        Alert.alert('초기화됨', '다시 연결 요청을 보낼 수 있어요.');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#5D4037" />
                    <Text style={styles.backButtonText}>뒤로가기</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {!activeRequestId ? (
                            <View style={styles.card}>
                                <View style={styles.iconContainer}>
                                    <MaterialCommunityIcons name="link-variant" size={60} color="#5D4037" />
                                </View>

                                <Text style={styles.title}>부모님과 연결하기</Text>
                                <Text style={styles.subtitle}>닉네임, 아바타, 가족 코드만 입력하면 돼요</Text>

                                <Text style={styles.label}>내 닉네임</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="예: 토토"
                                        placeholderTextColor="#CCC"
                                        value={name}
                                        onChangeText={setName}
                                    />
                                </View>

                                <Text style={styles.label}>내 아바타</Text>
                                <View style={styles.avatarGrid}>
                                    {AVATARS.map((avatar, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            style={[styles.avatarItem, selectedAvatar === avatar && styles.selectedAvatarItem]}
                                            onPress={() => setSelectedAvatar(avatar)}
                                        >
                                            <Text style={styles.avatarText}>{avatar}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <Text style={styles.label}>나이 (선택)</Text>
                                <View style={styles.ageRow}>
                                    {AGE_OPTIONS.map((age) => (
                                        <TouchableOpacity
                                            key={age}
                                            style={[styles.ageChip, selectedAge === age && styles.selectedAgeChip]}
                                            onPress={() => setSelectedAge(age)}
                                        >
                                            <Text style={[styles.ageChipText, selectedAge === age && styles.selectedAgeChipText]}>{age}세</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <Text style={styles.label}>가족 코드</Text>
                                <View style={styles.inputContainer}>
                                    <Ionicons name="key-outline" size={20} color="#AAA" style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="A1B2C3"
                                        placeholderTextColor="#CCC"
                                        value={familyCode}
                                        onChangeText={(text) => setFamilyCode(text.toUpperCase())}
                                        autoCapitalize="characters"
                                        maxLength={6}
                                    />
                                </View>

                                <TouchableOpacity style={[styles.connectButton, submitting && styles.connectButtonDisabled]} onPress={handleConnect} disabled={submitting}>
                                    {submitting ? <ActivityIndicator color="#FFF" /> : <Text style={styles.connectButtonText}>승인 요청 보내기</Text>}
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={styles.pendingCard}>
                                <MaterialCommunityIcons name="clock-outline" size={58} color="#FF9800" />
                                <Text style={styles.pendingTitle}>승인 대기 중</Text>
                                <Text style={styles.pendingSubText}>부모님의 승인 또는 거절을 기다리고 있어요.</Text>
                                <Text style={styles.pendingCode}>요청 ID: {activeRequestId}</Text>

                                <TouchableOpacity style={styles.connectButton} onPress={handleCheckApproval} disabled={checkingStatus}>
                                    {checkingStatus ? <ActivityIndicator color="#FFF" /> : <Text style={styles.connectButtonText}>승인 상태 확인</Text>}
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.resetButton} onPress={handleResetRequest}>
                                    <Text style={styles.resetButtonText}>요청 취소하고 다시 입력</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8E1',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    backButtonText: {
        fontSize: 16,
        color: '#5D4037',
        marginLeft: 5,
        fontWeight: '500',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 30,
        width: '100%',
        maxWidth: 420,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    pendingCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 30,
        width: '100%',
        maxWidth: 420,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    iconContainer: {
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#37474F',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: '#78909C',
        marginBottom: 20,
        textAlign: 'center',
    },
    pendingTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#37474F',
        marginTop: 12,
        marginBottom: 8,
    },
    pendingSubText: {
        fontSize: 15,
        color: '#78909C',
        textAlign: 'center',
        marginBottom: 10,
    },
    pendingCode: {
        fontSize: 12,
        color: '#90A4AE',
        marginBottom: 16,
    },
    label: {
        width: '100%',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#455A64',
        marginBottom: 8,
        marginTop: 8,
    },
    inputContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 52,
        backgroundColor: '#FAFAFA',
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        height: '100%',
    },
    avatarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 6,
    },
    avatarItem: {
        width: '23%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        marginBottom: 10,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    selectedAvatarItem: {
        borderColor: '#FFA000',
        backgroundColor: '#FFF8E1',
    },
    avatarText: {
        fontSize: 28,
    },
    ageRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    ageChip: {
        flex: 1,
        marginHorizontal: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#D7DEE7',
        paddingVertical: 10,
        alignItems: 'center',
        backgroundColor: '#FFF',
    },
    selectedAgeChip: {
        backgroundColor: '#E8F1FF',
        borderColor: '#2979FF',
    },
    ageChipText: {
        color: '#5B6B80',
        fontWeight: '600',
    },
    selectedAgeChipText: {
        color: '#1F4EA3',
    },
    connectButton: {
        width: '100%',
        backgroundColor: '#FFA000',
        borderRadius: 14,
        height: 54,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 24,
        shadowColor: '#FFA000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    connectButtonDisabled: {
        opacity: 0.8,
    },
    connectButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    resetButton: {
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 14,
    },
    resetButtonText: {
        color: '#5C6E84',
        fontSize: 13,
        textDecorationLine: 'underline',
    },
});

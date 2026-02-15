import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth, db } from '../../firebase';

const AVATAR_OPTIONS = ['🐼', '🐯', '🐰', '🦊', '🐥', '🐨', '🐶', '🐱'];

export default function ParentChildEditScreen() {
    const { childId } = useLocalSearchParams<{ childId?: string }>();
    const normalizedChildId = useMemo(
        () => (Array.isArray(childId) ? childId[0] : childId) ?? '',
        [childId]
    );

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [nickname, setNickname] = useState('');
    const [avatar, setAvatar] = useState('🐼');
    const [age, setAge] = useState('5');

    useEffect(() => {
        const loadChildProfile = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    Alert.alert('안내', '로그인 정보가 없습니다. 다시 로그인해주세요.');
                    router.replace('/login');
                    return;
                }

                if (!normalizedChildId) {
                    Alert.alert('오류', '아이 정보를 찾을 수 없습니다.');
                    router.back();
                    return;
                }

                const [parentSnap, childSnap] = await Promise.all([
                    getDoc(doc(db, 'parents', user.uid)),
                    getDoc(doc(db, 'children', normalizedChildId)),
                ]);

                if (!parentSnap.exists() || !childSnap.exists()) {
                    Alert.alert('오류', '아이 정보를 불러오지 못했습니다.');
                    router.back();
                    return;
                }

                const parentFamilyCode = (parentSnap.data().groupId as string | null) ?? '';
                const childData = childSnap.data();
                const childFamilyCode = (childData.familyCode as string | null) ?? '';

                if (!parentFamilyCode || parentFamilyCode !== childFamilyCode) {
                    Alert.alert('권한 없음', '이 아이 정보를 수정할 권한이 없습니다.');
                    router.back();
                    return;
                }

                setNickname((childData.nickname as string) ?? '');
                setAvatar((childData.avatar as string) ?? '🐼');
                setAge(String((childData.age as number | undefined) ?? 5));
            } catch (error) {
                console.error('Failed to load child profile', error);
                Alert.alert('오류', '아이 정보를 불러오지 못했습니다.');
                router.back();
            } finally {
                setLoading(false);
            }
        };

        loadChildProfile();
    }, [normalizedChildId]);

    const handleSave = async () => {
        const trimmedNickname = nickname.trim();
        const parsedAge = Number(age);

        if (!trimmedNickname) {
            Alert.alert('입력 확인', '아이 닉네임을 입력해주세요.');
            return;
        }
        if (Number.isNaN(parsedAge) || parsedAge < 3 || parsedAge > 6) {
            Alert.alert('입력 확인', '아이 나이는 3~6 사이로 입력해주세요.');
            return;
        }
        if (!normalizedChildId) {
            Alert.alert('오류', '아이 정보를 찾을 수 없습니다.');
            return;
        }

        setSaving(true);
        try {
            await updateDoc(doc(db, 'children', normalizedChildId), {
                nickname: trimmedNickname,
                avatar: avatar.trim() || '🐼',
                age: parsedAge,
                updatedAt: serverTimestamp(),
            });

            Alert.alert('저장 완료', '아이 정보가 수정되었습니다.', [
                { text: '확인', onPress: () => router.back() },
            ]);
        } catch (error) {
            console.error('Failed to update child profile', error);
            Alert.alert('저장 실패', '아이 정보 저장 중 문제가 발생했습니다.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2979FF" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="chevron-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.title}>아이 정보 수정</Text>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>닉네임</Text>
                        <TextInput
                            style={styles.input}
                            value={nickname}
                            onChangeText={setNickname}
                            placeholder="아이 닉네임"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>나이 (3~6)</Text>
                        <TextInput
                            style={styles.input}
                            value={age}
                            onChangeText={setAge}
                            keyboardType="number-pad"
                            placeholder="5"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>아바타</Text>
                        <View style={styles.avatarGrid}>
                            {AVATAR_OPTIONS.map((item) => {
                                const selected = avatar === item;
                                return (
                                    <TouchableOpacity
                                        key={item}
                                        style={[styles.avatarButton, selected && styles.avatarButtonActive]}
                                        onPress={() => setAvatar(item)}
                                    >
                                        <Text style={styles.avatarText}>{item}</Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    <TouchableOpacity style={[styles.saveButton, saving && styles.saveButtonDisabled]} onPress={handleSave} disabled={saving}>
                        {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveButtonText}>저장</Text>}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#EEF1F5',
    },
    backButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1E293B',
    },
    content: {
        padding: 16,
    },
    inputGroup: {
        marginBottom: 14,
    },
    label: {
        fontSize: 14,
        color: '#334155',
        marginBottom: 6,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: '#D7DEE7',
        borderRadius: 12,
        backgroundColor: '#FFF',
        paddingHorizontal: 12,
        paddingVertical: 12,
        fontSize: 15,
        color: '#0F172A',
    },
    avatarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    avatarButton: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#D7DEE7',
    },
    avatarButtonActive: {
        borderColor: '#2979FF',
        backgroundColor: '#EAF1FF',
    },
    avatarText: {
        fontSize: 24,
    },
    saveButton: {
        marginTop: 12,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2979FF',
    },
    saveButtonDisabled: {
        opacity: 0.75,
    },
    saveButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

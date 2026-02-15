import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../firebase';

export default function ParentProfileEditScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [photoUrl, setPhotoUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    Alert.alert('안내', '로그인 정보가 없어 다시 로그인해주세요.');
                    router.replace('/login');
                    return;
                }

                const parentRef = doc(db, 'parents', user.uid);
                const parentSnap = await getDoc(parentRef);
                const data = parentSnap.exists() ? parentSnap.data() : null;

                setName((data?.displayName as string) || user.displayName || '');
                setEmail((data?.email as string) || user.email || '');
                setPhotoUrl((data?.photoUrl as string) || user.photoURL || '');
            } catch (error) {
                console.error('Error loading profile:', error);
                Alert.alert('오류', '프로필 정보를 불러오지 못했습니다.');
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
    }, []);

    const handleSave = async () => {
        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        const trimmedPhotoUrl = photoUrl.trim();

        if (!trimmedName) {
            Alert.alert('입력 필요', '이름을 입력해주세요.');
            return;
        }

        const user = auth.currentUser;
        if (!user) {
            Alert.alert('안내', '로그인 정보가 없어 다시 로그인해주세요.');
            router.replace('/login');
            return;
        }

        setSaving(true);
        try {
            const parentRef = doc(db, 'parents', user.uid);
            await setDoc(
                parentRef,
                {
                    displayName: trimmedName,
                    email: trimmedEmail || user.email || '',
                    photoUrl: trimmedPhotoUrl,
                    updatedAt: serverTimestamp(),
                },
                { merge: true }
            );

            await updateProfile(user, {
                displayName: trimmedName,
                photoURL: trimmedPhotoUrl || null,
            });

            Alert.alert('저장 완료', '프로필이 업데이트되었습니다.', [
                {
                    text: '확인',
                    onPress: () => router.back(),
                },
            ]);
        } catch (error) {
            console.error('Error saving profile:', error);
            Alert.alert('저장 실패', '프로필 저장 중 문제가 발생했습니다.');
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
                    <Text style={styles.title}>프로필 편집</Text>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>이름</Text>
                        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="이름을 입력하세요" />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>이메일</Text>
                        <TextInput
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            placeholder="이메일을 입력하세요"
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>프로필 사진 URL</Text>
                        <TextInput
                            style={styles.input}
                            value={photoUrl}
                            onChangeText={setPhotoUrl}
                            placeholder="https://..."
                            autoCapitalize="none"
                        />
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
    container: {
        flex: 1,
        backgroundColor: '#F5F7FA',
    },
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
    saveButton: {
        marginTop: 10,
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

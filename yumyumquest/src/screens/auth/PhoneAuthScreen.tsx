import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../firebase';
import { getUserFlowStatus, setPhoneVerified } from '../../services/auth';

export default function PhoneAuthScreen() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [code, setCode] = useState('');
    const [verificationId, setVerificationId] = useState<string | null>(null);
    const [stage, setStage] = useState<'phone' | 'code'>('phone'); // 'phone' or 'code'
    const [loading, setLoading] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);

    useEffect(() => {
        const checkAlreadyVerified = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    router.replace('/');
                    return;
                }

                const flow = await getUserFlowStatus(user.uid);
                if (flow.phoneVerified) {
                    router.replace(flow.onboardingCompleted ? '/(parent)' : '/onboarding');
                    return;
                }
            } catch (error) {
                console.error('Error checking phone verification status:', error);
            } finally {
                setCheckingStatus(false);
            }
        };

        checkAlreadyVerified();
    }, []);

    // Mock sending verification code
    const handleSendCode = async () => {
        if (phoneNumber.length < 10) {
            alert("유효한 휴대폰 번호를 입력해주세요.");
            return;
        }

        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setVerificationId('mock-verification-id');
            setStage('code');
            alert(`[개발용] 인증번호가 발송되었습니다. (인증번호: 123456)`);
        }, 1500);
    };

    // Mock verifying code
    const handleVerifyCode = async () => {
        if (code.length < 6) {
            alert("인증번호 6자리를 입력해주세요.");
            return;
        }

        setLoading(true);
        // Simulate API call
        setTimeout(async () => {
            setLoading(false);
            if (code === '123456') { // Mock check
                const user = auth.currentUser;
                if (!user) {
                    Alert.alert("인증 실패", "로그인 정보가 없어요. 다시 로그인해주세요.");
                    router.replace('/');
                    return;
                }

                await setPhoneVerified(user.uid);
                const flow = await getUserFlowStatus(user.uid);

                Alert.alert("인증 성공", "휴대폰 인증이 완료되었습니다.", [
                    {
                        text: "확인",
                        onPress: () => {
                            router.replace(flow.onboardingCompleted ? '/(parent)' : '/onboarding');
                        }
                    }
                ]);
            } else {
                alert("인증번호가 일치하지 않습니다.");
            }
        }, 1500);
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <LinearGradient
                colors={['#FFF8E1', '#FFE0B2']} // Soft yellow/orange
                style={styles.container}
            >
                <SafeAreaView style={styles.safeArea}>
                    <StatusBar style="dark" />

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.keyboardAvoidingView}
                    >
                        {checkingStatus ? (
                            <ActivityIndicator size="large" color="#FFA000" />
                        ) : (
                        <View style={styles.card}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name="shield-check" size={50} color="#FFA000" />
                            </View>

                            <Text style={styles.title}>휴대폰 본인 인증</Text>
                            <Text style={styles.subtitle}>
                                안전한 서비스 이용을 위해{'\n'}휴대폰 번호를 인증해주세요
                            </Text>

                            {stage === 'phone' ? (
                                <View style={styles.inputSection}>
                                    <Text style={styles.label}>휴대폰 번호</Text>
                                    <View style={styles.inputWrapper}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="010-1234-5678"
                                            placeholderTextColor="#CCC"
                                            keyboardType="number-pad"
                                            value={phoneNumber}
                                            onChangeText={setPhoneNumber}
                                            maxLength={13}
                                            editable={!loading}
                                        />
                                    </View>
                                    <TouchableOpacity
                                        style={[styles.button, (loading || phoneNumber.length < 10) && styles.disabledButton]}
                                        onPress={handleSendCode}
                                        disabled={loading || phoneNumber.length < 10}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color="#FFF" />
                                        ) : (
                                            <Text style={styles.buttonText}>인증번호 받기</Text>
                                        )}
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.inputSection}>
                                    <Text style={styles.label}>인증번호 입력</Text>
                                    <View style={styles.infoRow}>
                                        <Text style={styles.phoneDisplay}>{phoneNumber}</Text>
                                        <TouchableOpacity onPress={() => setStage('phone')}>
                                            <Text style={styles.changeLink}>변경</Text>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.codeContainer}>
                                        <TextInput
                                            style={[styles.input, styles.codeInput]}
                                            placeholder="인증번호 6자리"
                                            placeholderTextColor="#CCC"
                                            keyboardType="number-pad"
                                            value={code}
                                            onChangeText={setCode}
                                            maxLength={6}
                                            editable={!loading}
                                        />
                                        <Text style={styles.timerText}>3:00</Text>
                                    </View>

                                    <TouchableOpacity
                                        style={[styles.button, (loading || code.length < 6) && styles.disabledButton]}
                                        onPress={handleVerifyCode}
                                        disabled={loading || code.length < 6}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color="#FFF" />
                                        ) : (
                                            <Text style={styles.buttonText}>인증하기</Text>
                                        )}
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.resendButton}
                                        onPress={handleSendCode}
                                        disabled={loading}
                                    >
                                        <Text style={styles.resendText}>인증번호 재전송</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                        )}
                    </KeyboardAvoidingView>
                </SafeAreaView>
            </LinearGradient>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
    },
    keyboardAvoidingView: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    iconContainer: {
        marginBottom: 20,
        backgroundColor: '#FFF8E1',
        padding: 16,
        borderRadius: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        color: '#757575',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
    },
    inputSection: {
        width: '100%',
    },
    label: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 56,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        borderRadius: 16,
        paddingHorizontal: 20,
        fontSize: 16,
        color: '#333',
        backgroundColor: '#FAFAFA',
    },
    button: {
        width: '100%',
        height: 56,
        backgroundColor: '#FFA000', // Orange primary
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#FFA000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    disabledButton: {
        backgroundColor: '#FFE0B2',
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    /* Code Stage Styles */
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        paddingHorizontal: 4,
    },
    phoneDisplay: {
        fontSize: 14,
        color: '#555',
        fontWeight: '500',
    },
    changeLink: {
        fontSize: 12,
        color: '#FFA000',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    codeContainer: {
        position: 'relative',
        marginBottom: 20,
    },
    codeInput: {
        letterSpacing: 8,
        fontWeight: 'bold',
        paddingRight: 60,
    },
    timerText: {
        position: 'absolute',
        right: 20,
        top: 18,
        color: '#F44336',
        fontWeight: 'bold',
        fontSize: 14,
    },
    resendButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    resendText: {
        color: '#757575',
        fontSize: 14,
        textDecorationLine: 'underline',
    }
});

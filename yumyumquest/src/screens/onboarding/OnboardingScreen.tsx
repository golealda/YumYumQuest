import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../../firebase';
import { setOnboardingCompleted } from '../../services/auth';
import { createFamilyGroup, createParentProfile } from '../../services/onboardingService';

const { width } = Dimensions.get('window');

// Total steps in the onboarding process
const TOTAL_STEPS = 4;

export default function OnboardingScreen() {
    const [currentStep, setCurrentStep] = useState(1);
    const [name, setName] = useState('');
    const [gender, setGender] = useState<'male' | 'female' | null>(null);
    const [nickname, setNickname] = useState('');

    // Step 2 State (Location)
    const [regionMain, setRegionMain] = useState('');
    const [regionSub, setRegionSub] = useState('');
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);

    // Step 3 State (Family Code)
    const [familyCode, setFamilyCode] = useState('BJ2SU2');

    // Step 4 State (Notification)
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    const [loading, setLoading] = useState(false);

    // Step 1: Profile Submit
    const handleStep1Submit = () => {
        if (!name || !gender || !nickname) return;
        console.log("Step 1 (Profile) Submitted:", { name, gender, nickname });
        setCurrentStep(2);
    };

    // Step 2: Location Submit -> Create Profile/Group
    const handleStep2Submit = async () => {
        if (!regionMain || !regionSub) return;

        console.log("Step 2 (Location) Submitted:", { regionMain, regionSub });

        setLoading(true);
        try {
            const user = auth.currentUser;
            if (user) {
                // 1. Create Parent Profile
                await createParentProfile(
                    user.uid,
                    user.email || '',
                    name,
                    user.photoURL || undefined
                );

                // 2. Create Family Group
                const code = await createFamilyGroup(user.uid);
                setFamilyCode(code);
            } else {
                console.log("No authenticated user found. Using mock data.");
            }

            // Proceed to Step 3 (Code)
            setCurrentStep(3);
        } catch (error) {
            console.error("Error creating profile/group:", error);
            alert("오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };

    // Step 3: Code Next
    const handleStep3Submit = () => {
        setCurrentStep(4);
    };

    // Step 4: Notification Submit (Finish)
    const handleStep4Submit = async () => {
        console.log("Onboarding Complete:", {
            name,
            gender,
            nickname,
            regionMain,
            regionSub,
            familyCode,
            notificationsEnabled
        });
        try {
            const user = auth.currentUser;
            if (user) {
                await setOnboardingCompleted(user.uid);
            }
        } catch (error) {
            console.error("Error saving onboarding completion:", error);
        }

        alert("온보딩 완료! 메인 화면으로 이동합니다.");
        router.replace('/(parent)');
    };

    const handleSkipStep3 = () => {
        setCurrentStep(4);
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const resolveCityName = (address: Location.LocationGeocodedAddress) => {
        const candidates = [address.city, address.subregion, address.district].filter(Boolean) as string[];
        const city = candidates.find((item) => item.endsWith('시') || item.includes('시'));
        return city || candidates[0] || '';
    };

    const handleAutoSetLocation = async () => {
        setIsDetectingLocation(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('위치 권한 필요', '현재 위치를 가져오려면 위치 권한을 허용해주세요.');
                return;
            }

            const currentPosition = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Balanced,
            });
            const addresses = await Location.reverseGeocodeAsync({
                latitude: currentPosition.coords.latitude,
                longitude: currentPosition.coords.longitude,
            });

            const address = addresses[0];
            if (!address) {
                Alert.alert('위치 확인 실패', '현재 위치의 주소 정보를 찾지 못했어요. 다시 시도해주세요.');
                return;
            }

            const main = address.region?.trim() || '';
            const city = resolveCityName(address);

            if (!main || !city) {
                Alert.alert('위치 확인 실패', '시/도 또는 시 정보를 찾지 못했어요. 다시 시도해주세요.');
                return;
            }

            setRegionMain(main);
            setRegionSub(city);
        } catch (error) {
            console.error('Error getting current location:', error);
            Alert.alert('오류', '현재 위치를 가져오지 못했어요. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsDetectingLocation(false);
        }
    };

    const renderStep1 = () => (
        <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
                <Text style={{ fontSize: 48 }}>👩‍💼</Text>
            </View>
            <Text style={styles.stepTitle}>프로필 설정</Text>
            <Text style={styles.stepSubtitle}>개인 정보를 입력하세요</Text>

            {/* Name Input */}
            <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>이름</Text>
                <TextInput
                    style={styles.input}
                    placeholder="예: 홍길동"
                    placeholderTextColor="#CCC"
                    value={name}
                    onChangeText={setName}
                />
                <Text style={styles.fieldHint}>💡 이름은 안전하게 보호됩니다</Text>
            </View>

            {/* Gender Selection */}
            <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>성별</Text>
                <View style={styles.genderContainer}>
                    <TouchableOpacity
                        style={[styles.genderButton, gender === 'male' && styles.genderButtonSelected]}
                        onPress={() => setGender('male')}
                    >
                        <Text style={styles.genderEmoji}>👨</Text>
                        <Text style={[styles.genderText, gender === 'male' && styles.genderTextSelected]}>남자</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.genderButton, gender === 'female' && styles.genderButtonSelected]}
                        onPress={() => setGender('female')}
                    >
                        <Text style={styles.genderEmoji}>👩</Text>
                        <Text style={[styles.genderText, gender === 'female' && styles.genderTextSelected]}>여자</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Nickname Input */}
            <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>아이가 나를 이렇게 불러요</Text>
                <TextInput
                    style={styles.input}
                    placeholder="예: 엄마, 아빠, 할머니"
                    placeholderTextColor="#CCC"
                    value={nickname}
                    onChangeText={setNickname}
                />
                <Text style={styles.fieldHint}>💡 앱 전체에서 이 호칭으로 표시됩니다</Text>
            </View>

            {/* Navigation Buttons */}
            <View style={styles.buttonRow}>
                {/* No Prev Button on Step 1 of Profile? Or maybe back to Phone Auth? */}
                {/* For now, just Next */}
                <TouchableOpacity
                    style={[styles.nextButton, (!name || !gender || !nickname) && styles.disabledButton]}
                    onPress={handleStep1Submit}
                    disabled={!name || !gender || !nickname}
                >
                    <Text style={[styles.actionButtonText, (!name || !gender || !nickname) && styles.disabledButtonText]}>다음으로</Text>
                    <MaterialIcons name="chevron-right" size={24} color={(!name || !gender || !nickname) ? "#BDBDBD" : "#FFF"} />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderStep2 = () => (
        <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
                <Text style={{ fontSize: 48 }}>📍</Text>
            </View>
            <Text style={styles.stepTitle}>지역 선택</Text>
            <Text style={styles.stepSubtitle}>버튼 한 번으로 현재 위치를 자동 설정하세요</Text>

            <View style={styles.locationResultCard}>
                <Text style={styles.locationResultLabel}>설정된 지역</Text>
                <Text style={styles.locationResultText}>
                    {regionMain && regionSub ? `${regionMain} ${regionSub}` : '아직 설정되지 않았어요'}
                </Text>
                <Text style={styles.fieldHint}>💡 시/도와 시 정보만 자동으로 저장됩니다</Text>
            </View>

            <TouchableOpacity
                style={[styles.locationButton, isDetectingLocation && styles.disabledButton]}
                onPress={handleAutoSetLocation}
                disabled={isDetectingLocation}
            >
                <MaterialIcons name="my-location" size={20} color="#FFF" />
                <Text style={styles.locationButtonText}>
                    {isDetectingLocation ? '현재 위치 확인 중...' : '내 동네 자동 설정'}
                </Text>
            </TouchableOpacity>

            {/* Navigation Buttons */}
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.prevButton} onPress={handlePrevStep}>
                    <Text style={styles.prevButtonText}>이전</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.nextButton, (!regionMain || !regionSub) && styles.disabledButton]}
                    onPress={handleStep2Submit}
                    disabled={!regionMain || !regionSub}
                >
                    <Text style={[styles.actionButtonText, (!regionMain || !regionSub) && styles.disabledButtonText]}>다음으로</Text>
                    <MaterialIcons name="chevron-right" size={24} color={(!regionMain || !regionSub) ? "#BDBDBD" : "#FFF"} />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderStep3 = () => (
        <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
                <Text style={{ fontSize: 48 }}>🔑</Text>
            </View>
            <Text style={styles.stepTitle}>가족 코드 생성</Text>
            <Text style={styles.stepSubtitle}>아이를 초대할 가족 코드를 생성하세요</Text>

            <View style={styles.codeCard}>
                <Text style={styles.codeText}>{familyCode}</Text>
                <Text style={styles.codeDesc}>이 코드를 아이에게 공유하세요</Text>
                <TouchableOpacity style={styles.copyButton} onPress={() => alert('코드가 복사되었습니다!')}>
                    <MaterialIcons name="content-copy" size={20} color="#FFF" />
                    <Text style={styles.copyButtonText}>코드 복사하기</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.infoCardBlue}>
                <View style={styles.infoIconContainer}>
                    <MaterialCommunityIcons name="help-circle" size={24} color="#000" />
                </View>
                <View style={styles.infoTextContainer}>
                    <Text style={styles.infoTitleBlue}>아이 앱에서 코드 입력</Text>
                    <Text style={styles.infoDescBlue}>아이가 앱을 열고 이 코드를 입력하면 연결됩니다</Text>
                </View>
            </View>

            <View style={styles.infoCardPurple}>
                <View style={styles.infoIconContainer}>
                    <Text style={{ fontSize: 24 }}>🎁</Text>
                </View>
                <View style={styles.infoTextContainer}>
                    <Text style={styles.infoTitlePurple}>나중에도 생성 가능</Text>
                    <Text style={styles.infoDescPurple}>설정 메뉴에서 언제든지 코드를 생성할 수 있어요</Text>
                </View>
            </View>

            {/* Navigation Buttons */}
            <View style={styles.verticalButtonContainer}>
                <TouchableOpacity style={styles.fullWidthNextButton} onPress={handleStep3Submit}>
                    <Text style={styles.fullWidthNextButtonText}>다음으로</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.skipButton} onPress={handleSkipStep3}>
                    <Text style={styles.skipButtonText}>나중에 하기</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.textPrevButton} onPress={handlePrevStep}>
                    <MaterialIcons name="arrow-back" size={16} color="#757575" />
                    <Text style={styles.textPrevButtonText}>이전</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderStep4 = () => (
        <View style={styles.stepContainer}>
            <View style={styles.iconContainer}>
                <Text style={{ fontSize: 48 }}>🔔</Text>
            </View>
            <Text style={styles.stepTitle}>알림 설정</Text>
            <Text style={styles.stepSubtitle}>아이의 활동을 실시간으로 받아보세요</Text>

            <View style={styles.notificationCardBlue}>
                <MaterialCommunityIcons name="bell-outline" size={24} color="#6200EA" />
                <View style={styles.notifTextContainer}>
                    <Text style={styles.notifTitle}>퀘스트 완료 알림</Text>
                    <Text style={styles.notifDesc}>아이가 과제를 완료하면 즉시 알려드려요</Text>
                </View>
            </View>

            <View style={styles.notificationCardPink}>
                <MaterialCommunityIcons name="heart-outline" size={24} color="#C51162" />
                <View style={styles.notifTextContainer}>
                    <Text style={styles.notifTitle}>구매 요청 알림</Text>
                    <Text style={styles.notifDesc}>아이가 쿠폰을 구매하려 할 때 승인 요청을 받아요</Text>
                </View>
            </View>

            <View style={styles.notificationCardGreen}>
                <MaterialCommunityIcons name="account-group-outline" size={24} color="#2E7D32" />
                <View style={styles.notifTextContainer}>
                    <Text style={styles.notifTitle}>가족 활동 알림</Text>
                    <Text style={styles.notifDesc}>새로운 아이가 연결되거나 특별한 순간을 공유해요</Text>
                </View>
            </View>

            {/* Toggle Button */}
            <TouchableOpacity
                style={styles.toggleButtonContainer}
                activeOpacity={1}
                onPress={() => setNotificationsEnabled(!notificationsEnabled)}
            >
                <View style={styles.toggleContent}>
                    <MaterialCommunityIcons name="bell-ring-outline" size={24} color="#FFF" />
                    <Text style={styles.toggleText}>알림 받기 동의</Text>
                </View>
                <Switch
                    trackColor={{ false: "#767577", true: "#B39DDB" }}
                    thumbColor={notificationsEnabled ? "#FFFFFF" : "#f4f3f4"}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={() => setNotificationsEnabled(!notificationsEnabled)}
                    value={notificationsEnabled}
                />
            </TouchableOpacity>

            {/* Navigation Buttons */}
            <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.prevButton} onPress={handlePrevStep}>
                    <Text style={styles.prevButtonText}>이전</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={handleStep4Submit}
                >
                    <Text style={styles.actionButtonText}>시작하기 🎉</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderContent = () => {
        switch (currentStep) {
            case 1:
                return renderStep1();
            case 2:
                return renderStep2();
            case 3:
                return renderStep3();
            case 4:
                return renderStep4();
            default:
                return <Text>Step {currentStep} content coming soon</Text>;
        }
    };

    // Calculate progress percentage
    const progress = (currentStep / TOTAL_STEPS) * 100;

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <LinearGradient
                colors={['#E3F2FD', '#F3E5F5']} // Light Blue to Light Purple gradient
                style={styles.container}
            >
                <SafeAreaView style={styles.safeArea}>
                    <StatusBar style="dark" />

                    {/* Progress Header */}
                    <View style={styles.header}>
                        <View style={styles.progressTextRow}>
                            <Text style={styles.stepIndicator}>
                                <Text style={styles.currentStep}>{currentStep}</Text> / {TOTAL_STEPS} 단계
                            </Text>
                            <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
                        </View>
                        <View style={styles.progressBarBackground}>
                            <LinearGradient
                                colors={['#7C4DFF', '#B388FF']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[styles.progressBarFill, { width: `${progress}%` }]}
                            />
                        </View>
                    </View>

                    {/* Main Card Content */}
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.keyboardAvoidingView}
                    >
                        <View style={styles.card}>
                            {renderContent()}
                        </View>
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
    header: {
        paddingHorizontal: 24,
        paddingTop: 20,
        marginBottom: 30,
    },
    progressTextRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    stepIndicator: {
        fontSize: 14,
        color: '#5E35B1',
        fontWeight: 'bold',
    },
    currentStep: {
        color: '#5E35B1',
        fontSize: 16,
        fontWeight: 'bold',
    },
    progressPercent: {
        fontSize: 14,
        color: '#5E35B1',
        fontWeight: 'bold',
    },
    progressBarBackground: {
        height: 8,
        backgroundColor: '#F0F0F0', // Or a very light semi-transparent white
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    keyboardAvoidingView: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
        minHeight: 400, // Ensure card has enough height
        justifyContent: 'center',
    },
    stepContainer: {
        alignItems: 'center',
        width: '100%',
    },
    iconContainer: {
        marginBottom: 20,
    },
    stepTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    stepSubtitle: {
        fontSize: 14,
        color: '#757575',
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 20,
    },
    inputWrapper: {
        width: '100%',
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
        marginLeft: 4,
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
    locationResultCard: {
        width: '100%',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 16,
        backgroundColor: '#FAFAFA',
        paddingHorizontal: 20,
        paddingVertical: 16,
        marginBottom: 16,
    },
    locationResultLabel: {
        fontSize: 13,
        color: '#757575',
        marginBottom: 8,
    },
    locationResultText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    locationButton: {
        width: '100%',
        height: 56,
        backgroundColor: '#4F46E5',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    locationButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledInput: {
        backgroundColor: '#E0E0E0',
        color: '#9E9E9E',
    },
    fieldHint: {
        fontSize: 12,
        color: '#9E9E9E',
        marginLeft: 4,
        marginTop: 6,
    },
    hintContainer: {
        width: '100%',
        marginBottom: 40,
    },
    hintText: {
        fontSize: 12,
        color: '#9E9E9E',
        marginLeft: 4,
    },
    actionButton: {
        width: '100%',
        height: 56,
        backgroundColor: '#7C4DFF', // Active color (Purple)
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#7C4DFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    disabledButton: {
        backgroundColor: '#EEEEEE',
        shadowOpacity: 0,
        elevation: 0,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
    disabledButtonText: {
        color: '#BDBDBD',
    },
    // Step 2 Styles
    genderContainer: {
        flexDirection: 'row',
        gap: 15,
    },
    genderButton: {
        flex: 1,
        height: 80,
        backgroundColor: '#FAFAFA',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    genderButtonSelected: {
        backgroundColor: '#F3E5F5',
        borderColor: '#7C4DFF',
    },
    genderEmoji: {
        fontSize: 32,
        marginBottom: 5,
    },
    genderText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#757575',
    },
    genderTextSelected: {
        color: '#7C4DFF',
    },
    buttonRow: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
        marginTop: 10,
    },
    prevButton: {
        width: 80,
        height: 56,
        backgroundColor: '#EEEEEE',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    prevButtonText: {
        color: '#757575',
        fontSize: 16,
        fontWeight: 'bold',
    },
    nextButton: {
        flex: 1,
        height: 56,
        backgroundColor: '#7C4DFF',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#7C4DFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    // Step 4 Styles
    codeCard: {
        width: '100%',
        backgroundColor: '#FFF8E1',
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFE082',
        marginBottom: 20,
    },
    codeText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#5D4037',
        marginBottom: 8,
    },
    codeDesc: {
        fontSize: 14,
        color: '#8D6E63',
        marginBottom: 16,
    },
    copyButton: {
        backgroundColor: '#FFB74D',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    copyButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    infoCardBlue: {
        width: '100%',
        backgroundColor: '#E3F2FD',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#BBDEFB',
    },
    infoTitleBlue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1565C0',
        marginBottom: 4,
    },
    infoDescBlue: {
        fontSize: 12,
        color: '#1976D2',
    },
    infoCardPurple: {
        width: '100%',
        backgroundColor: '#F3E5F5',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#E1BEE7',
    },
    infoTitlePurple: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#7B1FA2',
        marginBottom: 4,
    },
    infoDescPurple: {
        fontSize: 12,
        color: '#8E24AA',
    },
    infoIconContainer: {
        marginRight: 16,
    },
    infoTextContainer: {
        flex: 1,
    },
    verticalButtonContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 12,
    },
    fullWidthNextButton: {
        width: '100%',
        height: 56,
        backgroundColor: '#8C52FF', // Brighter purple
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#8C52FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    fullWidthNextButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    skipButton: {
        width: '100%',
        height: 56,
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    skipButtonText: {
        color: '#757575',
        fontSize: 16,
        fontWeight: 'bold',
    },
    textPrevButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        gap: 4,
    },
    textPrevButtonText: {
        color: '#757575',
        fontSize: 14,
    },
    // Step 5 Styles
    notificationCardBlue: {
        width: '100%',
        backgroundColor: '#E8EAF6',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#C5CAE9',
    },
    notificationCardPink: {
        width: '100%',
        backgroundColor: '#FCE4EC',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F8BBD0',
    },
    notificationCardGreen: {
        width: '100%',
        backgroundColor: '#E8F5E9',
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#C8E6C9',
    },
    notifTextContainer: {
        marginLeft: 16,
        flex: 1,
    },
    notifTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    notifDesc: {
        fontSize: 12,
        color: '#666',
        lineHeight: 16,
    },
    toggleButtonContainer: {
        width: '100%',
        height: 64,
        backgroundColor: '#7C4DFF',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 24,
        shadowColor: '#7C4DFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    toggleContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    toggleText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

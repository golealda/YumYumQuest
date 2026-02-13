import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function SignupScreen() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Header Section: Back Button */}
                <View style={styles.topHeader}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#D87A46" />
                        <Text style={styles.backButtonText}>로그인으로 돌아가기</Text>
                    </TouchableOpacity>
                </View>

                {/* Mascot & Title */}
                <View style={styles.header}>
                    <View style={styles.mascotContainer}>
                        {/* Decorative Rice Plant (Left) */}
                        <MaterialCommunityIcons name="barley" size={30} color="#DAA520" style={styles.decoPlant} />

                        {/* Main Mascot */}
                        <Image
                            source={require('../../assets/ant_mascot.png')}
                            style={styles.mascotImage}
                            resizeMode="contain"
                        />
                    </View>

                    <Text style={styles.mainTitle}>회원가입</Text>
                    <Text style={styles.subtitle}>보호자 계정을 만들어주세요</Text>
                </View>

                {/* Signup Card */}
                <View style={styles.card}>
                    {/* Bug Icon Decoration */}
                    <View style={styles.cardDecoration}>
                        <MaterialCommunityIcons name="ladybug" size={24} color="#D32F2F" />
                    </View>

                    {/* Name Input */}
                    <Text style={styles.inputLabel}>이름</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="홍길동"
                            placeholderTextColor="#ccc"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    {/* Email Input */}
                    <View style={styles.labelRow}>
                        <Text style={styles.inputLabel}>이메일</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="example@email.com"
                            placeholderTextColor="#ccc"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    {/* Password Input */}
                    <View style={styles.labelRow}>
                        <Text style={styles.inputLabel}>비밀번호</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#ccc"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                            <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#999" />
                        </TouchableOpacity>
                    </View>

                    {/* Confirm Password Input */}
                    <View style={styles.labelRow}>
                        <Text style={styles.inputLabel}>비밀번호 확인</Text>
                    </View>
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor="#ccc"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry={!showConfirmPassword}
                        />
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                            <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#999" />
                        </TouchableOpacity>
                    </View>

                    {/* Signup Button */}
                    <TouchableOpacity style={styles.signupButton}>
                        <Text style={styles.signupButtonText}>가입하기</Text>
                    </TouchableOpacity>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>또는</Text>
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Social Buttons */}
                    <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
                        <Ionicons name="logo-google" size={20} color="#DB4437" style={styles.socialIcon} />
                        <Text style={styles.socialButtonTextGoogle}>Google로 가입하기</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.socialButton, styles.kakaoButton]}>
                        <MaterialCommunityIcons name="chat-processing" size={20} color="#3C1E1E" style={styles.socialIcon} />
                        <Text style={styles.socialButtonTextKakao}>카카오로 가입하기</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.socialButton, styles.naverButton]}>
                        <Text style={styles.naverIcon}>N</Text>
                        <Text style={styles.socialButtonTextWhite}>네이버로 가입하기</Text>
                    </TouchableOpacity>

                </View>

                {/* Footer Terms */}
                <View style={styles.footerTerms}>
                    <Text style={styles.footerTermsText}>
                        가입하면 <Text style={styles.linkText}>이용약관</Text> 및 <Text style={styles.linkText}>개인정보처리방침</Text>에 동의하게 됩니다
                    </Text>
                    <TouchableOpacity onPress={() => router.back()} style={styles.loginLink}>
                        <Text style={styles.footerText}>이미 계정이 있으신가요? <Text style={styles.linkText}>로그인</Text></Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8E1', // Light cream background
    },
    scrollContent: {
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    topHeader: {
        width: '100%',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
    },
    backButtonText: {
        color: '#D87A46',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    mascotContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginBottom: 10,
    },
    decoPlant: {
        marginRight: -10,
        marginBottom: 20,
    },
    mascotImage: {
        width: 120,
        height: 120,
    },
    mainTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#5D4037', // Brown
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#D87A46', // Soft orange/brown
        fontWeight: '600',
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 24,
        width: '100%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 20,
        position: 'relative',
    },
    cardDecoration: {
        position: 'absolute',
        top: -12,
        right: 20,
        zIndex: 1,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#555',
        marginBottom: 8,
        marginLeft: 4,
    },
    labelRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
        marginBottom: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#EEEEEE',
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 52,
        backgroundColor: '#FFFFFF',
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
    signupButton: {
        backgroundColor: '#FFA000', // Orange
        borderRadius: 14,
        height: 54,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
        shadowColor: '#FFA000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    signupButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#EEEEEE',
    },
    dividerText: {
        marginHorizontal: 10,
        color: '#AAA',
        fontSize: 14,
    },
    socialButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 52,
        borderRadius: 14,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    googleButton: {
        backgroundColor: '#FFF',
        borderColor: '#EEEEEE',
    },
    kakaoButton: {
        backgroundColor: '#FEE500',
    },
    naverButton: {
        backgroundColor: '#03C75A',
    },
    socialIcon: {
        marginRight: 10,
    },
    naverIcon: {
        color: '#FFF',
        fontWeight: '900',
        fontSize: 18,
        marginRight: 10,
    },
    socialButtonTextGoogle: {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
    },
    socialButtonTextKakao: {
        color: '#3C1E1E',
        fontSize: 16,
        fontWeight: '600',
    },
    socialButtonTextWhite: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '600',
    },
    footerTerms: {
        marginTop: 10,
        padding: 20,
        backgroundColor: '#FFF',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#F0F0F0',
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
    },
    footerTermsText: {
        color: '#777',
        fontSize: 12,
        textAlign: 'center',
    },
    linkText: {
        color: '#FF6F00',
        fontWeight: 'bold',
    },
    loginLink: {
        marginTop: 15,
    },
    footerText: {
        color: '#777',
        fontSize: 14,
    },
});

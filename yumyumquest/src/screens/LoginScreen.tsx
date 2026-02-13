import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Dimensions, Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        // In a real app, validate credentials here.
        // For now, just navigate to the parent dashboard.
        router.replace('/(parent)');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* Header Section */}
                <View style={styles.header}>
                    <View style={styles.mascotContainer}>
                        {/* Main Mascot */}
                        <Image
                            source={require('../../assets/ant_mascot.png')}
                            style={styles.mascotImage}
                            resizeMode="contain"
                        />
                    </View>

                    <Text style={styles.mainTitle}>개미의 선물 상자</Text>
                    <Text style={styles.subtitle}>일해서 모으고, 똑똑하게 쓰자!</Text>
                </View>

                {/* Login Card */}
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>로그인</Text>
                        {/* Bug Icon */}
                        <MaterialCommunityIcons name="ladybug" size={24} color="#D32F2F" />
                    </View>

                    {/* Email Input */}
                    <Text style={styles.inputLabel}>이메일</Text>
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
                        {/* Grasshopper Icon replacement - using generic bug or similar pattern */}
                        <MaterialCommunityIcons name="bug" size={16} color="#5D4037" style={styles.grasshopperIcon} />
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

                    {/* Login Button */}
                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>로그인</Text>
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
                        <Text style={styles.socialButtonTextGoogle}>Google로 계속하기</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.socialButton, styles.kakaoButton]}>
                        <MaterialCommunityIcons name="chat-processing" size={20} color="#3C1E1E" style={styles.socialIcon} />
                        <Text style={styles.socialButtonTextKakao}>카카오로 계속하기</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.socialButton, styles.naverButton]}>
                        <Text style={styles.naverIcon}>N</Text>
                        <Text style={styles.socialButtonTextWhite}>네이버로 계속하기</Text>
                    </TouchableOpacity>

                    {/* Footer Links */}
                    <Text style={styles.footerText}>계정이 없으신가요? <Link href="/signup" asChild><Text style={styles.linkText}>회원가입</Text></Link></Text>

                    <TouchableOpacity style={styles.childLoginLink}>
                        <MaterialCommunityIcons name="face-man-profile" size={20} color="#FFD700" />
                        <Text style={styles.childLoginText}> 아이라면 코드로 입장하기</Text>
                    </TouchableOpacity>
                </View>

                {/* Demo Note */}
                <View style={styles.demoNoteContainer}>
                    <Text style={styles.demoNoteTitle}>💡 데모 버전: <Text style={styles.demoNoteText}>아무 이메일/비밀번호로 로그인 가능합니다</Text></Text>
                    <Text style={styles.demoNoteSubText}>실제 서비스에서는 안전한 인증 시스템이 적용됩니다</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8E1', // Light cream background matching the image
    },
    scrollContent: {
        alignItems: 'center',
        paddingVertical: 60,
        paddingHorizontal: 20,
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
    mascotImage: {
        width: 150,
        height: 150,
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
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        position: 'relative',
    },
    cardTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
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
    grasshopperIcon: {
        marginRight: 6,
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
    loginButton: {
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
    loginButtonText: {
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
    footerLinks: {
        marginTop: 20,
        alignItems: 'center',
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
        width: '100%',
    },
    footerText: {
        color: '#777',
        fontSize: 14,
    },
    linkText: {
        color: '#FF6F00',
        fontWeight: 'bold',
        marginLeft: 5,
    },
    childLoginLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
    },
    childLoginText: {
        color: '#2196F3', // Blue
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    demoNoteContainer: {
        marginTop: 40,
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 20,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    demoNoteTitle: {
        fontSize: 13,
        color: '#555',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 4,
    },
    demoNoteText: {
        fontWeight: 'normal',
    },
    demoNoteSubText: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
    },
});

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
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
    View
} from 'react-native';

const AVATARS = ['👦', '👧', '👱‍♀️', '👶', '🐻', '🐰', '🐼', '🦊'];

export default function ChildConnectionScreen() {
    const [name, setName] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
    const [familyCode, setFamilyCode] = useState('');

    const handleConnect = () => {
        // Implement connection logic here
        console.log('Connect:', { name, selectedAvatar, familyCode });
        // For now, mock success and navigate to child dashboard
        router.replace('/(child)');
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#5D4037" />
                    <Text style={styles.backButtonText}>뒤로가기</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                        {/* Main Card */}
                        <View style={styles.card}>
                            <View style={styles.iconContainer}>
                                <MaterialCommunityIcons name="link-variant" size={60} color="#5D4037" />
                            </View>

                            <Text style={styles.title}>부모님과 연결하기</Text>
                            <Text style={styles.subtitle}>부모님께 받은 가족 코드를 입력하세요</Text>

                            {/* Name Input */}
                            <Text style={styles.label}>내 이름</Text>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="예: 민준"
                                    placeholderTextColor="#CCC"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>

                            {/* Avatar Selection */}
                            <Text style={styles.label}>내 아바타</Text>
                            <View style={styles.avatarGrid}>
                                {AVATARS.map((avatar, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.avatarItem,
                                            selectedAvatar === avatar && styles.selectedAvatarItem
                                        ]}
                                        onPress={() => setSelectedAvatar(avatar)}
                                    >
                                        <Text style={styles.avatarText}>{avatar}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Family Code Input */}
                            <Text style={styles.label}>가족 코드</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="key-outline" size={20} color="#AAA" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="ABCD1234"
                                    placeholderTextColor="#CCC"
                                    value={familyCode}
                                    onChangeText={(text) => setFamilyCode(text.toUpperCase())}
                                    autoCapitalize="characters"
                                    maxLength={8}
                                />
                            </View>

                            {/* Connect Button */}
                            <TouchableOpacity style={styles.connectButton} onPress={handleConnect}>
                                <Text style={styles.connectButtonText}>연결하기</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Help Section */}
                        <View style={styles.helpCard}>
                            <Text style={styles.helpTitle}>💡 도움말</Text>
                            <View style={styles.helpList}>
                                <Text style={styles.helpText}>• 보호자 모드에서 생성한 가족 코드를 입력하세요</Text>
                                <Text style={styles.helpText}>• 코드는 대소문자를 구분하지 않아요</Text>
                                <Text style={styles.helpText}>• 연결 후 과제와 보상을 확인할 수 있어요</Text>
                            </View>
                        </View>

                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8E1', // Cream background
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
        maxWidth: 400,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        marginBottom: 20,
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
        marginBottom: 30,
        textAlign: 'center',
    },
    label: {
        width: '100%',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#455A64',
        marginBottom: 8,
        marginTop: 10,
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
        marginBottom: 10,
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
    connectButton: {
        width: '100%',
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
    connectButtonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    helpCard: {
        backgroundColor: '#E3F2FD', // Light Blue
        borderRadius: 16,
        padding: 20,
        width: '100%',
        maxWidth: 400,
        borderWidth: 1,
        borderColor: '#BBDEFB',
    },
    helpTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1565C0',
        marginBottom: 10,
    },
    helpList: {
        gap: 6,
    },
    helpText: {
        fontSize: 13,
        color: '#1976D2',
        lineHeight: 18,
    },
});

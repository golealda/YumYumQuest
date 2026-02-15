import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCurrentChildProfile } from '../services/childSessionService';

// Use the existing mascot image (assumed path based on previous context)
// If imports fail, I will fallback to emoji, but user said they added ant_mascot.png
const ANT_MASCOT = require('../../assets/ant_mascot.png');

interface Task {
    id: string;
    text: string;
    reward: number;
    completed: boolean;
}

export default function ChildDiaryScreen() {
    const [tasks, setTasks] = useState<Task[]>([
        { id: '1', text: '신발 가지런히 놓기', reward: 5, completed: false },
        { id: '2', text: '편식 안 하기', reward: 10, completed: false },
        { id: '3', text: '양치질 하기', reward: 5, completed: false },
        { id: '4', text: '신발 가지런히 놓기', reward: 5, completed: false },
        { id: '5', text: '편식 안 하기', reward: 10, completed: false },
        { id: '6', text: '양치질 하기', reward: 5, completed: false },
    ]);
    const [childName, setChildName] = useState('우리 개미');
    const [childAvatar, setChildAvatar] = useState('🐼');

    useFocusEffect(
        useCallback(() => {
            let mounted = true;
            const loadChildProfile = async () => {
                const profile = await getCurrentChildProfile();
                if (!mounted) return;
                if (profile) {
                    setChildName(profile.nickname);
                    setChildAvatar(profile.avatar);
                }
            };
            loadChildProfile();
            return () => {
                mounted = false;
            };
        }, [])
    );

    const toggleTask = (id: string) => {
        setTasks(tasks.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Header Gradient */}
            <LinearGradient
                colors={['#FF6F00', '#FFA000', '#FFCA28']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.headerGradient}
            >
                <SafeAreaView edges={['top']} style={styles.safeAreaHeader}>


                    <View style={styles.headerContent}>
                        <Image source={ANT_MASCOT} style={styles.headerMascot} resizeMode="contain" />
                        <View style={styles.headerTextContainer}>
                            <Text style={styles.greetingTitle}>안녕, {childName}!</Text>
                            <Text style={styles.greetingSubtitle}>오늘도 열심히 일해볼까?</Text>
                        </View>
                        <View style={styles.grainBadge}>
                            <Text style={styles.grainCount}>30</Text>
                            <Text style={styles.grainLabel}>곡식</Text>
                        </View>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                style={styles.contentContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Mascot Message Card */}
                <View style={styles.messageCard}>
                    <Image source={ANT_MASCOT} style={styles.messageMascot} resizeMode="contain" />
                    <View style={styles.messageTextContainer}>
                        <Text style={styles.messageTitle}>{childAvatar} {childName}에게</Text>
                        <Text style={styles.messageBody}>오늘도 열심히 일하면 곡식을 모을 수 있어!</Text>
                    </View>
                </View>

                {/* Today's Tasks Section */}
                <View style={styles.sectionHeader}>
                    <Ionicons name="checkbox-outline" size={20} color="#8D6E63" />
                    <Text style={styles.sectionTitle}>오늘 할 일</Text>
                </View>

                <View style={styles.taskList}>
                    {tasks.map((task) => (
                        <TouchableOpacity
                            key={task.id}
                            style={styles.taskCard}
                            onPress={() => toggleTask(task.id)}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.checkbox, task.completed && styles.checkedBox]}>
                                {task.completed && <Ionicons name="checkmark" size={16} color="#FFF" />}
                            </View>

                            <Text style={[styles.taskText, task.completed && styles.completedTaskText]}>
                                {task.text}
                            </Text>

                            <View style={styles.rewardBadge}>
                                <Text style={styles.rewardIcon}>🌾</Text>
                                <Text style={styles.rewardAmount}>{task.reward}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF8E1', // Cream background
    },
    headerGradient: {
        paddingBottom: 30,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    safeAreaHeader: {
        paddingHorizontal: 20,
    },
    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        marginLeft: 5,
        fontSize: 16,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    headerMascot: {
        width: 60,
        height: 60,
        marginRight: 15,
    },
    headerTextContainer: {
        flex: 1,
    },
    greetingTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    },
    greetingSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
    },
    grainBadge: {
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
        minWidth: 70,
    },
    grainCount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
    },
    grainLabel: {
        fontSize: 12,
        color: '#FFF',
    },
    contentContainer: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    messageCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        marginBottom: 25,
        marginTop: -30, // Negative margin to overlap with header
    },
    messageMascot: {
        width: 50,
        height: 50,
        marginRight: 15,
    },
    messageTextContainer: {
        flex: 1,
    },
    messageTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    messageBody: {
        fontSize: 14,
        color: '#555',
        lineHeight: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#5D4037',
        marginLeft: 8,
    },
    taskList: {
        gap: 12,
    },
    taskCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        paddingHorizontal: 15,
        paddingVertical: 18,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#FBC02D',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
        borderWidth: 1,
        borderColor: '#FFF9C4',
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#E0E0E0',
        marginRight: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkedBox: {
        backgroundColor: '#FFB74D',
        borderColor: '#FFB74D',
    },
    taskText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '600',
        color: '#424242',
    },
    completedTaskText: {
        color: '#9E9E9E',
        textDecorationLine: 'line-through',
    },
    rewardBadge: {
        backgroundColor: '#FFF8E1',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rewardIcon: {
        fontSize: 14,
        marginRight: 4,
    },
    rewardAmount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#8D6E63',
    },
});

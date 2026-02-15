import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ChildTaskItemProps {
    text: string;
    reward: number;
    completed: boolean;
    onPress: () => void;
}

export default function ChildTaskItem({ text, reward, completed, onPress }: ChildTaskItemProps) {
    return (
        <TouchableOpacity style={styles.taskCard} onPress={onPress} activeOpacity={0.8}>
            <View style={[styles.checkbox, completed && styles.checkedBox]}>
                {completed && <Ionicons name="checkmark" size={16} color="#FFF" />}
            </View>

            <Text style={[styles.taskText, completed && styles.completedTaskText]}>{text}</Text>

            <View style={styles.rewardBadge}>
                <Text style={styles.rewardIcon}>🌾</Text>
                <Text style={styles.rewardAmount}>{reward}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
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
        backgroundColor: '#FFF3E0',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFE0B2',
    },
    rewardIcon: {
        fontSize: 14,
        marginRight: 4,
    },
    rewardAmount: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#F57C00',
    },
});

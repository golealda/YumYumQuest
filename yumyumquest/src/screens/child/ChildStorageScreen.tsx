import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ChildHeader from '../../components/child/ChildHeader';

export default function ChildStorageScreen() {
    // Generate an array of 30 grains for visualization
    const grains = Array(30).fill('🌾');

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <ChildHeader childName="우리 개미" grainCount={30} />

            <ScrollView
                style={styles.contentContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Main Storage Card */}
                <View style={styles.storageCard}>
                    <View style={styles.cardHeader}>
                        <MaterialCommunityIcons name="pot-mix" size={40} color="#D84315" style={styles.potIcon} />
                        <Text style={styles.storageTitle}>내 곡식 창고</Text>
                    </View>
                    <Text style={styles.storageCount}>30</Text>
                    <Text style={styles.storageSubtitle}>개의 곡식을 모았어요!</Text>

                    {/* Grain Grid Visual */}
                    <View style={styles.grainGridContainer}>
                        <View style={styles.grainGrid}>
                            {grains.map((item, index) => (
                                <Text key={index} style={styles.grainIconItem}>{item}</Text>
                            ))}
                        </View>
                    </View>
                </View>

                {/* Progress List - Shown as 3 process cards in the image */}
                <View style={styles.progressContainer}>
                    {[1, 2, 3].map((item) => (
                        <View key={item} style={styles.progressItem}>
                            <MaterialCommunityIcons name="timer-sand" size={24} color="#8D6E63" />
                            <Text style={styles.progressText}>진행 중</Text>
                        </View>
                    ))}
                </View>

                {/* Stats Row - Shown as 2 bottom cards in the image */}
                <View style={styles.statsRow}>
                    <View style={styles.statsCard}>
                        <Ionicons name="checkbox-outline" size={32} color="#00C853" style={{ marginBottom: 5 }} />
                        <Text style={styles.statsNumber}>0</Text>
                        <Text style={styles.statsLabel}>완료한 일</Text>
                    </View>

                    <View style={styles.statsCard}>
                        <MaterialCommunityIcons name="chart-bar" size={32} color="#D32F2F" style={{ marginBottom: 5 }} />
                        <Text style={styles.statsNumber}>0</Text>
                        <Text style={styles.statsLabel}>총 모은 곡식</Text>
                    </View>
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
    storageCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        padding: 25,
        alignItems: 'center',
        marginTop: -10, // Slight overlap to keep a small gap under header
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    cardHeader: {
        alignItems: 'center',
        marginBottom: 5,
    },
    potIcon: {
        marginBottom: 10,
    },
    storageTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#37474F',
    },
    storageCount: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#E65100', // Deep Orange
        marginVertical: 5,
    },
    storageSubtitle: {
        fontSize: 14,
        color: '#78909C', // Blue Grey
        marginBottom: 20,
    },
    grainGridContainer: {
        width: '100%',
        backgroundColor: '#FFF8E1',
        borderWidth: 2,
        borderColor: '#FFD54F', // Yellow border
        borderRadius: 16,
        padding: 15,
        alignItems: 'center',
    },
    grainGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 4,
    },
    grainIconItem: {
        fontSize: 22,
        width: 28,
        textAlign: 'center',
    },
    progressContainer: {
        marginBottom: 20,
        gap: 10,
    },
    progressItem: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    progressText: {
        marginTop: 5,
        color: '#5D4037',
        fontWeight: '500',
        fontSize: 12,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
        gap: 15,
    },
    statsCard: {
        flex: 1,
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    statsNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    statsLabel: {
        fontSize: 12,
        color: '#9E9E9E',
        fontWeight: 'bold',
    },
});

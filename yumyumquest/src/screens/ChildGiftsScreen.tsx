import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ANT_MASCOT = require('../../assets/ant_mascot.png');

export default function ChildGiftsScreen() {
    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Header Gradient - Common across child screens */}
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
                            <Text style={styles.greetingTitle}>안녕, 우리 개미!</Text>
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
                {/* Title Section */}
                <View style={styles.titleSection}>
                    <Text style={styles.pageTitle}>🎁 🐜 개미가 준 선물</Text>
                    <Text style={styles.pageSubtitle}>열심히 일해서 받은 소중한 선물들이에요!</Text>
                </View>

                {/* Empty State Content */}
                <View style={styles.emptyStateContainer}>
                    <Image source={ANT_MASCOT} style={styles.emptyStateImage} resizeMode="contain" />
                    <Text style={styles.emptyStateTitle}>아직 받은 선물이 없어요</Text>
                    <Text style={styles.emptyStateSubtitle}>
                        과제를 열심히 완료하면 개미가 선물을 줄 거에요!{'\n'}
                    </Text>
                </View>

                {/* Tip Box */}
                <View style={styles.tipBox}>
                    <Text style={styles.tipText}>
                        <Text style={styles.tipIcon}>💡 팁: </Text>
                        일기를 완료해서 곡식을 모으면, 개미가 깜짝 선물을 가져올 수도 있어요!
                    </Text>
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
        alignItems: 'center', // Center content horizontally
    },
    titleSection: {
        width: '100%',
        marginBottom: 40,
        marginTop: 10,
    },
    pageTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    pageSubtitle: {
        fontSize: 14,
        color: '#555',
    },
    emptyStateContainer: {
        alignItems: 'center',
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    emptyStateImage: {
        width: 120,
        height: 120,
        marginBottom: 20,
        opacity: 0.9,
    },
    emptyStateTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#37474F',
        marginBottom: 10,
    },
    emptyStateSubtitle: {
        fontSize: 15,
        color: '#78909C',
        textAlign: 'center',
        lineHeight: 22,
    },
    tipBox: {
        backgroundColor: '#E3F2FD', // Light Blue
        borderRadius: 16,
        padding: 20,
        width: '100%',
        borderWidth: 1,
        borderColor: '#BBDEFB',
        shadowColor: '#1976D2',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 1,
    },
    tipText: {
        fontSize: 14,
        color: '#1565C0',
        lineHeight: 20,
        textAlign: 'center',
    },
    tipIcon: {
        fontWeight: 'bold',
    },
});

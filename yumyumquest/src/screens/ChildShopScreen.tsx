import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ANT_MASCOT = require('../../assets/ant_mascot.png');
// We need a grasshopper mascot or placeholder
// Assuming we don't have it, I'll use text or a placeholder emoji for now. 
// User image shows a grasshopper. I will use an emoji 🦗 if no image is available, 
// or just a placeholder View to match layout.

const SHOP_ITEMS = [
    { id: 1, name: 'TV 30분 시청권', price: 20, emoji: '📺' },
    { id: 2, name: '사탕 1개', price: 10, emoji: '🍬' },
    { id: 3, name: '키즈카페 이용권', price: 50, emoji: '🎡', locked: true, shortage: 20 }, // Example logic: price 50, user has 30 => short 20
    { id: 4, name: '스티커 5개', price: 15, emoji: '⭐' },
];

export default function ChildShopScreen() {
    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Header Gradient - Reusing style for consistency */}
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
                {/* Grasshopper Shop Banner */}
                <LinearGradient
                    colors={['#D500F9', '#FF4081']} // Pink/Purple gradient
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.shopBanner}
                >
                    <Text style={styles.grasshopperEmoji}>🦗</Text>
                    <View style={styles.bannerTextContainer}>
                        <Text style={styles.bannerTitle}>베짱이의 보물 가게</Text>
                        <Text style={styles.bannerSubtitle}>와! 곡식을 이만큼 모았어? 멋진 보물로 바꿔줄게!</Text>
                    </View>
                </LinearGradient>

                {/* Shop Items List */}
                <View style={styles.itemsList}>
                    {SHOP_ITEMS.map((item) => (
                        <View key={item.id} style={styles.itemCard}>
                            <View style={styles.itemLeft}>
                                <View style={styles.itemEmojiContainer}>
                                    <Text style={styles.itemEmoji}>{item.emoji}</Text>
                                </View>

                                <View style={styles.itemInfo}>
                                    <Text style={styles.itemName}>{item.name}</Text>
                                    <View style={styles.priceContainer}>
                                        <Text style={styles.grainIcon}>🌾</Text>
                                        <Text style={styles.priceText}>{item.price} <Text style={styles.grainUnit}>곡식</Text></Text>
                                    </View>
                                </View>
                            </View>

                            {/* Button Section */}
                            <View>
                                {item.locked ? (
                                    <View style={styles.lockedButton}>
                                        <MaterialCommunityIcons name="lock-outline" size={18} color="#9E9E9E" style={{ marginBottom: 2 }} />
                                        <Text style={styles.shortageText}>{item.shortage} 부족</Text>
                                    </View>
                                ) : (
                                    <TouchableOpacity>
                                        <LinearGradient
                                            colors={['#D500F9', '#F50057']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={styles.purchaseButton}
                                        >
                                            <MaterialCommunityIcons name="cart-outline" size={20} color="#FFF" style={{ marginRight: 4 }} />
                                            <Text style={styles.purchaseButtonText}>구매</Text>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
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
    shopBanner: {
        borderRadius: 24,
        padding: 25,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -30, // Overlap header
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    grasshopperEmoji: {
        fontSize: 50,
        marginRight: 15,
    },
    bannerTextContainer: {
        flex: 1,
    },
    bannerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 5,
    },
    bannerSubtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.9)',
        lineHeight: 18,
    },
    itemsList: {
        gap: 15,
    },
    itemCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    itemEmojiContainer: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        marginRight: 15,
    },
    itemEmoji: {
        fontSize: 32,
    },
    itemInfo: {
        justifyContent: 'center',
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 6,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    grainIcon: {
        marginRight: 4,
        fontSize: 14,
    },
    priceText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E65100',
    },
    grainUnit: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#555',
    },
    purchaseButton: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
    },
    purchaseButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    lockedButton: {
        width: 80,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
    },
    shortageText: {
        fontSize: 10,
        color: '#9E9E9E',
        marginTop: 2,
    },
});

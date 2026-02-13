import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

/* 
 * UI Component for the Parent's "Gifts" Screen 
 * This screen matches the reference image: Gifticon Store, Product Grid
 */

// Mock Data for Gift Items
const GIFT_ITEMS = [
    { id: '1', name: '바나나우유', price: '1,500', emoji: '🥛', isPopular: true },
    { id: '2', name: '초코우유', price: '1,500', emoji: '🍫', isPopular: false },
    { id: '3', name: '킨더조이', price: '2,000', emoji: '🥚', isPopular: true },
    { id: '4', name: '포카칩', price: '1,800', emoji: '🥔', isPopular: false },
    { id: '5', name: '슈퍼콘', price: '2,500', emoji: '🍦', isPopular: true },
    { id: '6', name: '메로나', price: '1,000', emoji: '🍈', isPopular: false },
    { id: '7', name: '도넛', price: '3,000', emoji: '🍩', isPopular: false },
    { id: '8', name: '쿠키', price: '2,500', emoji: '🍪', isPopular: false },
    { id: '9', name: '젤리', price: '1,500', emoji: '🍬', isPopular: false },
    { id: '10', name: '초콜릿바', price: '2,000', emoji: '🍫', isPopular: false },
    { id: '11', name: '햄버거 세트', price: '6,500', emoji: '🍔', isPopular: false },
    { id: '12', name: '피자 1판', price: '15,000', emoji: '🍕', isPopular: false },
];

const CATEGORIES = ['전체', '편의점', '과자', '아이스크림', '디저트'];

export default function ParentGiftsScreen() {
    const [activeTab, setActiveTab] = React.useState<'store' | 'inventory'>('store');

    // Mock handlers
    const handleUpgrade = () => Alert.alert("알림", "업그레이드 기능은 준비 중입니다.");
    const handleStore = () => setActiveTab('store');
    const handleInventory = () => setActiveTab('inventory');
    const handleItemPress = (item: any) => Alert.alert("상품 선택", `${item.name}을(를) 선택했습니다.`);

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity style={styles.productCard} onPress={() => handleItemPress(item)}>
            {item.isPopular && (
                <View style={styles.popularBadge}>
                    <Text style={styles.popularText}>인기</Text>
                </View>
            )}
            <Text style={styles.productEmoji}>{item.emoji}</Text>
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>₩{item.price}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Header Section */}
            <LinearGradient
                colors={['#448AFF', '#2962FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <SafeAreaView edges={['top']} style={styles.safeAreaHeader}>


                    <View style={styles.headerContent}>
                        <View>
                            <Text style={styles.headerTitle}>부모님 관리 페이지</Text>
                            <Text style={styles.headerSubtitle}>과제와 보상을 관리해주세요</Text>
                        </View>
                        <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
                            <MaterialCommunityIcons name="crown-outline" size={16} color="#FFF" style={{ marginRight: 4 }} />
                            <Text style={styles.upgradeText}>업그레이드</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                style={styles.contentContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

                {/* Child Selection Section - Common for both tabs */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeaderRow}>
                        <Text style={styles.familyEmoji}>👨‍👩‍👧‍👦</Text>
                        <Text style={styles.sectionTitle}>아이 선택</Text>
                    </View>

                    <View style={styles.childCardContainer}>
                        {/* Selected Child Card */}
                        <LinearGradient
                            colors={['#FFA000', '#FFB300']}
                            style={styles.selectedChildCard}
                        >
                            <View style={styles.checkBadge}>
                                <Ionicons name="checkmark-circle" size={24} color="#00C853" />
                            </View>
                            <Text style={styles.childEmoji}>👦</Text>
                            <Text style={styles.childName}>민준</Text>
                            <Text style={styles.childGrain}>곡식 0개</Text>
                        </LinearGradient>
                    </View>
                </View>

                {/* Tab Switch Buttons */}
                <View style={styles.actionButtonsRow}>
                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'store' ? styles.activeTabStore : styles.inactiveTab]}
                        onPress={handleStore}
                    >
                        <MaterialCommunityIcons
                            name="shopping-outline"
                            size={20}
                            color={activeTab === 'store' ? "#FFF" : "#555"}
                            style={{ marginRight: 6 }}
                        />
                        <Text style={[styles.tabButtonText, activeTab === 'store' ? styles.activeTabTextStore : styles.inactiveTabText]}>
                            기프티콘 스토어
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tabButton, activeTab === 'inventory' ? styles.activeTabInventory : styles.inactiveTab]}
                        onPress={handleInventory}
                    >
                        <MaterialCommunityIcons
                            name="treasure-chest"
                            size={20}
                            color={activeTab === 'inventory' ? "#FFF" : "#555"}
                            style={{ marginRight: 6 }}
                        />
                        <Text style={[styles.tabButtonText, activeTab === 'inventory' ? styles.activeTabTextInventory : styles.inactiveTabText]}>
                            내 보물 보관함
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Content based on Active Tab */}
                {activeTab === 'store' ? (
                    <>
                        {/* Gifticon Store Title */}
                        <View style={styles.storeHeader}>
                            <View style={styles.storeTitleRow}>
                                <MaterialCommunityIcons name="cart-outline" size={24} color="#E040FB" style={{ marginRight: 8 }} />
                                <Text style={styles.storeTitle}>기프티콘 스토어</Text>
                            </View>
                            <View style={styles.storageInfo}>
                                <Text style={styles.storageText}>보관함: 0/2</Text>
                                <Text style={styles.upgradeHint}>무제한으로 업그레이드</Text>
                            </View>
                        </View>
                        <Text style={styles.storeSubtitle}>아이에게 줄 선물을 구매하세요 (목표 달성 시 전달됩니다)</Text>

                        {/* Search Bar */}
                        <View style={styles.searchContainer}>
                            <Ionicons name="search" size={20} color="#AAA" style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="상품 검색..."
                                placeholderTextColor="#AAA"
                            />
                        </View>

                        {/* Categories */}
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                            {CATEGORIES.map((cat, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.categoryChip,
                                        index === 0 && styles.activeCategoryChip
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.categoryText,
                                            index === 0 && styles.activeCategoryText
                                        ]}
                                    >
                                        {cat}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/* Product Grid */}
                        <View style={styles.gridContainer}>
                            {GIFT_ITEMS.map((item) => (
                                <View key={item.id} style={styles.gridItemWrapper}>
                                    {renderItem({ item })}
                                </View>
                            ))}
                        </View>
                    </>
                ) : (
                    <>
                        {/* Inventory Section Title */}
                        <View style={styles.storeHeader}>
                            <View style={styles.storeTitleRow}>
                                <MaterialCommunityIcons name="cube-outline" size={24} color="#AA00FF" style={{ marginRight: 8 }} />
                                <Text style={styles.storeTitle}>내 보물 보관함</Text>
                            </View>
                        </View>
                        <Text style={styles.storeSubtitle}>구매한 선물들이 여기 보관되어 있어요 (아이에게는 숨겨져 있어요)</Text>

                        {/* Stats Cards */}
                        <View style={styles.statsContainer}>
                            {/* Card 1: Stored Gifts */}
                            <LinearGradient
                                colors={['#448AFF', '#2979FF']}
                                style={styles.statsCard}
                            >
                                <View style={styles.statsHeader}>
                                    <MaterialCommunityIcons name="package-variant-closed" size={20} color="#FFF" style={{ marginRight: 6 }} />
                                    <Text style={styles.statsTitle}>보관 중인 선물</Text>
                                </View>
                                <Text style={styles.statsValue}>0<Text style={styles.statsUnit}> 개</Text></Text>
                            </LinearGradient>

                            {/* Card 2: Child's Current Grain */}
                            <LinearGradient
                                colors={['#00E676', '#00C853']}
                                style={styles.statsCard}
                            >
                                <View style={styles.statsHeader}>
                                    <MaterialCommunityIcons name="trending-up" size={20} color="#FFF" style={{ marginRight: 6 }} />
                                    <Text style={styles.statsTitle}>아이의 현재 곡식</Text>
                                </View>
                                <Text style={styles.statsValue}>0<Text style={styles.statsUnit}> 개</Text></Text>
                            </LinearGradient>

                            {/* Card 3: Total Spent */}
                            <LinearGradient
                                colors={['#E040FB', '#D500F9', '#FF4081']}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                                style={styles.statsCard}
                            >
                                <View style={styles.statsHeader}>
                                    <MaterialCommunityIcons name="cash-multiple" size={20} color="#FFF" style={{ marginRight: 6 }} />
                                    <Text style={styles.statsTitle}>구매한 금액</Text>
                                </View>
                                <Text style={styles.statsValue}>₩ 0</Text>
                            </LinearGradient>
                        </View>

                        {/* Empty State */}
                        <View style={styles.emptyInventoryCard}>
                            <MaterialCommunityIcons name="package-variant" size={64} color="#8D6E63" style={{ opacity: 0.8, marginBottom: 15 }} />
                            <Text style={styles.emptyInventoryTitle}>보관함이 비어있어요</Text>
                            <Text style={styles.emptyInventorySubtitle}>기프티콘 스토어에서 선물을 구매해보세요!</Text>
                        </View>
                    </>
                )}

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
        paddingBottom: 20,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    safeAreaHeader: {
        paddingHorizontal: 20,
        paddingBottom: 10,
    },
    navBack: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 10,
    },
    navBackText: {
        color: '#FFF',
        fontSize: 16,
        marginLeft: 5,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    upgradeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    upgradeText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 12,
    },
    contentContainer: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    sectionContainer: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    familyEmoji: {
        fontSize: 20,
        marginRight: 8,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    childCardContainer: {
        flexDirection: 'row',
    },
    selectedChildCard: {
        width: 140,
        height: 140,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        shadowColor: '#FFA000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    checkBadge: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: '#FFF',
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    childEmoji: {
        fontSize: 40,
        marginBottom: 10,
    },
    childName: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    childGrain: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 12,
    },
    actionButtonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 5,
    },
    tabButton: {
        flex: 0.49,
        flexDirection: 'row',
        paddingVertical: 12,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    activeTabStore: {
        backgroundColor: '#E040FB',
        elevation: 2,
        shadowColor: '#E040FB',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    activeTabInventory: {
        backgroundColor: '#448AFF', // Blue for inventory
        elevation: 2,
        shadowColor: '#448AFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    inactiveTab: {
        backgroundColor: 'transparent',
    },
    tabButtonText: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    activeTabTextStore: {
        color: '#FFF',
    },
    activeTabTextInventory: {
        color: '#FFF',
    },
    inactiveTabText: {
        color: '#777',
    },
    storeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 5,
    },
    storeTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    storeTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    storageInfo: {
        alignItems: 'flex-end',
    },
    storageText: {
        fontSize: 12,
        color: '#777',
        fontWeight: 'bold',
    },
    upgradeHint: {
        fontSize: 10,
        color: '#FFA000',
        marginTop: 2,
    },
    storeSubtitle: {
        fontSize: 12,
        color: '#777',
        marginBottom: 15,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 48,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: '100%',
        color: '#333',
    },
    categoryScroll: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    categoryChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFF',
        marginRight: 8,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    activeCategoryChip: {
        backgroundColor: '#E040FB',
        borderColor: '#E040FB',
    },
    categoryText: {
        color: '#777',
        fontSize: 14,
        fontWeight: '600',
    },
    activeCategoryText: {
        color: '#FFF',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItemWrapper: {
        width: '48%',
        marginBottom: 15,
    },
    productCard: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
        position: 'relative',
    },
    popularBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#FF3D00',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        zIndex: 1,
    },
    popularText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    productEmoji: {
        fontSize: 48,
        marginTop: 10,
        marginBottom: 10,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#E040FB',
    },
    statsContainer: {
        gap: 12,
        marginBottom: 20,
    },
    statsCard: {
        borderRadius: 16,
        padding: 20,
        marginBottom: 4,
    },
    statsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    statsTitle: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: 'bold',
        opacity: 0.9,
    },
    statsValue: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: 'bold',
    },
    statsUnit: {
        fontSize: 16,
        fontWeight: '600',
    },
    emptyInventoryCard: {
        backgroundColor: '#FFF',
        borderRadius: 24,
        paddingVertical: 50,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    emptyInventoryTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#9E9E9E',
        marginBottom: 8,
    },
    emptyInventorySubtitle: {
        fontSize: 12,
        color: '#BDBDBD',
    },
});

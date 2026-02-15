import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface ShopItem {
    id: number;
    name: string;
    price: number;
    emoji: string;
    locked?: boolean;
    shortage?: number;
}

interface ChildShopItemCardProps {
    item: ShopItem;
}

export default function ChildShopItemCard({ item }: ChildShopItemCardProps) {
    return (
        <View style={styles.itemCard}>
            <View style={styles.itemLeft}>
                <View style={styles.itemEmojiContainer}>
                    <Text style={styles.itemEmoji}>{item.emoji}</Text>
                </View>

                <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <View style={styles.priceContainer}>
                        <Text style={styles.grainIcon}>🌾</Text>
                        <Text style={styles.priceText}>
                            {item.price} <Text style={styles.grainUnit}>곡식</Text>
                        </Text>
                    </View>
                </View>
            </View>

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
    );
}

const styles = StyleSheet.create({
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

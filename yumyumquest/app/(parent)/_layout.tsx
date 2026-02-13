import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function ParentLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#2962FF', // Blue
                tabBarInactiveTintColor: '#757575',
                tabBarStyle: {
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 1,
                    borderTopColor: '#EEEEEE',
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                    marginTop: -2,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: '연결',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="link" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="manage"
                options={{
                    title: '관리',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="cog-outline" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="approval"
                options={{
                    title: '승인',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="bell-outline" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="gifts"
                options={{
                    title: '선물',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name="gift-outline" size={24} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: '설정',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="settings-outline" size={24} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

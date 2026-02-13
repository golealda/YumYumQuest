import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function ChildLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#FF6F00',
                tabBarInactiveTintColor: '#9E9E9E',
                headerShown: false,
                tabBarStyle: {
                    height: Platform.OS === 'ios' ? 90 : 70,
                    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
                    paddingTop: 10,
                    backgroundColor: '#FFFFFF',
                    borderTopWidth: 0,
                    elevation: 10,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: 'bold',
                    marginTop: 4,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: '일기',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons name={focused ? "notebook" : "notebook-outline"} size={26} color={color} />
                    ),
                    tabBarItemStyle: {
                        borderRadius: 10,
                        backgroundColor: 'transparent',
                        marginHorizontal: 10,
                        marginVertical: 5,
                        // Note: tabBarStyle is strictly for the bar, individual item styling in Expo Router / React Navigation 
                        // sometimes needs standard views or focus logic if we want the background shape seen in the screenshot.
                        // However, standard tabs don't easily support the "active pill background" out of the box without Custom Tab Bar.
                        // I will try to approximate or use default behavior first. 
                        // The screenshot shows a distinct background color for the active tab Item. 
                        // I'll stick to simple icons first to ensure functionality, can refine later.
                    }
                }}
            />
            <Tabs.Screen
                name="storage"
                options={{
                    title: '창고',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons name={focused ? "database" : "database-outline"} size={26} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="shop"
                options={{
                    title: '가게',
                    tabBarIcon: ({ color, focused }) => (
                        <MaterialCommunityIcons name={focused ? "storefront" : "storefront-outline"} size={26} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="gifts"
                options={{
                    title: '선물',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "gift" : "gift-outline"} size={26} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: '설정',
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "settings" : "settings-outline"} size={26} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

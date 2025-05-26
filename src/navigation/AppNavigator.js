// src/navigation/AppNavigator.js
import React, { useCallback, useEffect, useState } from 'react';
import { NavigationContainer, useFocusEffect } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import LoginScreen from '../Screens/LoginScreen';
import SignUpScreen from '../Screens/SignUpScreen';
import ForgotPasswordScreen from '../Screens/ForgotPasswordScreen';
import HomeScreen from '../Screens/HomeScreen';
import FavoriteScreen from '../Screens/FavoriteScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import DetailScreen from '../Screens/DetailScreen';
import PersonalDataScreen from '../Screens/PersonalDataScreen';
import MessageScreen from '../Screens/MessageScreen';
import NotificationScreen from '../Screens/NotificationScreen';
import { getUnreadNotificationCount } from '../common/sqlliteService';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs({ route }) {
  const [unreadCount, setUnreadCount] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const checkUnread = async () => {
        const rows = await getUnreadNotificationCount();
        setUnreadCount(rows);
      };
      checkUnread();
    }, [])
  );

  useEffect(() => {
    if (route?.params?.clearBadge) {
      setUnreadCount(0);
    }
  }, [route?.params?.clearBadge]);
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: '#00C48C',
                tabBarInactiveTintColor: '#8e8e93',
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Home') iconName = 'home-outline';
                    if (route.name === 'Favorites') iconName = 'heart-outline';
                    if (route.name === 'Profile') iconName = 'person-outline';
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Favorites" component={FavoriteScreen} />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                    tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
                }}
            />

        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"               
                screenOptions={{ headerShown: false }}
            >
                {/* Authentication */}
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />

                {/* Main app */}
                <Stack.Screen name="MainTabs">{(props) => <MainTabs {...props} />}</Stack.Screen>


                {/* Detail and nested screens */}
                <Stack.Screen name="Detail" component={DetailScreen} />
                <Stack.Screen name="PersonalData" component={PersonalDataScreen} />
                <Stack.Screen name="MessageScreen" component={MessageScreen} />
                <Stack.Screen name="Notification" component={NotificationScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

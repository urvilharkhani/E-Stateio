import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../Screens/HomeScreen';
import FavoriteScreen from '../Screens/FavoriteScreen';
import ProfileScreen from '../Screens/ProfileScreen';
import DetailScreen from '../Screens/DetailScreen';
import PersonalDataScreen from '../Screens/PersonalDataScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let icon;

          switch (route.name) {
            case 'Home':
              icon = 'home-outline';
              break;
            case 'Favorites':
              icon = 'heart-outline';
              break;
            case 'Messages':
              icon = 'chatbubble-outline';
              break;
            case 'Profile':
              icon = 'person-outline';
              break;
          }

          return <Ionicons name={icon} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favorites" component={FavoriteScreen} />

      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="Detail" component={DetailScreen} />
      <Stack.Screen name="PersonalData" component={PersonalDataScreen} />
</Stack.Navigator>
    </NavigationContainer>
  );
}

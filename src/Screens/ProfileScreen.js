// src/screens/ProfileScreen.js
import React, { useState, useCallback, useLayoutEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    FlatList,
    StatusBar,
    Platform,
    Alert
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const options = [
    { id: '1', label: 'Personal data', icon: 'person-outline', screen: 'PersonalData' },
    { id: '2', label: 'Settings',      icon: 'settings-outline' },
    { id: '3', label: 'Notification',  icon: 'notifications-outline' },
    { id: '4', label: 'Privacy & policy', icon: 'shield-checkmark-outline' },
    { id: '5', label: 'About us',      icon: 'information-circle-outline' },
    { id: '6', label: 'FAQ',           icon: 'help-circle-outline' },
];

export default function ProfileScreen() {
    const navigation = useNavigation();

    const [name, setName]         = useState('Hafiz Dzaki');
    const [location, setLocation] = useState('Samarinda, Indonesia');
    const [avatar, setAvatar]     = useState('https://i.pravatar.cc/100?img=3');

    // Load saved profile each time screen gains focus
    useFocusEffect(
        useCallback(() => {
            (async () => {
                const data = await AsyncStorage.getItem('@profile_data');
                if (data) {
                    const parsed = JSON.parse(data);
                    setName(parsed.name || name);
                    setAvatar(parsed.image || avatar);
                }
            })();
        }, [])
    );

    // Logout handler
    const handleLogout = async () => {
        Alert.alert(
            'Log out',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Log Out',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.removeItem('@profile_data');
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        });
                    }
                }
            ]
        );
    };

    // Add logout icon button in header
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={handleLogout}
                    style={{ marginRight: RFValue(16) }}
                >
                    <Ionicons
                        name="log-out-outline"
                        size={RFValue(22)}
                        color="#333"
                    />
                </TouchableOpacity>
            )
        });
    }, [navigation, handleLogout]);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={styles.option}
            onPress={() => item.screen && navigation.navigate(item.screen)}
        >
            <View style={styles.iconWrapper}>
                <Ionicons name={item.icon} size={RFValue(18)} color="#00C48C" />
            </View>
            <Text style={styles.optionLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={RFValue(16)} color="#aaa" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.container}>
                <Text style={styles.title}>Profile</Text>

                <View style={styles.profile}>
                    <Image source={{ uri: avatar }} style={styles.avatar} />
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.location}>{location}</Text>
                </View>

                <FlatList
                    data={options}
                    keyExtractor={item => item.id}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    },
    container: {
        flex: 1,
        paddingHorizontal: RFValue(20),
    },
    title: {
        fontSize: RFValue(18),
        fontWeight: 'bold',
        marginBottom: RFValue(20),
        textAlign: 'center',
    },
    profile: {
        alignItems: 'center',
        marginBottom: RFValue(20),
    },
    avatar: {
        width: RFValue(70),
        height: RFValue(70),
        borderRadius: RFValue(35),
        marginBottom: RFValue(10),
    },
    name: {
        fontSize: RFValue(16),
        fontWeight: 'bold',
    },
    location: {
        fontSize: RFValue(12),
        color: '#777',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: RFValue(12),
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    iconWrapper: {
        width: RFValue(32),
        height: RFValue(32),
        backgroundColor: '#E5F8F0',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: RFValue(16),
        marginRight: RFValue(12),
    },
    optionLabel: {
        flex: 1,
        fontSize: RFValue(14),
    },
});

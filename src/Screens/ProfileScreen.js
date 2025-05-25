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
import * as ImagePicker from 'expo-image-picker';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@profile_data';

const options = [
    { id: '1', label: 'Personal data', icon: 'person-outline', screen: 'PersonalData' },
    { id: '2', label: 'Settings', icon: 'settings-outline' },
    { id: '3', label: 'Notification', icon: 'notifications-outline' },
    { id: '4', label: 'Privacy & policy', icon: 'shield-checkmark-outline' },
    { id: '5', label: 'About us', icon: 'information-circle-outline' },
    { id: '6', label: 'FAQ', icon: 'help-circle-outline' },
];

export default function ProfileScreen() {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [location, setLocation] = useState('');
    const [avatar, setAvatar] = useState(require('../assets/images/defaultProfileIcon.png'));

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const data = await AsyncStorage.getItem(STORAGE_KEY);
                if (data) {
                    const parsed = JSON.parse(data);
                    setName(parsed.name || '');
                    setLocation(parsed.address || '');
                    if (parsed.image) setAvatar(parsed.image);
                    else setAvatar(require('../assets/images/defaultProfileIcon.png'));
                } else {
                    setAvatar(require('../assets/images/defaultProfileIcon.png'));
                }
            })();
        }, [])
    );

    const handleLogout = () => {
        Alert.alert(
            'Log out',
            'Are you sure you want to log out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Log Out',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.removeItem(STORAGE_KEY);
                        navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                    }
                }
            ]
        );
    };

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
            <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'} />

            <View style={styles.header}>
                {/* Left spacer to balance the logout icon on the right */}
                <View style={{ width: RFValue(30) }} />
                <Text style={styles.headerTitle}>Profile</Text>
                <TouchableOpacity onPress={handleLogout} style={styles.headerLogoutIcon}>
                    <Ionicons name="log-out-outline" size={RFValue(22)} color="#333" />
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                <View style={styles.profile}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={typeof avatar === 'string' ? { uri: avatar } : avatar} style={styles.avatar} />
                    </View>
                    <Text style={styles.name}>{name}</Text>
                    {location ? <Text style={styles.location}>{location}</Text> : null}
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: RFValue(60),
        paddingHorizontal: RFValue(16),
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: RFValue(20),
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        textAlign: 'center',
    },

    headerLogoutIcon: {
        padding: RFValue(4),
    },
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

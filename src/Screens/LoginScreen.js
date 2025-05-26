import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TextInput,
    Button,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Platform,
    StatusBar,
    Image,
} from 'react-native';
import { validateUserLogin, getDb } from '../common/sqlliteService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFValue } from 'react-native-responsive-fontsize';

import { Ionicons } from '@expo/vector-icons'

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleLogin = async () => {
        try {
            const user = await validateUserLogin(email, password);
            if (user) {
                await AsyncStorage.setItem('@logged_in_email', user?.email);
                navigation.replace('MainTabs');
            } else {
                Alert.alert('Login failed', 'Invalid email or password');
            }
        } catch (err) {
            console.error(err);
            Alert.alert('Error', 'Something went wrong');
        }
    };
    const deleteAllData = async () => {
        const db = await getDb();
        await db.runAsync('DELETE FROM users');
        await db.runAsync('DELETE FROM messages');
        await db.runAsync('DELETE FROM favorites');
        console.log('🔥 All data deleted.');
    };
    useEffect(() => {
        const debugAll = async () => {
            console.log('🔍 Running debugAll...');
            // await deleteAllData();
            try {
                const db = await getDb();
                console.log('📦 Got DB');
                const users = await db.getAllAsync('SELECT * FROM users');
                const favorites = await db.getAllAsync('SELECT * FROM favorites');
                const messages = await db.getAllAsync('SELECT * FROM messages');
                console.log('👤 USERS:', users);
                console.log('⭐ FAVORITES:', favorites);
                console.log('💬 MESSAGES:', messages);
            } catch (error) {
                console.error(' DEBUG ERROR:', error);
            }
        };
        if (__DEV__) {
            debugAll();
        }
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={{flex:1,paddingHorizontal:RFValue(20)}}>
                
            
            <View style={styles.logoContainer}>
                <Image source={require('../../assets/icon.png')} style={styles.logoImg} />
                <Text style={styles.logoText}>Estatio</Text>
            </View>
            <Text style={styles.subtitle}>Login to your account</Text>
            <View style={styles.form}>
                
                <View style={styles.inputWrapper}>
                    <Ionicons name="mail-outline" style={styles.inputIcon} size={20} color="#B0B0B0" />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#B0B0B0"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                
                <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed-outline" style={styles.inputIcon} size={20} color="#B0B0B0" />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        placeholderTextColor="#B0B0B0"
                        secureTextEntry={!passwordVisible}
                        value={password}
                        onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.passVisibleWrapper}>
                        <Ionicons name={passwordVisible ? 'eye-outline' : 'eye-off-outline'} size={RFValue(12)} color="#aaa" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ForgotPassword')}
                    style={styles.forgotLink}
                >
                    <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
            </View>
            
            <View style={styles.signupRow}>
                <Text style={styles.signupText}>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.signupLink}> Sign up</Text>
                </TouchableOpacity>
            </View>
       </View> 
       </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        // alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? RFValue(StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 10) : 0,
        paddingHorizontal: RFValue(18),
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: RFValue(38),
        marginBottom: RFValue(8),
    },
    logoImg: {
        width: RFValue(64),
        height: RFValue(64),
        resizeMode: 'contain',
        marginBottom: RFValue(2),
    },
    logoText: {
        fontSize: RFValue(22),
        fontWeight: 'bold',
        color: '#00C48C',
        letterSpacing: RFValue(0.5),
    },
    subtitle: {
        fontSize: RFValue(15),
        fontWeight: '600',
        color: '#222',
        marginBottom: RFValue(18),
        textAlign:'center'
    },
    form: {
        width: '100%',
        marginBottom: RFValue(14),
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: RFValue(1),
        borderColor: '#00C48C',
        borderRadius: RFValue(25),
        paddingHorizontal: RFValue(14),
        marginBottom: RFValue(12),
        backgroundColor: '#fff',
    },
    inputIcon: {
        fontSize: RFValue(18),
        marginRight: RFValue(8),
        color: '#B0B0B0',
    },
    input: {
        flex: 1,
        height: RFValue(44),
        fontSize: RFValue(14),
        color: '#222',
    },
    forgotLink: {
        alignSelf: 'flex-end',
        marginBottom: RFValue(10),
    },
    forgotText: {
        color: '#BDBDBD',
        fontSize: RFValue(13),
        fontWeight: '400',
    },
    loginButton: {
        backgroundColor: '#00C48C',
        borderRadius: RFValue(24),
        height: RFValue(48),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: RFValue(8),
        marginBottom: RFValue(10),
        shadowColor: '#00C48C',
        shadowOffset: { width: 0, height: RFValue(2) },
        shadowOpacity: 0.15,
        shadowRadius: RFValue(5),
        elevation: 2,
    },
    loginButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: RFValue(16),
    },
    signupRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: RFValue(8),
    },
    signupText: {
        color: '#BDBDBD',
        fontSize: RFValue(13),
    },
    signupLink: {
        color: '#00C48C',
        fontWeight: 'bold',
        fontSize: RFValue(13),
    },
    passVisibleWrapper: {
        marginLeft: RFValue(8),
        padding: RFValue(4),
    },
});

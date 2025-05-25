import React, { useState } from 'react';
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
    StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFValue } from 'react-native-responsive-fontsize';

const CRED_KEY = '@user_credentials';

export default function ForgotPasswordScreen({ navigation }) {
    const [email,       setEmail]       = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirm,     setConfirm]     = useState('');

    const handleReset = async () => {
        if (!email || !newPassword) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }
        if (newPassword !== confirm) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        const credsJson = await AsyncStorage.getItem(CRED_KEY);
        const creds = credsJson ? JSON.parse(credsJson) : {};
        if (!creds.email || creds.email !== email) {
            Alert.alert('Error', 'Email not found');
            return;
        }
    
        creds.password = newPassword;
        await AsyncStorage.setItem(CRED_KEY, JSON.stringify(creds));

        Alert.alert(
            'Success',
            'Password has been reset.',
            [{ text: 'OK', onPress: () => navigation.replace('Login') }]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Reset Password</Text>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="New password"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm password"
                    secureTextEntry
                    value={confirm}
                    onChangeText={setConfirm}
                />
                  <TouchableOpacity style={{backgroundColor:'#007AFF',padding:RFValue(10),justifyContent:'center',alignItems:'center',borderRadius:RFValue(10)}} onPress={handleReset}>
                    <Text style={{color:'white',fontWeight:'600',fontSize:RFValue(12)}}>{'Reset Password'}</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backLink}
            >
                <Text style={styles.backText}>Back to Login</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop:
            Platform.OS === 'android'
                ? StatusBar.currentHeight + 10
                : 0,
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 22,
        fontWeight: '600',
        marginVertical: 20
    },
    form: {
        width: '80%'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 16
    },
    backLink: {
        marginTop: 16
    },
    backText: {
        color: '#007AFF'
    }
});

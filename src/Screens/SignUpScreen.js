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

const PROFILE_KEY = '@profile_data';
const CRED_KEY    = '@user_credentials';

export default function SignUpScreen({ navigation }) {
    const [name,     setName]     = useState('');
    const [email,    setEmail]    = useState('');
    const [phone,    setPhone]    = useState('');
    const [password, setPassword] = useState('');
    const [confirm,  setConfirm]  = useState('');

    const handleSignUp = async () => {
        if (!name || !email || !phone || !password) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }
        if (password !== confirm) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        // 1) Save profile data (name, email, phone) under PROFILE_KEY
        await AsyncStorage.setItem(
            PROFILE_KEY,
            JSON.stringify({ name, email, phone })
        );

        // 2) Save credentials separately under CRED_KEY
        await AsyncStorage.setItem(
            CRED_KEY,
            JSON.stringify({ email, password })
        );

        // 3) Enter main app (tabs) and clear auth stack
        navigation.replace('MainTabs');
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Phone"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    secureTextEntry
                    value={confirm}
                    onChangeText={setConfirm}
                />
                <Button title="Sign Up" onPress={handleSignUp} />
            </View>
            <View style={styles.footer}>
                <Text>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.link}> Log In</Text>
                </TouchableOpacity>
            </View>
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
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 24
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
    footer: {
        flexDirection: 'row',
        marginTop: 24
    },
    link: {
        color: '#007AFF',
        fontWeight: '600'
    }
});

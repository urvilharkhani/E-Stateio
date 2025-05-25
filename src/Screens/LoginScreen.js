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

const CRED_KEY = '@user_credentials';

export default function LoginScreen({ navigation }) {
    const [email,    setEmail]    = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        const credsJson = await AsyncStorage.getItem(CRED_KEY);
        const creds = credsJson ? JSON.parse(credsJson) : {};
        if (creds.email === email && creds.password === password) {
            navigation.replace('MainTabs');
        } else {
            Alert.alert('Login failed', 'Invalid email or password');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Welcome Back</Text>
            <View style={styles.form}>
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
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <Button title="Log In" onPress={handleLogin} />
                <TouchableOpacity
                    onPress={() => navigation.navigate('ForgotPassword')}
                    style={styles.forgotLink}
                >
                    <Text style={styles.forgotText}>Forgot password?</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.footer}>
                <Text>Don't have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.link}> Sign Up</Text>
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
    forgotLink: {
        marginTop: 8,
        alignSelf: 'flex-end'
    },
    forgotText: {
        color: '#007AFF',
        fontSize: 14
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

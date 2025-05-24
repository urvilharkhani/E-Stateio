// src/screens/SignUpScreen.js
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

export default function SignUpScreen({ navigation }) {
    const [email, setEmail]         = useState('');
    const [password, setPassword]   = useState('');
    const [confirm, setConfirm]     = useState('');

    const handleSignUp = () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }
        if (password !== confirm) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }
        // TODO: integrate real sign-up here
        navigation.replace('Profile');
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Create Account</Text>
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
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0,
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

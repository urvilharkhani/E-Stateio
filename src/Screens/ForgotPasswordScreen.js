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
    StatusBar,
    Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons'
import { getUserProfile, updateUserPassword } from '../common/sqlliteService';


const CRED_KEY = '@user_credentials';

export default function ForgotPasswordScreen({ navigation }) {
    const [email,       setEmail]       = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirm,     setConfirm]     = useState('');
    const [oldPassword, setOldPassword] = useState('');
const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPassVisible, setConfirmPassVisible] = useState(false);
 
  
const handleReset = async () => {
  if (!email || !oldPassword || !newPassword || !confirm) {
    Alert.alert('Error', 'Please fill all fields');
    return;
  }

  if (newPassword !== confirm) {
    Alert.alert('Error', 'New passwords do not match');
    return;
  }

  const user = await getUserProfile(email);
  if (!user) {
    Alert.alert('Error', 'No account found with this email');
    return;
  }

  if (user.password !== oldPassword) {
    Alert.alert('Error', 'Old password is incorrect');
    return;
  }

  await updateUserPassword(email, newPassword);

  Alert.alert(
    'Success',
    'Password updated successfully.',
    [{ text: 'OK', onPress: () => navigation.replace('Login') }]
  );
};

    // const handleReset = async () => {
    //     if (!email || !newPassword) {
    //         Alert.alert('Error', 'Please fill all fields');
    //         return;
    //     }
    //     if (newPassword !== confirm) {
    //         Alert.alert('Error', 'Passwords do not match');
    //         return;
    //     }
    //     const credsJson = await AsyncStorage.getItem(CRED_KEY);
    //     const creds = credsJson ? JSON.parse(credsJson) : {};
    //     if (!creds.email || creds.email !== email) {
    //         Alert.alert('Error', 'Email not found');
    //         return;
    //     }
    
    //     creds.password = newPassword;
    //     await AsyncStorage.setItem(CRED_KEY, JSON.stringify(creds));

    //     Alert.alert(
    //         'Success',
    //         'Password has been reset.',
    //         [{ text: 'OK', onPress: () => navigation.replace('Login') }]
    //     );
    // };

    return (
        <SafeAreaView style={styles.container}>
            {/* Logo and App Name */}
            <View style={styles.logoContainer}>
                <Image source={require('../../assets/icon.png')} style={styles.logoImg} />
                <Text style={styles.logoText}>Estatio</Text>
            </View>
            <Text style={styles.subtitle}>Reset your password</Text>
            <View style={styles.form}>
                {/* Email Input with Icon */}
                <View style={styles.inputWrapper}>
                    <Ionicons name="mail-outline" style={styles.inputIcon} size={20} color="#B0B0B0" />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email"
                        placeholderTextColor="#B0B0B0"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                {/* Old Password Input with Icon and Eye Toggle */}
                <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed-outline" style={styles.inputIcon} size={20} color="#B0B0B0" />
                    <TextInput
                        style={styles.input}
                        placeholder="Old Password"
                        placeholderTextColor="#B0B0B0"
                        secureTextEntry={!oldPasswordVisible}
                        value={oldPassword}
                        onChangeText={setOldPassword}
                    />
                    <TouchableOpacity onPress={() => setOldPasswordVisible(!oldPasswordVisible)} style={styles.passVisibleWrapper}>
                        <Ionicons name={oldPasswordVisible ? 'eye-outline' : 'eye-off-outline'} size={RFValue(12)} color="#aaa" />
                    </TouchableOpacity>
                </View>
                {/* New Password Input with Icon and Eye Toggle */}
                <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed-outline" style={styles.inputIcon} size={20} color="#B0B0B0" />
                    <TextInput
                        style={styles.input}
                        placeholder="New password"
                        placeholderTextColor="#B0B0B0"
                        secureTextEntry={!passwordVisible}
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                    <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.passVisibleWrapper}>
                        <Ionicons name={passwordVisible ? 'eye-outline' : 'eye-off-outline'} size={RFValue(12)} color="#aaa" />
                    </TouchableOpacity>
                </View>
                {/* Confirm Password Input with Icon and Eye Toggle */}
                <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed-outline" style={styles.inputIcon} size={20} color="#B0B0B0" />
                    <TextInput
                        style={styles.input}
                        placeholder="Confirm Password"
                        placeholderTextColor="#B0B0B0"
                        secureTextEntry={!confirmPassVisible}
                        value={confirm}
                        onChangeText={setConfirm}
                    />
                    <TouchableOpacity onPress={() => setConfirmPassVisible(!confirmPassVisible)} style={styles.passVisibleWrapper}>
                        <Ionicons name={confirmPassVisible ? 'eye-outline' : 'eye-off-outline'} size={RFValue(12)} color="#aaa" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.loginButton} onPress={handleReset}>
                    <Text style={styles.loginButtonText}>Reset Password</Text>
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
        backgroundColor: '#fff',
        alignItems: 'center',
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
    backLink: {
        marginTop: RFValue(14),
        alignSelf: 'center',
    },
    backText: {
        color: '#00C48C',
        fontWeight: 'bold',
        fontSize: RFValue(14),
    },
    passVisibleWrapper: {
        marginLeft: RFValue(8),
        padding: RFValue(4),
    },
});

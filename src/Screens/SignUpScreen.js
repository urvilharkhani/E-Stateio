import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signUpUser } from '../common/sqlliteService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFValue } from 'react-native-responsive-fontsize';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleSignUp = async () => {
    if (!name || !email || !phone || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      await signUpUser({ name, email, phone, password });
      await AsyncStorage.setItem('@logged_in_email', email);
      navigation.replace('MainTabs');
    } catch (error) {
      console.error(error);
      Alert.alert('Signup failed', 'Email may already exist');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Logo and App Name */}
      <View style={styles.logoContainer}>
        <Image source={require('../../assets/icon.png')} style={styles.logoImg} />
        <Text style={styles.logoText}>Estatio</Text>
      </View>
      <Text style={styles.subtitle}>Create your account</Text>
      <View style={styles.form}>
        {/* Name */}
        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" style={styles.inputIcon} size={RFValue(22)} color="#B0B0B0" />
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#B0B0B0"
            value={name}
            onChangeText={setName}
          />
        </View>
        {/* Email */}
        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" style={styles.inputIcon} size={RFValue(22)} color="#B0B0B0" />
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
        {/* Phone */}
        <View style={styles.inputWrapper}>
          <Ionicons name="call-outline" style={styles.inputIcon} size={RFValue(22)} color="#B0B0B0" />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            placeholderTextColor="#B0B0B0"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>
        {/* Password */}
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" style={styles.inputIcon} size={RFValue(22)} color="#B0B0B0" />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#B0B0B0"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        {/* Confirm Password */}
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" style={styles.inputIcon} size={RFValue(22)} color="#B0B0B0" />
          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor="#B0B0B0"
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
          />
        </View>
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
          <Text style={styles.signUpButtonText}>{'Sign Up'}</Text>
        </TouchableOpacity>
      </View>
      {/* Footer */}
      <View style={styles.signupRow}>
        <Text style={styles.signupText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signupLink}> Log in</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: RFValue(22),
    marginRight: RFValue(8),
    color: '#B0B0B0',
  },
  input: {
    flex: 1,
    height: RFValue(44),
    fontSize: RFValue(14),
    color: '#222',
  },
  signUpButton: {
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
  signUpButtonText: {
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
});

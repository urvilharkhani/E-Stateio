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
} from 'react-native';
import { signUpUser } from '../common/sqlliteService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons'

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPassVisible, setConfirmPassVisible] = useState(false);
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
          maxLength={10}
          onChangeText={setPhone}
        />
        <View style={{ justifyContent: 'center', }}>

          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)} style={styles.passVisibleWrapper}>
            <Ionicons name={passwordVisible ? 'eye-outline' : 'eye-off-outline'} size={RFValue(12)} color="#aaa" />
          </TouchableOpacity>
        </View>
        <View style={{ justifyContent: 'center', }}>

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            secureTextEntry={!confirmPassVisible}
            value={confirm}
            onChangeText={setConfirm}
          />
          <TouchableOpacity onPress={() => setConfirmPassVisible(!confirmPassVisible)} style={styles.passVisibleWrapper}     >
                   <Ionicons name={confirmPassVisible ? 'eye-outline' : 'eye-off-outline'} size={RFValue(12)} color="#aaa" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={{ backgroundColor: '#007AFF', padding: RFValue(10), justifyContent: 'center', alignItems: 'center', borderRadius: RFValue(10) }} onPress={handleSignUp}>
          <Text style={{ color: 'white', fontWeight: '600', fontSize: RFValue(12) }}>{'Sign Up'}</Text>
        </TouchableOpacity>
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 24,
  },
  form: {
    width: '80%',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    marginTop: 24,
  },
  link: {
    color: '#007AFF',
    fontWeight: '600',
  },
  passVisibleWrapper:{ position: 'absolute', alignSelf: 'flex-end', top:Platform.OS=='android'? RFValue(10):RFValue(8), right: RFValue(8) }
});

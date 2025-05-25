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
} from 'react-native';
import { validateUserLogin, getDb } from '../common/sqlliteService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFValue } from 'react-native-responsive-fontsize';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
                <TouchableOpacity style={{backgroundColor:'#007AFF',padding:RFValue(10),justifyContent:'center',alignItems:'center',borderRadius:RFValue(10)}} onPress={handleLogin}>
                    <Text style={{color:'white',fontWeight:'600',fontSize:RFValue(12)}}>{'Log In'}</Text>
                </TouchableOpacity>
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
    forgotLink: {
        marginTop: 8,
        alignSelf: 'flex-end',
    },
    forgotText: {
        color: '#007AFF',
        fontSize: 14,
    },
    footer: {
        flexDirection: 'row',
        marginTop: 24,
    },
    link: {
        color: '#007AFF',
        fontWeight: '600',
    },
});

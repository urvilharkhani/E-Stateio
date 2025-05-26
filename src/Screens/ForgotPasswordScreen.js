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
                <View style={{ justifyContent: 'center', }}>

          <TextInput
            style={styles.input}
            placeholder="Old Password"
            secureTextEntry={!oldPasswordVisible}
            value={oldPassword}
            onChangeText={setOldPassword}
          />
          <TouchableOpacity onPress={() => setOldPasswordVisible(!oldPasswordVisible)} style={styles.passVisibleWrapper}     >
                   <Ionicons name={oldPasswordVisible ? 'eye-outline' : 'eye-off-outline'} size={RFValue(12)} color="#aaa" />
          </TouchableOpacity>
        </View>
                <View style={{ justifyContent: 'center', }}>

          <TextInput
                    style={styles.input}
                    placeholder="New password"
                    secureTextEntry={!passwordVisible}
                    value={newPassword}
                    onChangeText={setNewPassword}
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
    },
     passVisibleWrapper:{ position: 'absolute', alignSelf: 'flex-end', top:Platform.OS=='android'? RFValue(10):RFValue(8), right: RFValue(8) }

});

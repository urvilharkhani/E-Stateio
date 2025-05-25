import React, { useEffect, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  getUserProfile,
  updateUserProfile
} from '../common/sqlliteService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PersonalDataScreen() {
  const navigation = useNavigation();
  const defaultImage = require('../assets/images/defaultProfileIcon.png');

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: 'Thunder Bay, ON',
    image: defaultImage,
  });

  useFocusEffect(
    React.useCallback(() => {
      (async () => {
        const storedEmail = await AsyncStorage.getItem('@logged_in_email');
        if (!storedEmail) return;

        const dbProfile = await getUserProfile(storedEmail);
        if (dbProfile) {
          setProfile(prev => ({
            ...prev,
            name: dbProfile.name,
            email: dbProfile.email,
            phone: dbProfile.phone,
            image: dbProfile.image ? { uri: dbProfile.image } : defaultImage,
          }));
        }
      })();
    }, [])
  );

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'We need permission to access your photos.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const uri = result.assets[0].uri;
      setProfile(prev => ({ ...prev, image: { uri } }));
    }
  };

  const handleSave = async () => {
    const storedEmail = await AsyncStorage.getItem('@logged_in_email');
    if (!storedEmail) return;

    let imageToSave = '';

    if (profile.image && profile.image.uri && typeof profile.image.uri === 'string') {
      imageToSave = profile.image.uri;
    }

    await updateUserProfile({
      email: storedEmail,
      name: profile.name,
      phone: profile.phone,
      profile_image: imageToSave,
    });

    Alert.alert('Saved!', 'Your personal data was updated.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    
    <SafeAreaView style={{ flex: 1 ,backgroundColor:'#fff'}}>
      <View style={styles.container}>


        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={RFValue(20)} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Personal Data</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.avatarWrapper}>
          <Image source={profile.image} style={styles.avatar} />
          <TouchableOpacity style={styles.cameraIcon} onPress={handlePickImage}>
            <Ionicons name="camera" size={RFValue(16)} color="#00C48C" />
          </TouchableOpacity>
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={RFValue(18)} color="#ccc" />
          <TextInput
            style={styles.input}
            value={profile.name}
            onChangeText={text => setProfile(prev => ({ ...prev, name: text }))}
            placeholder="Enter your name"
          />
        </View>

        <View style={styles.inputWrapperDisabled}>
          <Ionicons name="mail-outline" size={RFValue(18)} color="#ccc" />
          <TextInput style={styles.disabledText} value={profile.email} editable={false} />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="call-outline" size={RFValue(18)} color="#ccc" />
          <TextInput
            style={styles.input}
            value={profile.phone}
            onChangeText={text => setProfile(prev => ({ ...prev, phone: text }))}
            placeholder="Enter your phone"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputWrapperDisabled}>
          <Ionicons name="location-outline" size={RFValue(18)} color="#ccc" />
          <TextInput style={styles.disabledText} value={profile.address} editable={false} />
        </View>
      </View>   </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingHorizontal: RFValue(20),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: RFValue(20),
  },
  headerTitle: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
  },
  saveText: {
    color: '#00C48C',
    fontSize: RFValue(14),
    fontWeight: 'bold',
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: RFValue(20),
  },
  avatar: {
    width: RFValue(80),
    height: RFValue(80),
    borderRadius: RFValue(40),
  },
  cameraIcon: {
    position: 'absolute',
    bottom: -10,
    alignSelf: 'center',
    elevation: 3,
    right: RFValue(10),
    backgroundColor: '#fff',
    padding: RFValue(5),
    borderRadius: RFValue(20),
    borderWidth: 1,
    borderColor: '#00C48C',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#00C48C',
    borderWidth: 1,
    borderRadius: RFValue(10),
    padding: RFValue(10),
    marginBottom: RFValue(15),
  },
  inputWrapperDisabled: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: RFValue(10),
    padding: RFValue(10),
    marginBottom: RFValue(10),
  },
  input: {
    flex: 1,
    marginLeft: RFValue(10),
    fontSize: RFValue(14),
  },
  disabledText: {
    flex: 1,
    marginLeft: RFValue(10),
    fontSize: RFValue(13),
    color: '#999',
  },
});

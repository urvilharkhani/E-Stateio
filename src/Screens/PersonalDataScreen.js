import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const STORAGE_KEY = '@profile_data';

const PersonalDataScreen = () => {
  const navigation = useNavigation();

  const [originalName, setOriginalName] = useState('');
  const [name, setName] = useState('');
  const [showSave, setShowSave] = useState(false);

  const [profile, setProfile] = useState({
    email: 'hafizdzaki@gmail.com',
    phone: '+62 0862514245',
    address: 'Teuku umar street no f.11 east borneo samarinda indonesia',
    image: 'https://i.pravatar.cc/100?img=3',
  });

  useEffect(() => {
    const loadProfile = async () => {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        setOriginalName(parsed.name || '');
        setName(parsed.name || '');
        setProfile((prev) => ({
          ...prev,
          ...parsed,
        }));
      }
    };
    loadProfile();
  }, []);

  const handleChangeName = (text) => {
    setName(text);
    setShowSave(text !== originalName && text.length > 0);
  };

  const handleSave = async () => {
    const updated = { ...profile, name };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setOriginalName(name);
    setShowSave(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={RFValue(20)} color="black" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Personal Data</Text>

        {showSave ? (
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ width: RFValue(40) }} />
        )}
      </View>

      <View style={styles.avatarWrapper}>
        <Image source={{ uri: profile.image }} style={styles.avatar} />
        <TouchableOpacity style={styles.cameraIcon}>
          <Ionicons name="camera" size={RFValue(16)} color="#00C48C" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputWrapper}>
        <Ionicons name="person-outline" size={RFValue(18)} color="#ccc" />
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={handleChangeName}
          placeholder="Enter your name"
        />
      </View>

      <View style={styles.inputWrapperDisabled}>
        <Ionicons name="mail-outline" size={RFValue(18)} color="#ccc" />
        <Text style={styles.disabledText}>{profile.email}</Text>
      </View>

      <View style={styles.inputWrapperDisabled}>
        <Ionicons name="call-outline" size={RFValue(18)} color="#ccc" />
        <Text style={styles.disabledText}>{profile.phone}</Text>
      </View>

      <View style={styles.inputWrapperDisabled}>
        <Ionicons name="location-outline" size={RFValue(18)} color="#ccc" />
        <Text style={styles.disabledText}>{profile.address}</Text>
      </View>
    </SafeAreaView>
  );
};

export default PersonalDataScreen;

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
    bottom: 0,
    right: RFValue(110),
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
    marginLeft: RFValue(10),
    fontSize: RFValue(13),
    color: '#999',
  },
});

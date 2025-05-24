import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  Platform,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const options = [
  { id: '1', label: 'Personal data', icon: 'person-outline', screen: 'PersonalData' },
  { id: '2', label: 'Settings', icon: 'settings-outline' },
  { id: '3', label: 'Notification', icon: 'notifications-outline' },
  { id: '4', label: 'Privacy & policy', icon: 'shield-checkmark-outline' },
  { id: '5', label: 'About us', icon: 'information-circle-outline' },
  { id: '6', label: 'FAQ', icon: 'help-circle-outline' },
];

const ProfileScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('Hafiz Dzaki');
  const [location, setLocation] = useState('Samarinda, Indonesia');
  const [avatar, setAvatar] = useState('https://i.pravatar.cc/100?img=3');

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        const data = await AsyncStorage.getItem('@profile_data');
        if (data) {
          const parsed = JSON.parse(data);
          setName(parsed?.name || 'Hafiz Dzaki');
          setAvatar(parsed?.image || 'https://i.pravatar.cc/100?img=3');
        }
      };
      loadProfile();
    }, [])
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.option}
      onPress={() => item.screen && navigation.navigate(item.screen)}
    >
      <View style={styles.iconWrapper}>
        <Ionicons name={item.icon} size={RFValue(18)} color="#00C48C" />
      </View>
      <Text style={styles.optionLabel}>{item.label}</Text>
      <Ionicons name="chevron-forward" size={RFValue(16)} color="#aaa" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.profile}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.location}>{location}</Text>
      </View>

      <FlatList
        data={options}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
 mainContainer:{
    flex:1,backgroundColor: '#fff',
  },container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0,
    paddingHorizontal: RFValue(20),
  },
  title: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    marginBottom: RFValue(20),
  },
  profile: {
    alignItems: 'center',
    marginBottom: RFValue(20),
  },
  avatar: {
    width: RFValue(70),
    height: RFValue(70),
    borderRadius: RFValue(35),
    marginBottom: RFValue(10),
  },
  name: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
  },
  location: {
    fontSize: RFValue(12),
    color: '#777',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: RFValue(12),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  iconWrapper: {
    width: RFValue(32),
    height: RFValue(32),
    backgroundColor: '#E5F8F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RFValue(16),
    marginRight: RFValue(12),
  },
  optionLabel: {
    flex: 1,
    fontSize: RFValue(14),
  },
});

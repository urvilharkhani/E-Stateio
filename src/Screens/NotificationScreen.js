import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

const staticNotifications = [
  {
    id: '1',
    icon: 'chatbubble-ellipses-outline',
    title: 'Reply Message',
    message: 'Sebastian reply your message',
    date: 'Mon',
    color: '#00C48C',
  },
  {
    id: '2',
    icon: 'home-outline',
    title: 'New Property Home',
    message: 'Hi, some new property for home in ...',
    date: 'Sun',
    color: '#4A90E2',
  },
  {
    id: '3',
    icon: 'business-outline',
    title: 'New Property Villa',
    message: 'Hi, some new property for villa in ...',
    date: '2 Feb',
    color: '#F5A623',
  },
  {
    id: '4',
    icon: 'home-sharp',
    title: 'New Property Apartment',
    message: 'Hi, some new property for apart ...',
    date: '10 Jan',
    color: '#FF6C6C',
  },
];

const NotificationScreen = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Ionicons name={item.icon} size={RFValue(20)} color={item.color} />
      <View style={{ marginLeft: RFValue(10), flex: 1 }}>
        <View style={styles.row}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
        <Text style={styles.message}>{item.message}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={RFValue(20)} />
        </TouchableOpacity>
        <Text style={styles.header}>Notification</Text>
      </View>

      <FlatList
        data={staticNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:Platform.OS=='android' ? StatusBar.currentHeight+RFValue(10):0,
    padding: RFValue(16),
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: RFValue(10),
  },
  header: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    marginLeft: RFValue(10),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: RFValue(16),
    paddingTop:RFValue(10)
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: RFValue(14),
    fontWeight: 'bold',
  },
  message: {
    fontSize: RFValue(12),
    color: '#888',
    marginTop: RFValue(2),
  },
  date: {
    fontSize: RFValue(12),
    color: '#aaa',
  },
});

import React, { useCallback, useState } from 'react';
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
import { getAllNotifications, markAllNotificationsRead } from '../common/sqlliteService';
import { useFocusEffect } from '@react-navigation/native';

const NotificationScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const loadNotifications = async () => {
  //       const data = await getAllNotifications();
  //       setNotifications(data);
  //     };
  //     loadNotifications();
  //   }, [])
  // );
// useFocusEffect(
//   useCallback(() => {
//     const loadNotifications = async () => {
//       await markAllNotificationsRead();
//       const data = await getAllNotifications();
//       setNotifications(data);
//     };
//     loadNotifications();
//   }, [])
// );
useFocusEffect(
  React.useCallback(() => {
    const updateNotifications = async () => {
      await markAllNotificationsRead();
      const data = await getAllNotifications();
      setNotifications(data);

      navigation.setParams({ clearBadge: true });
    };

    updateNotifications();
  }, [])
);
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Ionicons name="notifications-outline" size={RFValue(20)} color="#00C48C" />
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

      {notifications.length === 0 ? (
        <Text style={{ textAlign: 'center', color: '#888', marginTop: RFValue(20) }}>
          No notifications yet.
        </Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + RFValue(10) : 0,
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
    paddingTop: RFValue(10),
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

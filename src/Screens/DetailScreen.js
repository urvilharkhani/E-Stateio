import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation, useRoute } from '@react-navigation/native';

import {
  addFavorite,
  removeFavorite,
  isFavorited,
} from '../common/storage';

const DetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { item } = route.params;

  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      const isFav = await isFavorited(item.id);
      setFavorite(isFav);
    };
    checkFavorite();
  }, []);

  const toggleFavorite = async () => {
    if (favorite) {
      await removeFavorite(item.id);
    } else {
      await addFavorite(item);
    }
    setFavorite((prev) => !prev);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          <Image source={{ uri: item.agent.image }} style={styles.mainImage} />

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[styles.iconButton, { left: RFValue(20) }]}
          >
            <Image
              resizeMode="contain"
              source={require('../assets/images/goBack.png')}
              style={styles.iconImage}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleFavorite}
            style={[styles.iconButton, { right: RFValue(20) }]}
          >
            <Image
              resizeMode="contain"
              source={require('../assets/images/LikeImg.png')}
              style={[
                styles.iconImage,
                { tintColor: favorite ? 'red' : 'white' },
              ]}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>

          <Text style={styles.location}>
            <Ionicons name="location-outline" size={RFValue(14)} />{' '}
            {item.location}
          </Text>

          <Text style={styles.price}>{item.price}</Text>

          <View style={styles.features}>
            {item.features.map((f, i) => (
              <View key={i} style={styles.featureItem}>
                <Ionicons
                  name={f.icon}
                  size={RFValue(20)}
                  color="#00C48C"
                />
                <Text style={styles.featureText}>{f.label}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{item.description}</Text>

          <View style={styles.agentRow}>
            <Image source={{ uri: item.agent.image }} style={styles.agentImg} />
            <View style={{ flex: 1 }}>
              <Text style={styles.agentName}>{item.agent.name}</Text>
              <Text style={styles.agentRole}>Agent</Text>
            </View>
            <TouchableOpacity style={styles.messageBtn}>
              <Text style={styles.messageText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  mainImage: {
    width: '100%',
    height: RFValue(220),
  },
  iconButton: {
    position: 'absolute',
    top: RFValue(30),
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    padding: RFValue(6),
    borderRadius: RFValue(20),
  },
  iconImage: {
    width: RFValue(20),
    height: RFValue(20),
    tintColor: 'white',
  },
  content: {
    padding: RFValue(20),
  },
  title: {
    fontSize: RFValue(20),
    fontWeight: 'bold',
  },
  location: {
    fontSize: RFValue(14),
    color: '#777',
    marginTop: RFValue(4),
  },
  price: {
    fontSize: RFValue(18),
    color: '#00C48C',
    marginVertical: RFValue(10),
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: RFValue(10),
  },
  featureItem: {
    alignItems: 'center',
  },
  featureText: {
    fontSize: RFValue(12),
    marginTop: RFValue(4),
  },
  sectionTitle: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
    marginTop: RFValue(20),
  },
  description: {
    fontSize: RFValue(13),
    marginTop: RFValue(8),
    color: '#555',
  },
  agentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: RFValue(20),
  },
  agentImg: {
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: RFValue(20),
    marginRight: RFValue(10),
  },
  agentName: {
    fontSize: RFValue(14),
    fontWeight: '600',
  },
  agentRole: {
    fontSize: RFValue(12),
    color: '#888',
  },
  messageBtn: {
    backgroundColor: '#00C48C',
    paddingHorizontal: RFValue(15),
    paddingVertical: RFValue(8),
    borderRadius: RFValue(20),
  },
  messageText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: RFValue(14),
  },
});

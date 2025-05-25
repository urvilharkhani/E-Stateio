import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
// import { addFavorite, removeFavorite, isFavorited } from '../common/storage';
import { addFavorite, removeFavorite, isFavorited } from '../common/sqlliteService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const DetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { item, category } = route.params;

  const [favorite, setFavorite] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const imagesToShow = item.images && item.images.length > 0 ? item.images : [item.image];

  const validImages = imagesToShow.filter(
    uri => typeof uri === 'string' && uri.length > 0
  );

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
    setFavorite(prev => !prev);
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={validImages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(uri, idx) => uri + idx}
        renderItem={({ item }) => (
          <View style={styles.carouselImage}>
            <Image source={{ uri: item }} style={{ width: "100%", height: '100%' }} />
          </View>
        )}
        onScroll={e => {
          const index = Math.round(
            e.nativeEvent.contentOffset.x /
            e.nativeEvent.layoutMeasurement.width
          );
          setCurrentIndex(index);
        }}
        scrollEventThrottle={16}
      />
      <View style={styles.dotsContainer}>
        {imagesToShow.map((_, idx) => (
          <View
            key={idx}
            style={[
              styles.dot,
              currentIndex === idx && styles.activeDot
            ]}
          />
        ))}
      </View>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={[styles.iconButton, { left: RFValue(20) }]}
      >
        <Ionicons name="chevron-back" size={RFValue(20)} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={toggleFavorite}
        style={[styles.iconButton, { right: RFValue(20) }]}
      >
        <Image
          resizeMode="contain"
          source={require('../assets/images/LikeImg.png')}
          style={[styles.iconImage, { tintColor: favorite ? 'red' : 'white' }]}
        />
      </TouchableOpacity>

      <ScrollView>
        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>

          <Text style={styles.location}>
            <Ionicons name="location-outline" size={RFValue(14)} /> {item.location}
          </Text>

          <Text style={styles.price}>
            {item.price} {item.currency} {category === 'rent' ? '/month' : ''}
          </Text>

          <View style={styles.features}>
            {item.features.map((f, i) => (
              <View key={i} style={styles.featureItem}>
                <Ionicons name={f.icon} size={RFValue(20)} color="#00C48C" />
                <Text style={styles.featureText}>
                  {f.label && f.label.toLowerCase().includes('none') ? 'Not Available' : f.label}
                </Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{item.description}</Text>

          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: item.latitude,
                longitude: item.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
              scrollEnabled={true}
              zoomEnabled={true}
              pitchEnabled={true}
              rotateEnabled={true}
            >
              <Marker
                coordinate={{ latitude: item.latitude, longitude: item.longitude }}
                title={item.title}
                description={item.location}
              />
            </MapView>
          </View>

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
  dotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH,
    marginTop: RFValue(-35),
    height: RFValue(20),
  },
  dot: {
    width: RFValue(8),
    height: RFValue(8),
    borderRadius: RFValue(4),
    backgroundColor: '#ccc',
    marginHorizontal: RFValue(4),
    marginVertical: RFValue(2),
  },
  activeDot: {
    backgroundColor: '#00C48C',
    width: RFValue(10),
    height: RFValue(10),
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  carouselImage: {
    width: SCREEN_WIDTH,
    height: RFValue(400),
    resizeMode: 'cover',
  },
  iconButton: {
    position: 'absolute',
    top: RFValue(30),
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    padding: RFValue(6),
    borderRadius: RFValue(20),
    zIndex: 1,
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
  mapContainer: {
    width: '100%',
    height: RFValue(200),
    borderRadius: RFValue(16),
    overflow: 'hidden',
    marginTop: RFValue(16),
    marginBottom: RFValue(24),
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { getFavorites } from '../common/storage';

const FavoriteScreen = () => {
  const navigation = useNavigation();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const loadFavorites = async () => {
      const data = await getFavorites();
      setFavorites(data);
    };

    const unsubscribe = navigation.addListener('focus', loadFavorites);
    return unsubscribe;
  }, [navigation]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('Detail', { item })}
    >
      <Image source={{ uri: item.agent.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.location}>{item.location}</Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.container}>
      <Text style={styles.heading}>Your Favorites</Text>

      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.emptyText}>No favorites yet.</Text>
      )}
      </View>
    </SafeAreaView>
  );
};

export default FavoriteScreen;

const styles = StyleSheet.create({
  mainContainer:{
    flex:1
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingHorizontal: RFValue(20),
  },
  heading: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    marginVertical: RFValue(20),
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: RFValue(10),
    padding: RFValue(10),
    marginBottom: RFValue(10),
    alignItems: 'center',
  },
  image: {
    width: RFValue(80),
    height: RFValue(80),
    borderRadius: RFValue(10),
    marginRight: RFValue(10),
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: RFValue(14),
    fontWeight: 'bold',
  },
  location: {
    fontSize: RFValue(12),
    color: '#666',
    marginTop: RFValue(4),
  },
  price: {
    fontSize: RFValue(14),
    color: '#00C48C',
    marginTop: RFValue(6),
  },
  emptyText: {
    fontSize: RFValue(14),
    color: '#888',
    textAlign: 'center',
    marginTop: RFValue(50),
  },
});

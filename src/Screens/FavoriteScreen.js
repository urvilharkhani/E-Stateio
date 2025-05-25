import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
// import { getFavorites, removeFavorite } from '../common/storage';
import CustomModal from '../component/CustomModal';
import { SwipeListView } from 'react-native-swipe-list-view';
import { getFavorites, removeFavorite } from '../common/firebaseService';

const FavoritesScreen = () => {
  const [favorites, setFavorites] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const loadFavorites = async () => {
      const data = await getFavorites();
      setFavorites(data);
    };
    const unsubscribe = navigation.addListener('focus', loadFavorites);
    return unsubscribe;
  }, [navigation]);

  const handleRemove = async () => {
    if (selectedItem) {
      await removeFavorite(selectedItem.id);
      setFavorites(prev => prev.filter(fav => fav.id !== selectedItem.id));
      setModalVisible(false);
    }
  };

  function formatPrice(price) {
    if (price >= 1000) {
      return (price / 1000).toFixed(price % 1000 === 0 ? 0 : 1) + 'k';
    }
    return price.toString();
  }

  const renderItem = ({ item }) => {
    const suffix = item.status === 'rent' ? '/month' : '';
    return (
      <View>
        <TouchableOpacity
        activeOpacity={1}
          style={styles.card}
          onPress={() => navigation.navigate('Detail', { item, category: item.status })}
        >
          <Image source={{ uri: item.image }} style={styles.thumbnail} />
          <View style={styles.info}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.location}>
              <Ionicons name="location-outline" size={RFValue(10)} color="#aaa" /> {item.location}
            </Text>
            <View style={styles.row}>
              <Text style={styles.price}>
                {formatPrice(item.price)} {item.currency} {suffix}
              </Text>
              <Text style={styles.dot}> • </Text>
              <Text style={styles.rating}>{item.rating}</Text>
              <Ionicons name="star" size={RFValue(10)} color="#FFC529" />
              <Text style={styles.dot}> • </Text>
              <Text style={styles.type}>{item.type}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderHiddenItem = ({ item }) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
      activeOpacity={1}
        style={styles.backRightBtn}
        onPress={() => {
          setSelectedItem(item);
          setModalVisible(true);
        }}
      >
        <Ionicons name="trash-bin" size={RFValue(20)} color="#fff" style={{marginRight:RFValue(3)}}/>
        <Text style={{ color: '#fff', fontSize: RFValue(10) }}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Favorites</Text>
      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={RFValue(60)} color="#FF6B6B" />
          <Text style={styles.emptyText}>No Favorites at the momemt! Add some by exploring now.</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            style={styles.exploreButton}
          >
            <Text style={styles.exploreText}>Explore now</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <SwipeListView
          data={favorites}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-75}
        />
      )}
      <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleRemove}
        message="Are you sure you want to remove this from favorites?"
      />
    </SafeAreaView>
  );
};

export default FavoritesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0,
    backgroundColor: '#fff',
    padding: RFValue(16),
  },
  header: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
    marginBottom: RFValue(15),
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#F8F8F8',
    borderRadius: RFValue(12),
    marginBottom: RFValue(12),
    padding: RFValue(10),
    alignItems: 'center',
  },
  thumbnail: {
    width: RFValue(60),
    height: RFValue(60),
    borderRadius: RFValue(10),
    marginRight: RFValue(10),
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: RFValue(12),
    fontWeight: 'bold',
  },
  location: {
    fontSize: RFValue(10),
    color: '#888',
    marginVertical: RFValue(2),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  price: {
    fontSize: RFValue(10),
    color: '#00C48C',
    fontWeight: 'bold',
  },
  dot: {
    marginHorizontal: 5,
    fontSize: RFValue(10),
    color: '#aaa',
  },
  rating: {
    fontSize: RFValue(10),
    color: '#FFC529',
    marginRight: RFValue(2),
  },
  type: {
    fontSize: RFValue(10),
    color: '#00C48C',
    fontWeight: '500',
  },
  heart: {
    marginLeft: RFValue(8),
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: RFValue(14),
    color: '#888',
    marginTop: RFValue(10),
  },
  exploreButton: {
    marginTop: RFValue(15),
    backgroundColor: '#00C48C',
    paddingHorizontal: RFValue(20),
    paddingVertical: RFValue(8),
    borderRadius: RFValue(20),
  },
  exploreText: {
    color: '#fff',
    fontSize: RFValue(14),
    fontWeight: 'bold',
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderRadius: RFValue(12),
    marginBottom: RFValue(12),
    paddingRight: RFValue(15),
  },
  backRightBtn: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    width: RFValue(75),
    backgroundColor: '#FF6B6B',
    paddingRight:RFValue(8),
    borderTopRightRadius: RFValue(12),
    borderBottomRightRadius: RFValue(12),
    height: '100%',
  },
});

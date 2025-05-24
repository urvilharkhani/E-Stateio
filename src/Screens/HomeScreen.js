import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Platform,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import ListingCard from '../component/ListingCard';

const categories = [
  { id: 1, label: 'Home', icon: 'home-outline' },
  { id: 2, label: 'Villa', icon: 'business-outline' },
  { id: 3, label: 'Apartment', icon: 'building-outline' },
];

const mockListings = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  title: 'Plaza Avenue Building',
  location: 'Balikpapan, Indonesia',
  price: '$3100/year',
  rating: 5.0,
  type: 'Home',
  image: 'https://via.placeholder.com/180x100',
  description:
    'Plaza Avenue, offer to our clients exceptional and professional service...',
  features: [
    { icon: 'resize-outline', label: '40 x 80 m' },
    { icon: 'bed-outline', label: '4 Bedroom' },
    { icon: 'water-outline', label: '4 Bathroom' },
    { icon: 'car-outline', label: 'Parking' },
  ],
  agent: {
    name: 'Sebastian Vettel',
    image: 'https://i.pravatar.cc/100?u=' + i,
  },
}));

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.container}>
        
        <View style={styles.header}>
          <View>
            <Text style={styles.heading}>Find your best</Text>
            <Text style={styles.heading}>property</Text>
          </View>
          <Image
            source={{ uri: 'https://i.pravatar.cc/100?img=2' }}
            style={styles.profileImg}
          />
        </View>


        <View style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={RFValue(18)} color="#888" />
          <TextInput
            placeholder="Search..."
            style={styles.searchInput}
            placeholderTextColor="#888"
          />
        </View>
        <View>

        <FlatList
          data={categories}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.categoryBtn}>
              <Ionicons name={item.icon} size={RFValue(18)} color="#00C48C" />
              <Text style={styles.categoryText}>{item.label}</Text>
            </TouchableOpacity>
          )}
          />
          </View>

        <View style={styles.popularHeader}>
          <Text style={styles.sectionTitle}>Popular</Text>
          <TouchableOpacity>
            <Ionicons name="chevron-forward-outline" size={RFValue(18)} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={mockListings}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          scrollEnabled={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listings}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={{
                marginRight: RFValue(index === mockListings.length - 1 ? 0 : 15),
              }}
              onPress={() => navigation.navigate('Detail', { item })}
            >
              <ListingCard {...item} />
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    paddingHorizontal: RFValue(20),
    paddingTop:Platform.OS=='android'&& RFValue(15)
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: RFValue(10),
    marginBottom: RFValue(10),
  },
  heading: {
    fontSize: RFValue(18),
    fontWeight: 'bold',
  },
  profileImg: {
    width: RFValue(40),
    height: RFValue(40),
    borderRadius: RFValue(20),
  },
  searchWrapper: {
    flexDirection: 'row',
    backgroundColor: '#F3F3F3',
    borderRadius: RFValue(14),
    padding: RFValue(10),
    alignItems: 'center',
    marginBottom: RFValue(15),
  },
  searchInput: {
    fontSize: RFValue(12),
    marginLeft: RFValue(10),
    flex: 1,
  },
  categories: {
    marginBottom: RFValue(15),
  },
  categoryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0F3EB',
    backgroundColor: '#F7FCFB',
    paddingHorizontal: RFValue(15),
    paddingVertical:RFValue(6),
    borderRadius: RFValue(20),
    marginRight: RFValue(10),
  },
  categoryText: {
    fontSize: RFValue(14),
    marginLeft: RFValue(8),
    color: '#00C48C',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
  },
  popularHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: RFValue(10),
  },
  listings: {
    paddingBottom: RFValue(10),
  },
});

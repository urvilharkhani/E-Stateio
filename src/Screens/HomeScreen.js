import React, { useState, useMemo } from 'react';
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
  ScrollView,
  StatusBar,
} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import ListingCard from '../component/ListingCard';
import mockRentListings from '../data/mockRentListings.json';
import mockSoldListings from '../data/mockSoldListings.json';

const allListings = [...mockRentListings, ...mockSoldListings];
const uniqueTypes = [...new Set(allListings.map(item => item.type))];

const generatedCategories = [
  { id: -1, label: 'All', icon: 'grid-outline' },
  ...uniqueTypes.map((type, idx) => ({
    id: idx,
    label: type,
    icon: 'home-outline',
  })),
];

const HomeScreen = () => {
  const navigation = useNavigation();

  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filterBySearchAndCategory = (listings) => {
    return listings.filter(item =>
      (selectedCategory === 'All' || item.type === selectedCategory) &&
      item.title.toLowerCase().includes(searchText.toLowerCase())
    );
  };

  const filteredRentListings = useMemo(() => filterBySearchAndCategory(mockRentListings), [searchText, selectedCategory]);
  const filteredSoldListings = useMemo(() => filterBySearchAndCategory(mockSoldListings), [searchText, selectedCategory]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView style={styles.container}>
      
        <View style={styles.header}>
          <View>
            <Text style={styles.heading}>Find your best property in Thunder Bay</Text>
          </View>
        </View>

        <View style={styles.searchWrapper}>
          <Ionicons name="search-outline" size={RFValue(18)} color="#888" />
          <TextInput
            placeholder="Search..."
            style={styles.searchInput}
            placeholderTextColor="#888"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <FlatList
          data={generatedCategories}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryBtn,
                selectedCategory === item.label && { backgroundColor: '#DFF6EF' }
              ]}
              onPress={() => setSelectedCategory(item.label)}
            >
              <Ionicons name={item.icon} size={RFValue(18)} color="#00C48C" />
              <Text style={styles.categoryText}>{item.label}</Text>
            </TouchableOpacity>
          )}
        />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>For Rent</Text>
        </View>
        {filteredRentListings.length ? (
          <FlatList
            data={filteredRentListings}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listings}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{
                  marginRight: RFValue(index === filteredRentListings.length - 1 ? 0 : 15),
                }}
                onPress={() => navigation.navigate('Detail', { item, category: 'rent' })}
              >
                <ListingCard {...item} category="rent" />
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={styles.emptyText}>Not at the moment</Text>
        )}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>For Sale</Text>
        </View>
        {filteredSoldListings.length ? (
          <FlatList
            data={filteredSoldListings}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listings}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{
                  marginRight: RFValue(index === filteredSoldListings.length - 1 ? 0 : 15),
                }}
                onPress={() => navigation.navigate('Detail', { item, category: 'sale' })}
              >
                <ListingCard {...item} category="sale" />
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={styles.emptyText}>Not at the moment</Text>
        )}
      </ScrollView>
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
    paddingBottom: Platform.OS === 'android' ? RFValue(25) : 0,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
    wordWrap: 'break-word',
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
    paddingVertical: RFValue(6),
    borderRadius: RFValue(20),
    marginRight: RFValue(10),
  },
  categoryText: {
    fontSize: RFValue(14),
    marginLeft: RFValue(8),
    color: '#00C48C',
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: RFValue(10),
    marginTop: RFValue(10),
  },
  sectionTitle: {
    fontSize: RFValue(16),
    fontWeight: 'bold',
  },
  listings: {
    paddingBottom: RFValue(10),
  },
  emptyText: {
    fontSize: RFValue(14),
    color: '#999',
    fontStyle: 'italic',
    paddingLeft: RFValue(10),
    marginBottom: RFValue(10),
  },
});

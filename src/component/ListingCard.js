
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { Dimensions } from 'react-native';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// const ListingCard = ({ title, image, location, price, rating, type, category,name }) => {
//   const formattedPrice = price.split('/')[0];
//   const suffix = category === 'rent' ? '/month' : category === 'sale' ? '' : `/${price.split('/')[1]}`;
//   console.log("title",type)
//   return (
//     <View style={styles.card}>
//       <Image source={{ uri: image }} style={styles.image} />

//       <View style={styles.details}>
//         <View style={styles.row}>
//           <Ionicons name="star" size={RFValue(12)} color="#FFC529" />
//           <Text style={styles.ratingText}>{rating}</Text>
//           <Text style={styles.dot}>•</Text>
//           <Text style={styles.type}>{type}</Text>
//         </View>

//         <Text style={styles.title}>{title}</Text>

//         <View style={styles.row}>
//           <Ionicons name="location-outline" size={RFValue(12)} color="#aaa" />
//           <Text style={styles.location}>{location}</Text>
//         </View>

//         <Text style={styles.price}>
//           <Text style={styles.priceMain}>{formattedPrice}</Text>
const ListingCard = ({ title, image, location, price, rating, type, category, currency }) => {
  const formattedPrice = `${formatPrice(price)} ${currency}`;
  const suffix = category === 'rent' ? '/month' : '';

  function formatPrice(price) {
    if (price >= 1000) {
      return (price / 1000).toFixed(price % 1000 === 0 ? 0 : 1) + 'k';
    }
    return price.toString();
  }

  const getTitleThreshold = () => {
    if (SCREEN_WIDTH >= 450) return 20;
    if (SCREEN_WIDTH >= 350) return 15;
    return 10;
  };

  return (
    <View style={styles.card}>
      <Image source={{ uri: image }} style={styles.image} />

      <View style={styles.details}>
        <View style={styles.row}>
          <Ionicons name="star" size={RFValue(12)} color="#FFC529" />
          <Text style={styles.ratingText}>{rating}</Text>
          <Text style={styles.dot}>•</Text>
          <Text style={styles.type}>{type}</Text>
        </View>

        <Text style={styles.title}>
          {title.length > getTitleThreshold() ? title.slice(0, getTitleThreshold()) + '…' : title}
        </Text>

        <View style={styles.row}>
          <Ionicons name="location-outline" size={RFValue(12)} color="#aaa" />
          <Text style={styles.location}>{location}</Text>
        </View>

        <Text style={styles.price}>
          <Text style={styles.priceMain}>{formattedPrice}</Text>
          <Text style={styles.priceSub}>{suffix}</Text>
        </Text>
      </View>
    </View>
  );
};

export default ListingCard;

const styles = StyleSheet.create({
  card: {
    width: RFValue(180),
    backgroundColor: '#fff',
    borderRadius: RFValue(14),
    overflow: 'hidden',
    borderColor: '#eee',
    borderWidth: 1,
    paddingBottom: RFValue(10),
    minHeight: RFValue(200),
  },
  image: {
    width: '100%',
    height: RFValue(100),
    borderTopLeftRadius: RFValue(14),
    borderTopRightRadius: RFValue(14),
  },
  details: {
    paddingHorizontal: RFValue(10),
    paddingTop: RFValue(6),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: RFValue(2),
  },
  ratingText: {
    fontSize: RFValue(10),
    color: '#FFC529',
    marginLeft: RFValue(4),
  },
  dot: {
    fontSize: RFValue(10),
    color: '#aaa',
    marginHorizontal: RFValue(6),
  },
  type: {
    fontSize: RFValue(10),
    color: '#00C48C',
    fontWeight: '500',
  },
  title: {
    fontSize: RFValue(12),
    fontWeight: 'bold',
    marginBottom: RFValue(4),
  },
  location: {
    fontSize: RFValue(10),
    color: '#999',
    marginLeft: RFValue(4),
  },
  price: {
    marginTop: RFValue(6),
  },
  priceMain: {
    fontSize: RFValue(14),
    color: '#00C48C',
    fontWeight: 'bold',
  },
  priceSub: {
    fontSize: RFValue(10),
    color: '#999',
  },
});
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { Button } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export default function MyListingsScreen({ navigation }) {
  const [listings, setListings] = useState([]);

  const fetchListings = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      console.log('Fetched userId:', userId);
      if (!userId) {
        alert('Please log in to view your listings');
        navigation.replace('Login');
        return;
      }

      const API_URL = `https://bid-app-production.up.railway.app/api/items?userId=${userId}`;
      console.log('Fetching from:', API_URL);
      const response = await axios.get(API_URL);
      console.log('API response:', response.data);
      setListings(response.data);
    } catch (error) {
      console.error('Error fetching listings:', error);
      alert('Failed to load listings: ' + (error.response?.data?.error || error.message));
    }
  }, [navigation]);

  useEffect(() => {
    fetchListings();
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('MyListingsScreen focused, refreshing listings');
      fetchListings();
    });
    return unsubscribe;
  }, [fetchListings, navigation]);

  useEffect(() => {
    const params = navigation.getState()?.routes.find((route) => route.name === 'MyListings')?.params;
    if (params?.refresh) {
      console.log('Refresh param detected, fetching listings');
      fetchListings();
    }
  }, [navigation, fetchListings]);

  return (
    <View style={styles.container}>
      <View style={styles.headerButton}>
        <Button
          mode="contained"
          buttonColor="#e67300"
          textColor="#fff"
          onPress={() => navigation.navigate('ListNewItem')}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          List New Item
        </Button>
      </View>

      {listings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You haven't listed any items yet.</Text>
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.listingItem}>
              <Image
                source={item.imageUrl ? { uri: Platform.OS === 'android' ? `http://10.0.2.2:3000${item.imageUrl}` : `http://localhost:3000${item.imageUrl}` } : require('../assets/icons8-image-50.png')}
                style={styles.listingImage}
              />
              <View style={styles.listingText}>
                <Text style={styles.listingTitle}>{item.title}</Text>
                <Text style={styles.listingCategory}>Category: {item.category}</Text>
                <Text style={styles.listingBid}>Starting Bid: ${item.startingBid}</Text>
                <Text style={styles.listingEndDate}>Ends: {item.auctionEndDate}</Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003366',
    padding: 20,
    paddingTop: 80,
  },
  headerButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    borderRadius: 20,
    width: 140,
  },
  buttonContent: {
    height: 45,
  },
  listingItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
  },
  listingImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  listingText: {
    flex: 1,
    justifyContent: 'center',
  },
  listingTitle: {
    color: '#003366',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listingCategory: {
    color: '#003366',
    fontSize: 14,
  },
  listingBid: {
    color: '#003366',
    fontSize: 14,
  },
  listingEndDate: {
    color: '#003366',
    fontSize: 14,
  },
});
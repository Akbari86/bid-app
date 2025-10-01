import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Platform } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MyBidsScreen({ navigation }) {
  const [items, setItems] = useState([]);

  const fetchBiddedItems = useCallback(async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        alert('Please log in to view your bids');
        return;
      }

      const API_URL = 'https://bid-app-production.up.railway.app/api/bids';
      console.log('Fetching bids from:', `${API_URL}?userId=${userId}`);
      const response = await axios.get(`${API_URL}?userId=${userId}`);
      console.log('API response:', response.data);

      const itemIds = response.data.map((bid) => bid.itemId);
      if (itemIds.length > 0) {
        const itemsResponse = await axios.get(
          Platform.OS === 'android'
            ? `https://bid-app-production.up.railway.app/api/items?itemIds=${itemIds.join(',')}`
            : `https://bid-app-production.up.railway.app//api/items?itemIds=${itemIds.join(',')}`
        );
        setItems(itemsResponse.data);
      } else {
        setItems([]);
      }
    } catch (error) {
      console.error('Error fetching bidded items:', error);
      alert('Failed to load bidded items: ' + (error.response?.data?.error || error.message));
    }
  }, []);

  useEffect(() => {
    fetchBiddedItems();
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('MyBidsScreen focused, refreshing bids');
      const params = navigation.getState()?.routes.find((route) => route.name === 'MyBids')?.params;
      if (params?.refresh) {
        fetchBiddedItems();
      }
    });
    return unsubscribe;
  }, [fetchBiddedItems, navigation]);

  const getDaysUntilEnd = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 'Ended';
  };

  return (
    <View style={styles.container}>
      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You haven't bid on any items yet.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.bidItem}>
              <Image
                source={
                  item.imageUrl
                    ? { uri: Platform.OS === 'android' ? `http://10.0.2.2:3000${item.imageUrl}` : `http://localhost:3000${item.imageUrl}` }
                    : require('../assets/icons8-image-50.png')
                }
                style={styles.bidImage}
              />
              <View style={styles.bidText}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.category}>Category: {item.category}</Text>
                <Text style={styles.ends}>Ends: {getDaysUntilEnd(item.auctionEndDate)} days</Text>
                <Text style={styles.bids}>Bids: {item.bidsCount}</Text>
                <Text style={styles.currentBid}>Current bid: ${item.currentBid || item.startingBid}</Text>
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
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  bidItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
  },
  bidImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  bidText: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#003366',
    fontSize: 16,
    fontWeight: 'bold',
  },
  category: {
    color: '#003366',
    fontSize: 14,
  },
  ends: {
    color: '#003366',
    fontSize: 14,
  },
  bids: {
    color: '#003366',
    fontSize: 14,
  },
  currentBid: {
    color: '#e67300',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
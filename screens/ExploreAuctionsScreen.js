import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Platform, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

export default function ExploreAuctionsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);

  const fetchItems = useCallback(async () => {
    try {
      const API_URL = 'https://bid-app-production.up.railway.app/api/items';
      console.log('Fetching from:', API_URL);
      const response = await axios.get(API_URL);
      let filteredItems = response.data;

      if (searchQuery) {
        filteredItems = filteredItems.filter((item) =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      console.log('Filtered items:', filteredItems);
      setItems(filteredItems);
    } catch (error) {
      console.error('Error fetching items:', error);
      alert('Failed to load items: ' + (error.response?.data?.error || error.message));
    }
  }, [searchQuery]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const getDaysUntilEnd = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 'Ended';
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search items..."
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          fetchItems();
        }}
        mode="outlined"
        style={styles.searchInput}
        left={<TextInput.Icon icon={() => <MaterialCommunityIcons name="magnify" size={20} color="#e67300" />} />}
        theme={{
          colors: {
            primary: '#e67300',
            background: '#fff',
            text: '#000',
            placeholder: '#999',
          },
          roundness: 20,
        }}
        contentStyle={{ height: 45 }}
      />

      <FlatList
        style={{ marginTop: 10 }}
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('ItemDetails', { item })}
            style={styles.auctionItem}
          >
            <Image
              source={
                item.imageUrl
                  ? { uri: Platform.OS === 'android' ? `http://10.0.2.2:3000${item.imageUrl}` : `http://localhost:3000${item.imageUrl}` }
                  : require('../assets/icons8-image-50.png')
              }
              style={styles.itemImage}
            />
            <View style={styles.itemText}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.category}>Category: {item.category}</Text>
              <Text style={styles.ends}>Ends: {getDaysUntilEnd(item.auctionEndDate)} days</Text>
              <Text style={styles.currentBid}>Current bid: ${item.currentBid || item.startingBid}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003366',
    padding: 20,
  },
  searchInput: {
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  auctionItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 10,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  itemText: {
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
  currentBid: {
    color: '#e67300',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
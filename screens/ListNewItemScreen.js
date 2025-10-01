import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, SafeAreaView, Platform, StatusBar } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ListNewItemScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [startingBid, setStartingBid] = useState('');
  const [category, setCategory] = useState('');
  const [auctionEndDate, setAuctionEndDate] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      if (!title || !startingBid || !category || !auctionEndDate) {
        alert('Please fill in all fields');
        return;
      }

      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        alert('Please log in to list an item');
        navigation.replace('Login');
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('startingBid', parseFloat(startingBid));
      formData.append('category', category);
      formData.append('auctionEndDate', auctionEndDate);
      formData.append('userId', userId);
      if (image) {
        formData.append('image', {
          uri: image,
          type: 'image/jpeg',
          name: 'item-image.jpg',
        });
      }

      console.log('Sending item:', { title, startingBid, category, auctionEndDate, userId, image });
      const API_URL = 'https://bid-app-production.up.railway.app/api/items/new';///////
      await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Item saved successfully!');
      try {
        navigation.navigate('MainTabs', { screen: 'MyListings', params: { refresh: true } });
      } catch (error) {
        console.error('Navigation error:', error);
        navigation.goBack();
      }
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Failed to save item: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Image source={require('../assets/logo-bid.png')} style={styles.logo} />
        <Button
          mode="text"
          textColor="#e67300"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
        >
          Cancel
        </Button>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ padding: 20 }}>
        <TextInput
          label="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Starting Bid"
          value={startingBid}
          onChangeText={setStartingBid}
          keyboardType="numeric"
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Category"
          value={category}
          onChangeText={setCategory}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Auction End Date"
          value={auctionEndDate}
          onChangeText={setAuctionEndDate}
          placeholder="YYYY-MM-DD"
          style={styles.input}
          mode="outlined"
        />
        <Button
          mode="outlined"
          onPress={pickImage}
          style={styles.imageButton}
          textColor="#e67300"
        >
          {image ? 'Change Image' : 'Select Image'}
        </Button>
        {image && (
          <Image source={{ uri: image }} style={styles.previewImage} />
        )}
        <Button
          mode="contained"
          onPress={handleSave}
          buttonColor="#e67300"
          textColor="#fff"
          style={styles.button}
        >
          Save Item
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#003366',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: '#003366',
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  cancelButton: {
    marginRight: 0,
  },
  container: {
    flex: 1,
    backgroundColor: '#003366',
  },
  input: {
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  imageButton: {
    marginBottom: 15,
    borderColor: '#e67300',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 15,
    alignSelf: 'center',
  },
  button: {
    borderRadius: 20,
    marginTop: 10,
  },
});
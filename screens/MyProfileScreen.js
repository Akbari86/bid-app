import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export default function MyProfileScreen({ navigation }) {
  const [user, setUser] = useState({ name: 'Loading...', email: 'Loading...' });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const API_URL = `https://bid-app-production.up.railway.app/api/auth/me?userId=${userId}`;
          const response = await axios.get(API_URL);
          setUser(response.data.user);
        } else {
          alert('No user logged in');
          navigation.replace('Login');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        alert('Failed to load profile: ' + (error.response?.data?.message || error.message));
        navigation.replace('Login');
      }
    };
    fetchUser();
  }, [navigation]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userId');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/profile-pic.png')} style={styles.profileImage} />
      <Text style={styles.label}>Name:</Text>
      <Text style={styles.value}>{user.name}</Text>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.value}>{user.email}</Text>
      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
        contentStyle={styles.logoutContent}
        buttonColor="#e67300"
        textColor="#fff"
      >
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#003366',
    padding: 20,
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 30,
  },
  label: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 10,
  },
  value: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    marginTop: 30,
    borderRadius: 20,
    width: 150,
  },
  logoutContent: {
    height: 45,
  },
});
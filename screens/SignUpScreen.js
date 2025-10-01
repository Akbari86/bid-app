import React, { useState } from 'react';
import { View, Image, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    try {
      if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
      }
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      const userData = { name, email, password };
      const API_URL = 'https://bid-app-production.up.railway.app/api/auth/register';
      const response = await axios.post(API_URL, userData);
      await AsyncStorage.setItem('userId', response.data.user._id); // Store userId
      alert('User registered successfully!');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error registering user:', error);
      alert('Failed to register: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../assets/logo-bid.png')} style={styles.logo} />
        </View>
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            mode="outlined"
            style={styles.input}
            contentStyle={styles.inputContent}
            theme={{
              colors: {
                primary: '#e67300',
                background: '#fff',
                text: '#000',
                placeholder: '#999',
              },
              roundness: 20,
            }}
            left={<TextInput.Icon icon={() => <MaterialCommunityIcons name="account-outline" size={20} color="#e67300" />} />}
          />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            style={styles.input}
            contentStyle={styles.inputContent}
            theme={{
              colors: {
                primary: '#e67300',
                background: '#fff',
                text: '#000',
                placeholder: '#999',
              },
              roundness: 20,
            }}
            left={<TextInput.Icon icon={() => <MaterialCommunityIcons name="email-outline" size={20} color="#e67300" />} />}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
            contentStyle={styles.inputContent}
            theme={{
              colors: {
                primary: '#e67300',
                background: '#fff',
                text: '#000',
                placeholder: '#999',
              },
              roundness: 20,
            }}
            left={<TextInput.Icon icon={() => <MaterialCommunityIcons name="lock-outline" size={20} color="#e67300" />} />}
          />
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            mode="outlined"
            style={styles.input}
            contentStyle={styles.inputContent}
            theme={{
              colors: {
                primary: '#e67300',
                background: '#fff',
                text: '#000',
                placeholder: '#999',
              },
              roundness: 20,
            }}
            left={<TextInput.Icon icon={() => <MaterialCommunityIcons name="lock-check-outline" size={20} color="#e67300" />} />}
          />
          <Button
            mode="contained"
            onPress={handleSignUp}
            style={styles.button}
            contentStyle={styles.buttonContent}
            buttonColor="#e67300"
            textColor="#fff"
          >
            Sign Up
          </Button>
          <Button
            onPress={() => navigation.navigate('Login')}
            textColor="#fff"
          >
            Already have an account? Login
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#003366',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 15,
    height: 50,
  },
  inputContent: {
    height: 45,
    paddingHorizontal: 10,
  },
  button: {
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonContent: {
    height: 45,
  },
});
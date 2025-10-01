import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  SafeAreaView,
  Platform,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Button } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ItemDetailsScreen({ route, navigation }) {
  const { item } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [bidAmount, setBidAmount] = useState('');

  const handleBid = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        alert('Please log in to place a bid');
        navigation.replace('Login');
        return;
      }

      if (!bidAmount || isNaN(bidAmount) || bidAmount <= 0) {
        alert('Please enter a valid bid amount');
        return;
      }

      const API_URL = 'https://bid-app-production.up.railway.app/api/bids';
      await axios.post(API_URL, {
        itemId: item._id,
        userId,
        bidAmount: parseFloat(bidAmount),
      });

      setModalVisible(false);
      setConfirmationVisible(true);
      setBidAmount('');
    } catch (error) {
      console.error('Error placing bid:', error);
      alert('Failed to place bid: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleConfirmationClose = () => {
    setConfirmationVisible(false);
    try {
      navigation.navigate('MainTabs', { screen: 'MyBids', params: { refresh: true } });
    } catch (error) {
      console.error('Navigation error:', error);
      navigation.goBack();
    }
  };

  const getDaysUntilEnd = (endDate) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 'Ended';
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Image source={require('../assets/logo-bid.png')} style={styles.logo} />
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.whiteBox}>
          <Image
            source={
              item.imageUrl
                ? { uri: Platform.OS === 'android' ? `http://10.0.2.2:3000${item.imageUrl}` : `http://localhost:3000${item.imageUrl}` }
                : require('../assets/icons8-image-50.png')
            }
            style={styles.image}
          />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>Category: {item.category}</Text>
          <Text style={styles.text}>Number of bids: {item.bidsCount}</Text>
          <Text style={styles.text}>Ends: {getDaysUntilEnd(item.auctionEndDate)} days</Text>
          <Text style={styles.currentBid}>Current bid: ${item.currentBid || item.startingBid}</Text>

          <Button
            mode="contained"
            onPress={() => setModalVisible(true)}
            style={styles.bidButton}
            textColor="#fff"
            buttonColor="#e67300"
            disabled={getDaysUntilEnd(item.auctionEndDate) === 'Ended'}
          >
            Place Bid
          </Button>
        </View>

        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter your bid</Text>
              <TextInput
                placeholder={`Enter amount higher than $${item.currentBid || item.startingBid}`}
                value={bidAmount}
                onChangeText={setBidAmount}
                keyboardType="numeric"
                style={styles.input}
              />
              <View style={styles.modalButtons}>
                <Button
                  mode="outlined"
                  onPress={() => setModalVisible(false)}
                  style={styles.cancelButton}
                >
                  Cancel
                </Button>
                <Button
                  mode="contained"
                  onPress={handleBid}
                  buttonColor="#e67300"
                  textColor="#fff"
                >
                  Bid
                </Button>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          visible={confirmationVisible}
          transparent
          animationType="fade"
          onRequestClose={handleConfirmationClose}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { alignItems: 'center' }]}>
              <Text style={styles.modalTitle}>Bid placed successfully!</Text>
              <Button
                mode="contained"
                onPress={handleConfirmationClose}
                buttonColor="#e67300"
                textColor="#fff"
                style={{ marginTop: 10, borderRadius: 20 }}
              >
                OK
              </Button>
            </View>
          </View>
        </Modal>
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
  header: {
    height: 60,
    backgroundColor: '#003366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  backText: {
    color: '#e67300',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  whiteBox: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#003366',
    marginBottom: 5,
  },
  currentBid: {
    fontSize: 16,
    color: '#e67300',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  bidButton: {
    borderRadius: 20,
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#003366',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    borderColor: '#e67300',
  },
});
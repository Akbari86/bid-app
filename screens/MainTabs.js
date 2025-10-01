import React from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MyListingsScreen from './MyListingsScreen';
import MyBidsScreen from './MyBidsScreen';
import ExploreAuctionsScreen from './ExploreAuctionsScreen';
import MyProfileScreen from './MyProfileScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

function LogoTitle() {
  return (
    <View style={styles.logoContainer}>
      <Image source={require('../assets/logo-bid.png')} style={styles.logo} />
    </View>
  );
}

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#e67300',
        tabBarInactiveTintColor: '#fff',
        tabBarStyle: { backgroundColor: '#003366' },
        headerStyle: { backgroundColor: '#003366' },
        headerTitle: (props) => <LogoTitle {...props} />,
        headerTitleAlign: 'left',
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === 'MyListings') iconName = 'format-list-bulleted';
          else if (route.name === 'MyBids') iconName = 'gavel';
          else if (route.name === 'ExploreAuctions') iconName = 'magnify';
          else if (route.name === 'MyProfile') iconName = 'account-circle-outline';
          return <MaterialCommunityIcons name={iconName} color={focused ? '#e67300' : '#fff'} size={size} />;
        },
      })}
    >
      <Tab.Screen name="MyListings" component={MyListingsScreen} options={{ title: 'My Listings' }} />
      <Tab.Screen name="MyBids" component={MyBidsScreen} options={{ title: 'My Bids' }} />
      <Tab.Screen name="ExploreAuctions" component={ExploreAuctionsScreen} options={{ title: 'Explore' }} />
      <Tab.Screen name="MyProfile" component={MyProfileScreen} options={{ title: 'My Profile' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    marginLeft: 10,
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
});
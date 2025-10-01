import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import MainTabs from './screens/MainTabs';
import ListNewItemScreen from './screens/ListNewItemScreen';
import SplashScreen from './screens/SplashScreen';
import ItemDetailsScreen from './screens/ItemDetailsScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="ListNewItem" component={ListNewItemScreen} />
        <Stack.Screen name="ItemDetails" component={ItemDetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
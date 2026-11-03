import React from 'react';
import { Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import { Loading } from './src/components';
import { colors } from './src/theme';

import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const icon = (emoji) => () => <Text style={{ fontSize: 20 }}>{emoji}</Text>;

function Tabs() {
  return (
    <Tab.Navigator screenOptions={{ tabBarActiveTintColor: colors.accent }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Thực đơn', tabBarIcon: icon('🍜') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Tài khoản', tabBarIcon: icon('👤') }} />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { user, booting } = useAuth();
  if (booting) return <Loading />;

  return (
    <Stack.Navigator>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Đăng ký' }} />
        </>
      ) : (
        <>
          <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Chi tiết món' }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}

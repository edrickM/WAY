import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './Screens/LoginScreen';
import HomeScreen from './Screens/HomeScreen';
import RegistrationScreen from './Screens/RegistrationScreen';
import {auth} from './firebase';
import {useState, useEffect} from 'react';

 const Stack = createNativeStackNavigator();


export default function App() {
  return (
    checkLoginStatus ? (
      <NavigationContainer>
       <Stack.Navigator>
       <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
         <Stack.Screen options={{headerShown: false}} name="Home" component={HomeScreen} />
       </Stack.Navigator>
     </NavigationContainer>
    ) : (
      <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen options={{headerShown: false}} name="Sign up" component={RegistrationScreen} />
        <Stack.Screen options={{headerShown: false}} name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    ));
}

function checkLoginStatus() {
  const isSignedin = false
  if (auth.currentUser) {
    isSignedin = true
  }
  return isSignedin
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  }});
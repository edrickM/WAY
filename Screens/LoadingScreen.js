import React from 'react';
import {useEffect} from 'react';
import {View, Image, StyleSheet, ActivityIndicator} from 'react-native';
import {auth} from '../firebase';
import logo from '../assets/logo.png';
import {useNavigation} from '@react-navigation/core';

const LodingScreen = () => {
  var user = auth.currentUser;
  const navigation = useNavigation();

  function checkLoginStatus() {
    const isSignedin = false;
    if (auth.currentUser) {
      isSignedin = true;
    }
    return isSignedin;
  }

  useEffect(() => {
    setTimeout(() => {
      const userStatus = checkLoginStatus()
      if (userStatus){
        navigation.navigate('Home')
      }else{
        navigation.navigate('Auth')
      }
    }, 2500);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo}></Image>
      <ActivityIndicator size={"large"}>

      </ActivityIndicator>
    </View>
  );
};
export default LodingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    resizeMode: 'contain',
    width: 250,
    bottom: 30,
  },
});

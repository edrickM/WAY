import {StyleSheet, Text, View, Dimensions, Animated} from 'react-native';
import MapView, {Callout} from 'react-native-maps';
import React from 'react';
import * as Location from 'expo-location';
import {useEffect, useState} from 'react';
import {addLocation} from '../LocationManager';
import {Button, TouchableOpacity} from 'react-native';
import {auth} from '../firebase';
import {useNavigation} from '@react-navigation/core';


const HomeScreen = () => {
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let {
        coords: {latitude, longitude},
      } = await Location.getCurrentPositionAsync({});
      setUserLocation(JSON.stringify({latitude, longitude}));

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      auth.onAuthStateChanged(user => {
        if (user) {
          navigation.replace('Login');
        }
      });
    };
  }, []);

  const updateLocation = () => {
    var location = {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
    };
    addLocation(location);
  };

  const handleSignOut = ({navigation}) => {
    auth
      .signOut()
      .then(() => {
        navigation.replace('login');
      })
      .catch(error => alert(error.message));
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation
        zoomEnabled
        showsMyLocationButton
        inittialRegion={region}
        onRegionChange={region => setRegion(region)}>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={handleSignOut}>
          </TouchableOpacity>
      </MapView>
      {/* <Animated.View style={styles.drawerContainer}></Animated.View> */}
    </View>
  );
};

export default HomeScreen;

// const { height } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  settingsButton: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignSelf: 'flex-end',
    top: 70,
    right: 20,
    alignContent: 'flex-end',
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 50,
  },
  drawerContainer: {
    width: '100%',
    height: Dimensions.get('window').height,
    backgroundColor: '#fff',
    borderRadius: 25,
    position: 'absolute',
    bottom: -Dimensions.get('window').height + 70,
  },
 
});

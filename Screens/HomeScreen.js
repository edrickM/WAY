import {StyleSheet, Text, View, Dimensions} from 'react-native';
import MapView, { Callout } from 'react-native-maps';
import React from 'react';
import * as Location from 'expo-location';
import {useEffect, useState} from 'react';
import {addLocation} from '../LocationManager';
import { Button, TouchableOpacity } from 'react-native-web';
import { auth } from '../firebase';

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
    };
  }, []);

  function updateLocation() {
    var location = {
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
    };
    addLocation(location);
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        showsUserLocation
        zoomEnabled
        showsMyLocationButton
        inittialRegion={region}
        onRegionChange={region => setRegion(region)}>
        </MapView>
    </View>
  );
};

export default HomeScreen;

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
  buttonCallout: {
    flex: 1,
    flexDirection:'row',
    position:'absolute',
    bottom:10,
    alignSelf: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
    borderWidth: 0.5,
    borderRadius: 20
  },
  touchable: {
    backgroundColor: "lightblue",
    padding: 10,
    margin: 10
  },
});

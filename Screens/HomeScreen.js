import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MapView, {Marker, AnimatedRegion} from 'react-native-maps';
const Scaledrone = require('scaledrone-react-native');
const SCALEDRONE_CHANNEL_ID = 'PMPs48ZjR8VGrTSE';
import * as Location from 'expo-location';
const screen = Dimensions.get('window');
import openMap from 'react-native-open-maps'
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

let foregroundSubscription = null;

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      members: [],
      location: {},
    };
  }

  async componentDidMount() {
    let {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return;
    }
    const drone = new Scaledrone(SCALEDRONE_CHANNEL_ID);
    drone.on('error', error => console.error(error));
    drone.on('close', reason => console.error(reason));

    //on open, prompt user for name and authenticate with jwt
    drone.on('open', error => {
      if (error) {
        return console.error(error);
      }
      Alert.prompt('Please insert your name', null, name =>
        doAuthRequest(drone.clientId, name).then(jwt =>
          drone.authenticate(jwt),
        ),
      );
    });

    const room = drone.subscribe('observable-locations', {
      historyCount: 50, // load 50 past messages
    });
    room.on('open', async error => {
      if (error) {
        return console.error(error);
      }
      let location = await Location.getCurrentPositionAsync(
        {
          accuracy: Location.Accuracy.Highest,
          distanceInterval: 10,
          maximumAge: 10000,
        },
      );
        const {latitude, longitude} = location.coords;
        // publish device's new location
        drone.publish({
          room: 'observable-locations',
          message: {latitude, longitude},
      });
    });
    // received past message
    room.on('history_message', message =>
      this.updateLocation(message.data, message.clientId),
    );
    // received new message
    room.on('data', (data, member) => this.updateLocation(data, member.id));
    // array of all connected members
    room.on('members', members => this.setState({members}));
    // new member joined room
    room.on('member_join', member => {
      const members = this.state.members.slice(0);
      members.push(member);
      this.setState({members});
    });
    // member left room
    room.on('member_leave', member => {
      const members = this.state.members.slice(0);
      const index = members.findIndex(m => m.id === member.id);
      if (index !== -1) {
        members.splice(index, 1);
        this.setState({members});
      }
    });
  }

  // async startLocationTracking() {
  //   let {status} = await Location.requestForegroundPermissionsAsync();
  //   if (status !== 'granted') {
  //     console.log('Permission to access location was denied');
  //     return;
  //   }
  //   let location = await Location.getCurrentPositionAsync(
  //     {
  //       accuracy: Location.Accuracy.Highest,
  //       distanceInterval: 10,
  //       maximumAge: 10000,
  //     },
  //   );
  // }

  updateLocation(data, memberId) {
    const {members} = this.state;
    const member = members.find(m => m.id === memberId);
    if (!member) {
      // a history message might be sent from a user who is no longer online
      return;
    }
    if (member.location) {
      member.location
        .timing({
          latitude: data.latitude,
          longitude: data.longitude,
        })
        .start();
    } else {
      member.location = new AnimatedRegion({
        latitude: data.latitude,
        longitude: data.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
      this.forceUpdate();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          ref={ref => {
            this.map = ref;
          }}
          initialRegion={{
            latitude: 37.600425,
            longitude: -122.385861,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}>
          {this.createMarkers()}
        </MapView>
        <View pointerEvents="none" style={styles.members}>
          {this.createMembers()}
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.fitToMarkersToMap()}
            style={[styles.bubble, styles.button]}>
            <Text>Fit Markers Onto Map</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  createMarkers() {
    const {members} = this.state;
    const membersWithLocations = members.filter(m => !!m.location);
    return membersWithLocations.map(member => {
      const {id, location, authData} = member;
      const {name, color} = authData;
      return (
        <Marker.Animated
          key={id}
          identifier={id}
          coordinate={location}
          title={name}
        />
      );
    });
  }

  createMembers() {
    const {members} = this.state;
    return members.map(member => {
      const {name} = member.authData;
      return (
        <View key={member.id} style={styles.member}>
          <View style={styles.avatar}></View>
          <Text style={styles.memberName}>{name}</Text>
        </View>
      );
    });
  }

  fitToMarkersToMap() {
    const {members} = this.state;
    this.map.fitToSuppliedMarkers(
      members.map(m => m.id),
      true,
    );
  }

  // openGps(memberId) {
  //   const {members} = this.state;
  //   const member = members.find(m => m.id === memberId);
  //   openMap({latitude: member.latitude, longitude: member.longitude});
  // }
}

//Post request that sends clientId and name to server
function doAuthRequest(clientId, name) {
  let status;
  return fetch(
    'https://69da-2605-ad80-30-841a-e4ab-2e1e-f3a5-a8c.ngrok.io/auth',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({clientId, name}),
    },
  )
    .then(res => {
      status = res.status;
      return res.text();
    })
    .then(text => {
      if (status === 200) {
        return text;
      } else {
        alert(text);
      }
    })
    .catch(error => console.error(error));
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
  members: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 10,
  },
  member: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 20,
    height: 30,
    marginTop: 10,
  },
  memberName: {
    marginHorizontal: 10,
  },
  avatar: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
});

const Scaledrone = require('scaledrone-node');
const fetch = require('node-fetch');
const SCALEDRONE_CHANNEL_ID = ('PMPs48ZjR8VGrTSE');

const locations = [
  {name: 'Bob', longitude: -97.319601, latitude: 32.7399279},
  {name: 'Alice', longitude: -97.055798, latitude: 32.912450},
  {name: 'John', longitude: -96.788884, latitude: 32.756097},
];

function doAuthRequest(clientId, name) {
  let status;
  return fetch('https://ee76-47-184-108-211.ngrok.io/auth', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({clientId, name})
  }).then(res => {
    status = res.status;
    return res.text();
  }).then(text => {
    if (status === 200) {
      return text;
    } else {
      console.error(text);
    }
  }).catch(error => console.error(error));
}

locations.forEach(location => {
  const drone = new Scaledrone(SCALEDRONE_CHANNEL_ID);
  drone.on('error', error => console.error(error));
  drone.on('open', error => {
    if (error) {
      return console.error(error);
    }
    doAuthRequest(drone.clientId, location.name)
      .then(jwt => drone.authenticate(jwt));
  });
  drone.on('authenticate', error => {
    if (error) {
      return console.error(error);
    }
    setInterval(() => {
      const delta = moveInRandomDirection();
      location.latitude += delta.dlat;
      location.longitude += delta.dlon;
      drone.publish({
        room: 'observable-locations',
        message: location
      });
    }, 1000);
  });
  // subscribe so our data is avaiable to the observable room
  drone.subscribe('observable-locations');
});

function moveInRandomDirection(maxDistance = 0.005) {
  const angle = Math.random() * Math.PI * 2;
  const distance = maxDistance * Math.random();
  return {
    dlat: Math.cos(angle) * distance,
    dlon: Math.sin(angle) * distance,
  };
}
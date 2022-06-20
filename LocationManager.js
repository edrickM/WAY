import {db} from './firebase';

export function addLocation(location) {
  db.collection('userLocations')
    .add(location)
    .then(snapshot => {
      location.id = snapshot.id;
      snapshot.set(location);
    })
    .catch(error => console.log(error));
}

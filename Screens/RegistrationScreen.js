import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import logo from '../assets/logo.png';
import React from 'react';
import {auth} from '../firebase';
import {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/core';

const RegistrationScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.navigate('Home');
        console.log("logged in")
      }
      else{
        navigation.navigate('Auth')
        console.log("not logged in")
      }
    });
    return unsubscribe;
  }, []);
  
  const handleSignUp = () => {
    if(password !== confirmPassword){
      Alert("Passwords dont't match")
    }
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(function(res){
        return res.user.updateProfile({
          displayName: username
        })
      })
      .catch(error => alert(error.message));
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
        <View style={styles.inputContainer}>
          <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo}></Image>
            <Text style={styles.logoText}>Resgister</Text>
          </View>
          <Text style={styles.labelText}>Email</Text>
          <TextInput
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.input}
          />
          <Text style={styles.labelText}>Username</Text>
          <TextInput
            value={username}
            onChangeText={text => setUsername(text)}
            style={styles.input}
          />
          <View flexDirection="row">
            <Text style={styles.labelText}>Password</Text>
            <Text style={styles.labelText}>Re-enter Password</Text>
          </View>
          <View style={styles.inputPasswordContainer}>
            <TextInput
              value={password}
              onChangeText={text => setPassword(text)}
              style={styles.inputPassword}
              secureTextEntry={true}
            />
            <TextInput
              value={confirmPassword}
              onChangeText={text => setConfirmPassword(text)}
              style={styles.inputPassword}
              secureTextEntry={true}
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.buttonOutline]}
            onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign up</Text>
          </TouchableOpacity>
          <Text style={styles.smallText}>
            Already have an account?
            <Text
              style={styles.clickableText}
              onPress={() => navigation.navigate('Login')}>
              Log in
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  inputContainer: {
    width: 299,
    marginTop: 310,
  },
  input: {
    backgroundColor: '#D3DEDC',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 13,
    marginTop: 5,
    marginBottom: 5,
  },
  inputPasswordContainer: {
    width: 300,
    flexDirection: 'row',
  },
  inputPassword: {
    backgroundColor: '#D3DEDC',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 13,
    marginTop: 5,
    marginBottom: 5,
    width: 145,
    marginRight: 10,
  },
  labelText: {
    color: '#000000',
    fontWeight: '500',
    fontSize: 14,
    marginLeft: 5,
    marginRight: 85,
  },
  buttonContainer: {
    width: 190,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },
  button: {
    backgroundColor: '#002376',
    width: '100%',
    padding: 15,
    borderRadius: 21,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782f9',
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonText: {
    color: '#000000',
    fontWeight: '500',
    fontSize: 16,
  },
  clickableText: {
    color: '#5D9FC6',
    fontWeight: '700',
    fontSize: 10,

    textAlign: 'center',
  },
  smallText: {
    marginTop: 5,
    color: '#354259',
    fontWeight: '700',
    fontSize: 10,
    textAlign: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    left: 15,
    bottom: 10,
  },
  logo: {
    position: 'absolute',
    justifyContent: 'center',
    bottom: 30,
    alignItems: 'center',
    resizeMode: 'contain',
    width: 210,
  },
  logoText: {
    marginRight: 20,
    alignContent: 'center',
    bottom: 35,
  },
});

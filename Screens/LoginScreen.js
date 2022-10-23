import React from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  TouchableOpacity,
  Image,
  Al
} from 'react-native';
import {useState, useEffect} from 'react';
import {auth} from '../firebase';
import {useNavigation} from '@react-navigation/core';
import logo from '../assets/logo.png';



const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Logged in with:', user.email);
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
            <Text style={styles.logoText}>Where Are You?</Text>
          </View>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#929292"
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor="#929292"
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.input}
            secureTextEntry={true}
          />
          <Text style={styles.clickableText}>
            Forgot Password?
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <Text style={styles.smallText}>
            New user?
            <Text
              style={styles.clickableText}
              onPress={() => navigation.navigate('Sign up')}>
              Create an Account
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
    
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  inputContainer: {
    width: 299,
    marginTop: 390,
  },
  input: {
    backgroundColor: '#D3DEDC',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 13,
    marginTop: 5,
    marginBottom: 5,
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
    bottom: 37,
    
  },
  logo: {
    position: 'absolute',
    justifyContent: 'center',
    bottom: 30,
    alignItems: 'center',
    resizeMode: 'contain',
    width: 230,
  },
  logoText: {
    marginRight: 20,
    alignContent: 'center',
    bottom: 35,
  },
});

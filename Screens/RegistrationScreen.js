import { StyleSheet, Text, View, KeyboardAvoidingView,
TouchableWithoutFeedback, Keyboard, TouchableOpacity, TextInput } from 'react-native'
import React from 'react'
import {auth} from '../firebase';
import {useState, useEffect} from 'react';


const handleSignUp = () => {
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(userCredentials => {
      const user = userCredentials.user;
      console.log('Created new user:', user.uid);
    })
    .catch(error => alert(error.message));
};

const RegistrationScreen = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Sign Up</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.emailInput}
            placeholder="Email"
            placeholderTextColor="#929292"
            value={email}
            onChangeText={text => setEmail(text)}
          />
          <TextInput style={styles.firstNameInput}>
            <TextInput style={styles.lastNameInput}>
              
            </TextInput>
          </TextInput>

          <TextInput>
            <TextInput></TextInput>
          </TextInput>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleSignUp}></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

export default RegistrationScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer:{
    marginTop: -150,
    width: 299,
    
  },
  emailInput:{
    backgroundColor: '#D3DEDC',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 13,
    marginBottom: 5,
  },
  firstNameInput:{
    
    backgroundColor: '#D3DEDC',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 13,
    marginBottom: 5,
    flexDirection:'row'
    
  },
  lastNameInput:{
    
    backgroundColor: '#D3DEDC',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 13,
    marginBottom: 5,
    flexDirection:'row'
    
  },
  buttonContainer:{

  },
  signUpContainer:{
   bottom: 220,
  },
  signUpText:{
    fontSize: 40,
    fontWeight: 'bold',

  },
})
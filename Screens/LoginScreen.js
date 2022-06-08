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
} from 'react-native';
import {useState} from 'react';
import {auth} from '../firebase';

const LoginScreen = (navigation) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        console.log(user.email);
      })
      .catch(error => alert(error.message));
  };

  return (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS == "ios" ? "padding" : "height" }>
      
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={text => setEmail(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={text => setPassword(text)}
            style={styles.input}
            secureTextEntry={true}
          />
        <Text style={styles.smallText}>
          New user?
          <Text
            style={styles.clickableText}
            onPress={() => navigation.navigate('Registration')}>
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
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#0782f9',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonOutline: {
    backgroundColor: 'white',
    marginTop: 5,
    borderColor: '#0782f9',
    borderWidth: 2,
  },
  buttonOutlineText: {
    color: '#0782f9',
    fontWeight: '700',
    fontSize: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  clickableText: {
    color: '#0782f9',
    fontWeight: '700',
    fontSize: 8,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  smallText: {
    marginTop: 3,
    color: 'grey',
    fontWeight: '700',
    fontSize: 10,
    textAlign: 'center',
  },
});

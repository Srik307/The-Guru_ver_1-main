import React, { useReducer } from 'react';
import { View, Text, TextInput, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { signUp } from '../controllers/AuthControllers';
import { Storeit } from '../controllers/LocalStorage';
import { useAuthStore,useDataStore } from '../datastore/data';
import { postLogin } from '../controllers/Operations';

const initialState = {
  email: '',
  password: '',
  confirmPassword: ''
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };
    case 'SET_CONFIRM_PASSWORD':
      return { ...state, confirmPassword: action.payload };
    default:
      return state;
  }
}

export default function SignupPage({ navigation }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const {setToken}=useDataStore();
  const {isAuthenticated,setIsAuthenticated}=useAuthStore();

  const signup=async()=>{
    if(state.confirmPassword!=state.password){
      alert("Password and Confirm Password should be same");
      return;
    }
    signUp(state).then(async (data)=>{
      //alert(data.token);
      console.log("koko",data);
      await Storeit("token",data.token);
      setToken(data.token);
      await postLogin(data.user,data.token);
      setIsAuthenticated(true);
      navigation.navigate('SetG');
    }
    ).catch((err)=>{
      console.log(err);
    });
  }



  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/i3.png')}  // Ensure this file is a PNG or the correct format
        style={styles.image} 
      />
      <Text style={styles.headerText}>New To Application</Text>
      <Text style={styles.signupText}>Signup Here</Text>
      
      <TextInput 
        placeholder="Enter Email"
        style={styles.input}
        keyboardType="email-address"
        value={state.email}
        onChangeText={(text) => dispatch({ type: 'SET_EMAIL', payload: text })}
      />
      <TextInput 
        placeholder="Enter Password"
        style={styles.input}
        secureTextEntry
        value={state.password}
        onChangeText={(text) => dispatch({ type: 'SET_PASSWORD', payload: text })}
      />
      <TextInput 
        placeholder="Confirm Password"
        style={styles.input}
        secureTextEntry
        value={state.confirmPassword}
        onChangeText={(text) => dispatch({ type: 'SET_CONFIRM_PASSWORD', payload: text })}
      />
      <TouchableOpacity style={styles.signupButton} onPress={signup}>
        <Text style={styles.signupButtonText}>Signup</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8b449',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 300,
    height: 150,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  signupText: {
    fontSize: 18,
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    borderRadius: 25,
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  signupButton: {
    backgroundColor: '#ff8400',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 25,
    marginBottom: 20,
  },
  signupButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  orText: {
    color: '#333',
    marginBottom: 20,
  },
  alreadyHaveAccountText: {
    color: '#333',
  },
  signupLink: {
    color: '#ff8400',
    fontWeight: 'bold',
  },
});

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity,Image} from 'react-native';
import { useAuthStore,useDataStore} from '../datastore/data';
import { Storeit } from '../controllers/LocalStorage';
import { getuser, postLogin } from '../controllers/Operations';

import {ip} from "../datastore/data";


export default function LoginPage({ navigation }) {
 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setIsAuthenticated} = useAuthStore();
  const {setToken,setUser}=useDataStore();


  const Login=(email,password)=>{
    fetch(`${ip}/api/auth/login`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        email:email,
        password:password
      })
    }).then(res=>res.json())
    .then(async data=>{
      if(data.error){
        console.log(data.error);
      }
      else{
        console.log(data.token);
        
        setToken(data.token);
        let curuser=await getuser(data.token);
        setUser(curuser);
        console.log(curuser);
        console.log("going to postlogin");
        await postLogin(curuser,data.token);
        console.log("going to home");
        setIsAuthenticated(true);
      }
    }).catch(err=>{
      console.log(err);
    });

    }


  const handleLogin = () => {
    if(email!="" && password!=""){
      Login(email,password);
    }
  };
  
  return (
    <View style={styles.container}>
    <Image 
        source={require('../assets/i1.png')}  // Ensure this file is a PNG or correct format
        style={styles.image} 
      />
      <Text style={styles.welcomeText}>Welcome Back!!</Text>
      <Text style={styles.loginText}>Login here</Text>
      
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      
      <TouchableOpacity 
        style={styles.loginButton}
        onPress={handleLogin}  // Navigation action
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      
      <Text style={styles.orText}>or</Text>
      
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>
          If you're new to this app Click here to <Text style={styles.signupLink}>Signup</Text>
        </Text>
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
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  loginText: {
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
  loginButton: {
    backgroundColor: '#ff8400',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 25,
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  orText: {
    color: '#333',
    marginBottom: 20,
  },
  signupText: {
    color: '#333',
  },
  signupLink: {
    color: '#ff8400',
    fontWeight: 'bold',
  },
});

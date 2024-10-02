import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function LoadingScreen({ navigation }) {
  return (
    <View style={styles.container}>
        <Text style={{fontSize:40,marginBottom:30}}>THE GURU</Text>
      <Image 
        source={require('../assets/bg.png')}  // Ensure this image path is correct
        style={styles.image} 
      />
      <ActivityIndicator size={100} color="#333" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    backgroundColor: '#f8b449',
    alignItems: 'center',
    justifyContent: 'flex-start',  // Move content upwards
    paddingTop: 50,  // Adjust paddingTop as needed to move content up
    paddingHorizontal: 20,
  },
  image: {
    width: 400,  // Adjusted image size
    height: 220,
    marginBottom: 20,
  },
  pageText: {
    fontSize: 22,  // Slightly smaller font size
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#ff8400',
    paddingVertical: 12,  // Adjusted padding for button
    paddingHorizontal: 60,
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

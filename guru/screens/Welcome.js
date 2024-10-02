import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function Welcome({ navigation }) {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/i1.png')}  // Ensure this image path is correct
        style={styles.image} 
      />
      
      <Text style={styles.pageText}>
        Your Custom tailored life companion inspired by the profound wisdom of the East and the expansive knowledge of the West!
      </Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('SetGoal')}  // Navigate to the Home screen
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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

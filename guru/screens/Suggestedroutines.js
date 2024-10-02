import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import {createSchedule} from '../controllers/Schedule';
import { useDataStore } from '../datastore/data';

import {ip} from "../datastore/data";


const SuggestedRoutinesScreen = () => {

  const {user,setUser}=useDataStore();
  
  const [routines, setRoutines] = useState([]); // Initialize routines state with an empty array
  const navigation = useNavigation(); // Initialize navigation

  useEffect(()=>{
    const fetchSuggested=async()=>{
      console.log('hb');
    let res=await fetch(`${ip}/api/routines/getsuggestedR`,{
          method:"POST"
        });
    res=await res.json();
    console.log(res);
    setRoutines(res.sR);
    }
    fetchSuggested();
  },[]);
  







  const handleRoutinePress = (routine) => {
    navigation.navigate('RoutineDetails', {routinemeta:routine,type:"SR"}); 
    // You can navigate to a detailed view or perform any other action here
  };

  const handleAddRoutine = () => {
   navigation.navigate('AddRoutine'); // Navigate to AddRoutine screen
  };

  const handleDeleteRoutine = (id) => {
    setRoutines(routines.filter(routine => routine.id !== id));
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleRoutinePress(item)}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={styles.itemText}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );


  const renderTaskItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleRoutinePress(item)}>
    <View style={styles.taskContainer}>
      <Text style={styles.taskText}>{item.name}</Text>
    </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        We have crafted this based on your profile
      </Text>

      <FlatList
        data={routines}
        renderItem={renderTaskItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.tasksList}
      />

      <Text style={styles.footerText}>
        You can add your custom routine
      </Text>

      <TouchableOpacity style={styles.addButton} onPress={handleAddRoutine}>
        <Text style={styles.addButtonText}>Add CustomRoutine</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9a825',
    padding: 20,
  },
  headerText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  tasksList: {
    marginTop: 10,
    marginBottom: 20,
  },
  taskContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  taskText: {
    fontSize: 16,
    color: '#000',
  },
  footerText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: "#ff9800",
    borderColor: "#ffffff",
    borderWidth: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SuggestedRoutinesScreen;

import React, { useEffect, useState } from 'react';

import { View, Text, TouchableOpacity,Alert, StyleSheet, FlatList, ScrollView, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import {createSchedule} from '../controllers/Schedule';
import { useDataStore ,useSchedule} from '../datastore/data';

import {ip} from "../datastore/data";
import { deleteRoutine } from '../controllers/Operations';
import { Retrieveit } from '../controllers/LocalStorage';
import { set } from 'date-fns';


const RoutinesScreen = () => {

  const {user,setUser}=useDataStore();
  const {schedules,setSchedule}=useSchedule();
  const [routines, setRoutines] = useState(user.routines||[]);

  useEffect(()=>{
    setRoutines(user.routines);
  },[]); // Initialize routines state with an empty array
  const navigation = useNavigation(); // Initialize navigation

  const handleRoutinePress = (routine) => {
    navigation.navigate('RoutineDetails', {routinemeta:routine }); 
    // You can navigate to a detailed view or perform any other action here
  };

  const handleAddRoutine = () => {
   navigation.navigate('SuggestedRoutines'); // Navigate to AddRoutine screen
  };

  const handleDeleteRoutine = async(routine) => {
    const token=await Retrieveit('token');
    const {newuser,newschedule} = await deleteRoutine(user,routine,token);
    setUser(newuser);
    setSchedule(newschedule);
    setRoutines(newuser.routines);
    alert("Routine Deleted Successfully");
    navigation.navigate('Routines');
  };

  const renderTaskItem = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => handleRoutinePress(item)}>
    <View style={styles.taskContainer}>
      <Text style={styles.itemText} numberOfLines={1} ellipsizeMode="tail">{item.r_name}</Text>
      <TouchableOpacity style={styles.deleteButton}>
      <Ionicons
          name="trash-outline"
          size={24}
          color="#000"
          onPress={() => {
            Alert.alert(
              'Delete Routine',
              `Are you sure you want to delete the routine "${item.r_name}"?`,
              [
                {
                  text: 'Cancel',
                  style: 'cancel',
                },
                {
                  text: 'Delete',
                  onPress: () => handleDeleteRoutine(item),
                  style: 'destructive',
                },
              ],
              { cancelable: true }
            );
          }}
        />
      </TouchableOpacity>
    </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.addButton} onPress={handleAddRoutine}>
        <Text style={styles.addButtonText}>Add Routine</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>On going task</Text>

      <FlatList
        data={routines}
        renderItem={renderTaskItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.tasksList}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9a825',
    padding: 20,
  },
  addButton: {
    backgroundColor: '#ff9800',
    borderWidth: 1,
    borderColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  tasksList: {
    marginTop: 10,
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  taskText: {
    fontSize: 16,
    color: '#000',
  },
  deleteButton: {
    padding: 5,
  },
  itemText: {
    fontSize: 15,
    color: '#000',
    width: '80%',
  },
});

export default RoutinesScreen;

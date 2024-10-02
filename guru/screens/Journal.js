import React, { useEffect, useRef } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // You can use any icon library like react-native-vector-icons
import { useDataStore } from '../datastore/data';
import { Retrieveit } from '../controllers/LocalStorage';
import { updateUser } from '../controllers/UserControllers';
import { useNavigation } from '@react-navigation/native';

const Journal = () => {
  const navigation = useNavigation();
  const { user, setUser } = useDataStore();
  const today = new Date().toISOString().split('T')[0];

  // Initialize the journal value safely, checking for undefined
  const initialValue = (user?.usermeta?.dates && user.usermeta.dates[today] && user.usermeta.dates[today][0]) || '';
  const [value, onChangeText] = React.useState(initialValue);

  const handleJournal = async () => {
    const newUserMeta = { ...user.usermeta }; // Safely copy the usermeta object
    const journal = value;
    console.log("Journal Entry:", user, journal);

    const token = await Retrieveit("token");

    // Safely initialize `dates` and today's entry if undefined
    if (!newUserMeta.dates) {
      newUserMeta.dates = {};
    }
    if (!newUserMeta.dates[today]) {
      newUserMeta.dates[today] = [journal, ""];
    } else {
      newUserMeta.dates[today][0] = journal;
    }

    console.log("Updated User Meta:", { ...user, usermeta: newUserMeta });
    setUser({ ...user, usermeta: newUserMeta });

    await updateUser({ ...user, usermeta: newUserMeta }, token);
    navigation.goBack(); 
  }

  return (
    <View style={styles.container}>
      {/* Text Area for typing */}
      <TextInput
        style={styles.textArea}
        value={value}
        onChangeText={text => onChangeText(text)}
        multiline
      />

      {/* Icon and Submit Button Section */}
      <View style={styles.footerContainer}>
        {/* Icon Section */}
        <View style={styles.iconContainer}>
          <FontAwesome name="microphone" size={24} color="black" />
          <FontAwesome name="image" size={24} color="black" style={styles.icon} />
        </View>
        
        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleJournal}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center', 
  },
  textArea: {
    height: 150,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    textAlignVertical: 'top', 
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 20,
  },
  submitButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Journal;

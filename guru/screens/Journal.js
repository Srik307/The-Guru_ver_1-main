import React, { useEffect, useRef ,useState} from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text, Alert, ScrollView,Image, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; // You can use any icon library like react-native-vector-icons
import { useDataStore } from '../datastore/data';
import { Retrieveit } from '../controllers/LocalStorage';
import { updateJournel } from '../controllers/UserControllers';
import { useNavigation } from '@react-navigation/native';
import JournelListView from '../components/Journel/JournelListView';
import * as ImagePicker from 'expo-image-picker';

const Journal = () => {
  const navigation = useNavigation();
  const { user, setUser } = useDataStore();
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  // Initialize the journal value safely, checking for undefined
  const todayjournel = (user?.usermeta?.dates && user.usermeta.dates[today]) || ['','',null];
  const [value, onChangeText] = React.useState(todayjournel[0]);
  const [imageSrc, setImageSrc] = React.useState(todayjournel[2]);
  const [loading,isLoading]=useState(false);

  const handleInputChange = () => {
    setImageSrc(null);
  };

  const handleJournal = async () => {
    isLoading(true);
    const newUserMeta = { ...user.usermeta }; // Safely copy the usermeta object
    const journal = value;
    console.log("Journal Entry:", user, journal);

    const token = await Retrieveit("token");

    // Safely initialize `dates` and today's entry if undefined
    if (!newUserMeta.dates) {
      newUserMeta.dates = {};
    }
    if (!newUserMeta.dates[today]) {
      newUserMeta.dates[today] = [journal, "",""];
    } else {
      newUserMeta.dates[today][0] = journal;
    }

    console.log("Updated User Meta:", { ...user, usermeta: newUserMeta });
    const usermeta=await updateJournel(user._id,token,newUserMeta,"image",imageSrc,today);
    setUser({ ...user, usermeta: usermeta });
    isLoading(false);
    Alert.alert("Journal Entry Saved!");
  }

  const selectFile = async (type) => {
    try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        let result;
        if (type === 'photo') {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });
        } else if (type === 'video') {
          result = await DocumentPicker.getDocumentAsync({
            type: 'video/*',
        });
        } else if (type === 'audio') {
          result = await DocumentPicker.getDocumentAsync({
            type: 'audio/*',
        });
        }

        if (!result.canceled) {
            const source = { uri: result.assets[0].uri, file: result.assets[0] };
            if (type === 'photo') {
                setImageSrc(source.uri);
            } else if (type === 'video') {
                handleInputChange('setVideoSrc', source);
            } else if (type === 'audio') {
                handleInputChange('setAudioSrc', source);
            }
        }
    } catch (error) {
        console.error('Error selecting file: ', error);
    }
};

  return (
      <ScrollView style={styles.container}>
      {loading ? (
        <View style={{display:"flex",flexDirection:"row",justifyContent:"center",gap:10,alignItems:"center",marginTop:200}}>
          <ActivityIndicator size="large" color="#ff8400" />
          <Text>Loading..</Text>
        </View>
      ) : (
        <>
      {/* Text Area for typing */}
      <Text style={{fontWeight:"bold",margin:5,fontSize:18}}>{new Date().toDateString()}</Text>
      <TextInput
        style={styles.textArea}
        value={value}
        placeholder='Type your thoughts here...'
        onChangeText={text => onChangeText(text)}
        multiline
      />

      {/* Icon and Submit Button Section */}
      <View style={styles.footerContainer}>
        {/* Icon Section */}
        {imageSrc ? (
    <View style={{width:"70%",display:"flex",flexDirection:"row",}}>
    <Image source={{ uri:imageSrc}} style={{width:"100%",height:200}} resizeMode='stretch' />
    <TouchableOpacity style={{position:"absolute",backgroundColor:"white"}} onPress={() => handleInputChange('setImageSrc', { uri: '', file: null })}>
      <FontAwesome name="close" size={24} color="red" />
    </TouchableOpacity>
  </View>
) : (
  <TouchableOpacity style={styles.button} onPress={() => selectFile('photo')}>
            <FontAwesome name="image" size={24} color="black" />
  </TouchableOpacity>
      )}

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleJournal}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      <View style={{borderWidth:1,borderColor:"orange",marginTop:20,padding:5,borderRadius:10,marginBottom:30}}>
        <Text style={{fontWeight:"bold",fontSize:20,marginBottom:10}}>Your Thoughts</Text>
        <JournelListView data={user.usermeta.dates} />
      </View>
      </>)}
    </ScrollView>);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  textArea: {
    height: 150,
    borderColor: 'orange',
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
    padding:5
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
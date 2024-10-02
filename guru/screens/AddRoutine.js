import { View, Text, TextInput, TouchableOpacity, Button, ScrollView, Image, StyleSheet } from 'react-native';
import React, { useEffect, useReducer, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { createNewRoutine } from '../controllers/Operations';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Video } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { Retrieveit } from '../controllers/LocalStorage';
import { useSchedule, useDataStore } from '../datastore/data';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ActivityIndicator } from 'react-native';

const initialState = {
  name: '',
  duration: 0,
  slot: '',
  type: '',
  days: [],
  des: '',
  img: { src: '', file: null },
  vi: { src: '', file: null },
  audio: { src: '', file: null },
  streak: 0,
  cate: 'UR',
  startDate: '',
  endDate: ''
};

const reducer = (state, action) => {
  switch (action.type) {
      case 'setSelectedValue':
          return { ...state, name: action.value };
      case 'setSelectedfreq':
          return { ...state, freq: action.value };
      case 'setSelectedEnd':
          return { ...state, streak: action.value.toString() };
      case 'setSelectedDes':
          return { ...state, des: action.value };
      case 'setSelectedDuration':
          return { ...state, duration: action.value };
      case 'setSelectedTimeSlot':
          return { ...state, slot: action.value };
      case 'setdays':
          return { ...state, days: action.value };
      case 'setStartDate':
          return { ...state, startDate: action.value };
      case 'setEndDate':
          return { ...state, endDate: action.value };
      case 'setImageSrc':
          return { ...state, img: { src: action.value.uri, file: action.value.file } };
      case 'setVideoSrc':
          return { ...state, vi: { ...state.vi, src: action.value.uri, file: action.value.file } };
      case 'setAudioSrc':
          return { ...state, audio: { src: action.value.uri, file: action.value.file } };
      default:
          return state;
  }
};

const AddRoutineScreen = () => {

  const { schedule, setSchedule } = useSchedule();
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigation = useNavigation();
  const { user, setUser } = useDataStore();
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [loading,isLoading]=useState(false);

  const handleInputChange = (type, value) => {
      dispatch({ type: type, value: value });
  };

  const addRoutine = async (category) => {
      try {
        //validate
        if (state.name === '' || state.duration === 0 || state.slot === '' || state.days.length === 0 || state.startDate === '' || state.endDate === '') {
          alert('Please fill all (*) the fields');
          return;
      }
        isLoading(true);
          const formData = new FormData();
          formData.append('name', state.name);
          formData.append('duration', state.duration.toString());
          formData.append('slot', state.slot);
          formData.append('days', JSON.stringify(state.days));
          formData.append('des', state.des);
          formData.append('startDate', state.startDate);
          formData.append('endDate', state.endDate);
          formData.append('streak', state.streak.toString());
          formData.append('cate', 'UR');
          console.log(state);
          
          if (state.img.file) {
              formData.append('img', {
                  uri: state.img.src,
                  name: 'image.jpg',
                  type: 'image/jpeg'
              });
          }

          if (state.vi.file) {
              formData.append('vi', {
                  uri: state.vi.src,
                  name: 'video.mp4',
                  type: 'video/mp4'
              });
          }

          if (state.audio.file) {
              formData.append('audio', {
                  uri: state.audio.src,
                  name: 'audio.mp3',
                  type: 'audio/mpeg'
              });
          }
          const token = await Retrieveit('token');
          const { newuser, newschedule } = await createNewRoutine(user, state, formData, token);
          setUser(newuser);
          setSchedule(newschedule);
          isLoading(false);
          alert("Routine Added");
          navigation.navigate('Routines');
      } catch (error) {
          console.error(error);
          alert('Failed to add routine');
      }
  };

  const changeActive = (index) => {
      let newDays;
      if (state.days.includes(index)) {
          newDays = state.days.filter((i) => i !== index);
      } else {
          newDays = [...state.days, index];
      }
      console.log(state);
      
      dispatch({ type: 'setdays', value: newDays });
  };

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
                  handleInputChange('setImageSrc', source);
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

  const showDatePicker = (type) => {
    if (type === 'start') {
      setShowStartDatePicker(true);
    } else {
      setShowEndDatePicker(true);
    }
  };

  const onChangeDate = (event, selectedDate, type) => {
    setShowStartDatePicker(false);
    setShowEndDatePicker(false);

    if (selectedDate) {
      const currentDate = selectedDate || new Date();
      const formattedDate = currentDate.toISOString().split('T')[0];

      if (type === 'start') {
        handleInputChange('setStartDate', formattedDate);
      } else {
        handleInputChange('setEndDate', formattedDate);
      }
    }
  };

  const changeAll = () => { 
    if (state.days.length==7) {
      dispatch({ type: 'setdays', value: [] });
    } else {
      dispatch({ type: 'setdays', value: [0,1,2,3,4,5,6] });
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {loading ? (
        <View style={{display:"flex",flexDirection:"row",justifyContent:"center",gap:10,alignItems:"center"}}>
          <ActivityIndicator size="large" color="#ff8400" />
          <Text>Loading..</Text>
        </View>
      ) : (
        <View>
        <Text style={styles.label}>Routine Name <Text style={{color:"red"}}>*</Text></Text>
        <TextInput
          style={styles.input}
          placeholder='Enter Routine Name'
          onChangeText={(value) => handleInputChange('setSelectedValue', value)}
        />
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder='Enter description'
          multiline
          onChangeText={(value) => handleInputChange('setSelectedDes', value)}
        />
        <Text style={styles.label}>Duration (in minutes) <Text style={{color:"red"}}>*</Text></Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={state.duration}
            onValueChange={(value) => handleInputChange('setSelectedDuration', value)}
          >
            <Picker.Item label="Select Duration" value={0} />
            {Array.from({ length: 60 }, (_, i) => (
              <Picker.Item key={i + 1} label={`${i + 1} minute${i + 1 > 1 ? 's' : ''}`} value={i + 1} />
            ))}
          </Picker>
        </View>
        <Text style={styles.label}>Time Slot <Text style={{color:"red"}}>*</Text></Text>
        <View style={styles.pickerContainer}>
          <Picker
           placeholder='Select'
            selectedValue={state.slot}
            onValueChange={(value) => handleInputChange('setSelectedTimeSlot', value)}
          >
            {/* <Picker.Item label="Select Time Slot" value="" />
            <Picker.Item label="12 AM - 1 AM" value="12 AM - 1 AM" />
            <Picker.Item label="1 AM - 2 AM" value="1 AM - 2 AM" />
            <Picker.Item label="2 AM - 3 AM" value="2 AM - 3 AM" />
            <Picker.Item label="3 AM - 4 AM" value="3 AM - 4 AM" />
            <Picker.Item label="4 AM - 5 AM" value="4 AM - 5 AM" />
            <Picker.Item label="5 AM - 6 AM" value="5 AM - 6 AM" />
            <Picker.Item label="6 AM - 7 AM" value="6 AM - 7 AM" />
            <Picker.Item label="7 AM - 8 AM" value="7 AM - 8 AM" />
            <Picker.Item label="8 AM - 9 AM" value="8 AM - 9 AM" />
            <Picker.Item label="9 AM - 10 AM" value="9 AM - 10 AM" />
            <Picker.Item label="10 AM - 11 AM" value="10 AM - 11 AM" />
            <Picker.Item label="11 AM - 12 PM" value="11 AM - 12 PM" />
            <Picker.Item label="12 PM - 1 PM" value="12 PM - 1 PM" />
            <Picker.Item label="1 PM - 2 PM" value="1 PM - 2 PM" />
            <Picker.Item label="2 PM - 3 PM" value="2 PM - 3 PM" />
            <Picker.Item label="3 PM - 4 PM" value="3 PM - 4 PM" />
            <Picker.Item label="4 PM - 5 PM" value="4 PM - 5 PM" />
            <Picker.Item label="5 PM - 6 PM" value="5 PM - 6 PM" />
            <Picker.Item label="6 PM - 7 PM" value="6 PM - 7 PM" />
            <Picker.Item label="7 PM - 8 PM" value="7 PM - 8 PM" />
            <Picker.Item label="8 PM - 9 PM" value="8 PM - 9 PM" />
            <Picker.Item label="9 PM - 10 PM" value="9 PM - 10 PM" />
            <Picker.Item label="10 PM - 11 PM" value="10 PM - 11 PM" />
            <Picker.Item label="11 PM - 12 AM" value="11 PM - 12 AM" /> */}
            <Picker.Item label="Morning" value="Morning" />
            <Picker.Item label="Afternoon" value="Afternoon" />
            <Picker.Item label="Evening" value="Evening" />
            <Picker.Item label="Night" value="Night" />          
            
          </Picker>
        </View>
        <Text style={styles.label}>Start Date <Text style={{color:"red"}}>*</Text></Text>
        <TouchableOpacity onPress={() => showDatePicker('start')} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>{state.startDate || 'Select Start Date'}</Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={(e, selectedDate) => onChangeDate(e, selectedDate, 'start')}
          />
        )}
        <Text style={styles.label}>End Date <Text style={{color:"red"}}>*</Text></Text>
        <TouchableOpacity onPress={() => showDatePicker('end')} style={styles.dateButton}>
          <Text style={styles.dateButtonText}>{state.endDate || 'Select End Date'}</Text>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={new Date()}
            mode="date"
            display="default"
            onChange={(e, selectedDate) => onChangeDate(e, selectedDate, 'end')}
          />
        )}
        <Text style={styles.label}>Days <Text style={{color:"red"}}>*</Text></Text>
        <View style={styles.daysContainer}>
        <TouchableOpacity
              key={0}
              onPress={() => changeAll()}
              style={[styles.dayButton, state.days.length==7 && styles.activeDayButton]}
            >
              <Text style={styles.dayText}>All</Text>
            </TouchableOpacity>
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fri', 'Sat'].map((day, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => changeActive(index)}
              style={[styles.dayButton, state.days.includes(index) && styles.activeDayButton]}
            >
              <Text style={styles.dayText}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Select an Image</Text>
        {state.img.src ? (
  <View style={styles.imageContainer}>
        <TouchableOpacity style={{alignContent:"flex-end"}} onPress={() => handleInputChange('setImageSrc', { uri: '', file: null })}>
      <Ionicons name="close-circle" size={24} color="red" />
    </TouchableOpacity>
    <Image source={{ uri: state.img.src }} style={styles.image} />
  </View>
) : (
  <TouchableOpacity style={styles.button} onPress={() => selectFile('photo')}>
    <Text style={styles.buttonText}>Upload Image</Text>
  </TouchableOpacity>
)}
        <Text style={styles.label}>Select a Video</Text>
        {state.vi.src ? (<>
                  <TouchableOpacity style={{alignContent:"flex-end"}} onPress={() => handleInputChange('setVideoSrc', { uri: '', file: null })}>
                  <Ionicons name="close-circle" size={24} color="red" />
                </TouchableOpacity>
          <Video source={{ uri: state.vi.src }} style={styles.video} useNativeControls />
          </>
        ) : (
          <TouchableOpacity style={styles.button} onPress={() => selectFile('video')}>
            <Text style={styles.buttonText}>Upload Video</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.label}>Select Audio</Text>
        {state.audio.src ? (<>
          <TouchableOpacity style={{alignContent:"flex-end"}} onPress={() => handleInputChange('setAudioSrc', { uri: '', file: null })}>
                  <Ionicons name="close-circle" size={24} color="red" />
                </TouchableOpacity>
          <Text style={styles.audioText}>{state.audio.src.split('/').pop()}</Text>
          </>
        ) : (
          <TouchableOpacity style={styles.button} onPress={() => selectFile('audio')}>
            <Text style={styles.buttonText}>Upload Audio</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.submitButton} onPress={() => addRoutine('UR')}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: '12%',
    alignItems: 'center',
  },
  activeDayButton: {
    backgroundColor: '#f0ad4e',
  },
  dayText: {
    fontSize: 8,
  },
  button: {
    backgroundColor: '#ff8400',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  video: {
    width: '100%',
    height: 200,
    marginBottom: 16,
  },
  audioText: {
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#ff8400',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  dateButtonText: {
    fontSize: 16,
    color: 'black',
  },
});

export default AddRoutineScreen;

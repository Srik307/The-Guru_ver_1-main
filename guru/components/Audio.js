import React, { useState, useEffect } from 'react';
import { View, Button, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const AudioComp = ({ source, isPlayingTimer }) => {
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [inter,setInter]=useState(null);

  async function playSound() {
    /*
    if (!isPlayingTimer) return; // Prevent playing if timer is false */
    if (sound && isPlaying) return; // Avoid creating new sound if one is already playing
    try {
      console.log('Loading Sound');
      const { sound} = await Audio.Sound.createAsync(
        { uri: source },
        { shouldPlay: true, isLooping: repeat }, // Utilize isLooping
      );
      setSound(sound);
      setIsPlaying(true);
      let duration=await sound.getStatusAsync();
      duration=duration.durationMillis;
      const interl=setInterval(async() => {
        if (repeat) {
          if(sound){
          await sound.replayAsync();}
        }
        else{
          stopSound(sound);
          clearInterval(interl);
        }
      }
      ,duration);
      setInter(interl);
      console.log('Playing Sound');
    } catch (error) {
      console.error('Error loading sound:', error);
    }
  }

  useEffect(() => {
    if (!isPlayingTimer && sound) {
clearInterval(inter);
      stopSound();
      // Stop sound when timer becomes false
    }
  }, [isPlayingTimer]);

  async function stopSound(newsound) {
    console.log('Stopping Sound');
    if(sound!=null){
    await sound?.stopAsync();
    await sound?.unloadAsync();}
    else{
      await newsound?.stopAsync();
      await newsound?.unloadAsync();
    }
    setIsPlaying(false);
    setSound(null); // Clear sound object after stopping
  }

  useEffect(() => {
    return async() =>{
      if (sound) {
        console.log('Unloading Sound');
        await sound.unloadAsync();
      }
    };
  }, [sound]);

  const handleRepeatPress = async () => {
    setIsPlaying(false);
    stopSound();
    clearInterval(inter); // Stop sound before changing repeat state
    setRepeat(!repeat);
  };

  return (
    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <TouchableOpacity
        style={{
          padding: 10,
          backgroundColor: 'orange',
          borderRadius: 10,
          width: '50%',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: 10,
        }}
        onPress={isPlaying ? stopSound : playSound}
      >
        <Text>{isPlaying ? 'Stop' : 'Play'} Sound</Text>
        {isPlaying && <MaterialIcons name="multitrack-audio" size={24} color="black" />}
      </TouchableOpacity>

      <TouchableOpacity onPress={handleRepeatPress}>
        <MaterialIcons style={{ color: repeat ? 'orange' : 'black', fontWeight: 'bold' }} name="repeat" size={30} />
      </TouchableOpacity>
    </View>
  );
};

export default AudioComp;

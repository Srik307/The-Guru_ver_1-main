import React, { useState, useEffect } from 'react';
import { View, Button, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const AudioComp = ({ source,isPlayingTimer}) => {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [inter,setInter]=useState(null);


  async function playSound() {
    try {
      console.log('Loading Sound');
      const { sound } = await Audio.Sound.createAsync(
        { uri: source },
        { shouldPlay: true },
      );
      await sound.playAsync(); 
      setSound(sound);
      setIsPlaying(true);
      console.log('Playing Sound');
      if(isPlayingTimer){
        let duration=await sound.getStatusAsync();
        duration=duration.durationMillis;
        const interl=setInterval(async()=>{
          sound.replayAsync();
        if(!isPlayingTimer){
          clearInterval(inter);
        }}
        ,duration);
        setInter(interl);
      }
    } catch (error) {
      console.error('Error loading sound:', error);
    }
  }



  useEffect(() => {
    if(inter!=null){
      clearInterval(inter);
      stopSound();
      return;
    }
    if(isPlayingTimer && isPlaying){
      stopSound();
    }
  }, [isPlayingTimer]);

  async function stopSound() {
    console.log('Stopping Sound');
    setIsPlaying(false);
    clearInterval(inter);
    await sound?.stopAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <View>
      <TouchableOpacity style={{ padding: 10 ,backgroundColor:"orange",borderRadius:10,width:"100%",alignItems:"center",display:"flex",flexDirection:"row",justifyContent:"center",gap:10}}
        onPress={isPlaying ? stopSound : playSound} >
        <Text>{isPlaying ? 'Stop' : 'Play'} Sound</Text>
        {isPlaying && (
          <MaterialIcons name="multitrack-audio" size={24} color="black" />
              )}
      </TouchableOpacity>
    </View>
  );
};

export default AudioComp;
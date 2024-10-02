import React, { useState, useEffect } from 'react';
import { View, Button, Text, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';

const AudioComp = ({ source, rep }) => {
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);

  async function playSound() {
    try {
      console.log('Loading Sound');
      const { sound } = await Audio.Sound.createAsync(
        { uri: source },
        { shouldPlay: true }
      );
      setSound(sound);
      setIsPlaying(true);
      console.log('Playing Sound');
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish && playCount < rep - 1) {
          setPlayCount(playCount + 1);
          sound.replayAsync();
        } else if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    } catch (error) {
      console.error('Error loading sound:', error);
    }
  }

  async function stopSound() {
    console.log('Stopping Sound');
    setIsPlaying(false);
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
      <TouchableOpacity style={{ padding: 10 ,backgroundColor:"orange",borderRadius:10,width:"100%",alignItems:"center"}}
        onPress={isPlaying ? stopSound : playSound} >
        <Text>{isPlaying ? 'Stop' : 'Play'} Sound</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AudioComp;
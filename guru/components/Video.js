import React, { useState, useEffect } from 'react';
import { View, Button ,TouchableOpacity,Text} from 'react-native';
import { Video } from 'expo-av';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const VideoComp = ({ source,isPlayingTimer}) => {
  const [videoRef, setVideoRef] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeat, setRepeat] = useState(false);

  const playVideo = async () => {
    if (videoRef) {
      setIsPlaying(true);
      await videoRef.playAsync();
    }
  };

  const stopVideo = async () => {
    if (videoRef) {
      setIsPlaying(false);
      await videoRef.stopAsync();
    }
  };

  useEffect(() => {
    if (isPlaying){
      stopVideo();
    }
  } 
  ,[isPlayingTimer]);


  const handleRepeatPress = () => {
    setRepeat(!repeat);
  }

  return (
    <View>
      <Video
        ref={(ref) => setVideoRef(ref)}
        source={{ uri: source }}
        style={{ width: 300, height: 200 }}
        useNativeControls
        resizeMode="contain"
        isLooping={repeat}
      />
    <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',marginTop:20}}>
      <Text>Repeat Mode</Text>
      <TouchableOpacity onPress={handleRepeatPress}>
        <MaterialIcons style={{ color: repeat ? 'orange' : 'black', fontWeight: 'bold' }} name="repeat" size={30} />
      </TouchableOpacity>
    </View>
    </View>
  );
};

export default VideoComp;
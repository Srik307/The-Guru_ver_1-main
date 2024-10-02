import React, { useState, useEffect } from 'react';
import { View, Button ,TouchableOpacity,Text} from 'react-native';
import { Video } from 'expo-av';

const VideoComp = ({ source, rep }) => {
  const [videoRef, setVideoRef] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playCount, setPlayCount] = useState(0);

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
    if (videoRef) {
      videoRef.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish && playCount < rep - 1) {
          setPlayCount(playCount + 1);
          videoRef.replayAsync();
        } else if (status.didJustFinish) {
          setIsPlaying(false);
        }
      });
    }
  }, [videoRef, playCount, rep]);

  return (
    <View>
      <Video
        ref={(ref) => setVideoRef(ref)}
        source={{ uri: source }}
        style={{ width: 300, height: 200 }}
        useNativeControls
        resizeMode="contain"
        isLooping={false}
      />
      <TouchableOpacity style={{ padding: 10 ,backgroundColor:"orange",borderRadius:10,width:"100%",alignItems:"center"}}
        onPress={isPlaying ? stopVideo : playVideo} >
        <Text>{isPlaying ? 'Stop' : 'Play'} Sound</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VideoComp;
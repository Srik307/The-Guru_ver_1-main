import React, { useState } from 'react';
import { Text, Image,View, TouchableOpacity } from 'react-native';
import img from '../../assets/bird.jpg';
import {LinearGradient} from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

const JournelView = ({date,journel,show,setShow,index}) => {
    console.log(journel);
    const emoji={'amazing':'😍','good':'😊','okay':'😐','bad':'😞','terrible':'😢'};
    return (
        <View style={{marginBottom:20}}>
        <LinearGradient 
        colors={['#FEAC5E','#C779D0','#4BC0C8']}
        start={{ x: 0.2, y: 0.5 }}
        style={{borderRadius:15}}>
        <TouchableOpacity onPress={()=> {if(show==index){setShow(null)}else{setShow(index)}}} style={{width:"100%",display:"flex",flexDirection:"row",justifyContent:"space-between",padding:10}}>
            <Text style={{fontWeight:"bold"}}>{date}</Text>
            <View style={{display:"flex",flexDirection:'row',gap:10,alignItems:"center"}}>           
            <Text style={{fontSize:16}}>{emoji[journel[1]]}</Text>
            {show==index ? <FontAwesome name='chevron-up' size={18} color='white' /> :
            <FontAwesome name='chevron-down' size={18} color='white' />}
            </View>
        </TouchableOpacity>
        { show==index &&
        <View style={{padding:10,borderTopWidth:1}}>
        <Text style={{marginBottom:10,fontWeight:"bold"}}>{journel[0]}</Text>
        {journel[2] && <Image source={{uri:journel[2]}} style={{margin:"auto",width:"100%",height:500,borderRadius:10}} />}
        </View>
        }
        </LinearGradient>
        </View>
    );
    }

export default JournelView;
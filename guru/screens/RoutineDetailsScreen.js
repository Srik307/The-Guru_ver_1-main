import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from "react-native";
import { Audio } from 'expo-av';

import { Retrieveit } from "../controllers/LocalStorage";
import AudioComp from "../components/Audio";
import VideoComp from "../components/Video";
import { useSchedule } from "../datastore/data";
import { format, isPast } from "date-fns";
import { ip } from "../datastore/data";
import { addSRoutine } from "../controllers/Operations";
import { useDataStore } from "../datastore/data";

import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Ionicons } from "@expo/vector-icons";

import bg from "../assets/bg.png";

import alertaudio from "../assets/alert.mp3";

export default function RoutineDetailsScreen({ route, navigation }) {
  const { routinemeta, type, selectedDate } = route.params;
  const { schedules, setSchedule } = useSchedule();
  const [routine, setRoutine] = useState(null);
  const { user, setUser } = useDataStore();
  const [isPlaying, setIsPlaying] = useState(false); // New state for timer control
  const [isrestart, setIsRestart] = useState(true); // New state for timer control

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        if (type === "SR") {
          return setRoutine(routinemeta);
        }
        const fetchedRoutine = await Retrieveit(routinemeta.r_id);
        setRoutine(fetchedRoutine);
      } catch (error) {
        console.error("Error fetching routine:", error);
      }
    };
    fetchRoutine();
  }, [routinemeta.r_id]);

  const completeRoutine = () => {
    const updatedSchedules = { ...schedules };
    let date = format(new Date(), "yyyy-MM-dd");

    if (selectedDate === date && updatedSchedules[date]) {
      const routineIndex = updatedSchedules[date].findIndex(
        (r) => r.r_id === routinemeta.r_id
      );
      if (routineIndex !== -1) {
        updatedSchedules[date][routineIndex].completed = true;
        routinemeta.completed = true;
        setSchedule(updatedSchedules);
        alert("Routine completed!");
      }
    } else {
      alert("You can't perform this now!");
    }
  };

const UncompleteRoutine = () => {
    const updatedSchedules = { ...schedules };
    let date = format(new Date(), "yyyy-MM-dd");
    if (selectedDate === date && updatedSchedules[date]) {
      const routineIndex = updatedSchedules[date].findIndex(
        (r) => r.r_id === routinemeta.r_id
      );
      if (routineIndex !== -1) {
        updatedSchedules[date][routineIndex].completed = false;
        routinemeta.completed = false;
        setSchedule(updatedSchedules);
        alert("Routine marked as incomplete!");
      }
    }
    else{
        alert("You can't perform this now!");
    }
  };

  const addSuggestedRoutine = async () => {
    try {
      const token = await Retrieveit("token");
      const { newuser, newschedule } = await addSRoutine(user, routine, token);
      setUser(newuser);
      setSchedule(newschedule);
      alert("Suggested Routine Added");
    } catch (error) {
      console.error(error);
    }
  };

  const parseDays = (days) => {
    if (!days) return "";
    return days
      .map((day) => {
        switch (day) {
          case 0:
            return "Sun";
          case 1:
            return "Mon";
          case 2:
            return "Tue";
          case 3:
            return "Wed";
          case 4:
            return "Thu";
          case 5:
            return "Fri";
          case 6:
            return "Sat";
          default:
            return "";
        }
      })
      .join(", ");
  }


  const AlertSound=async()=>{
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync(alertaudio);
      await soundObject.playAsync();
    } catch (error) {
      console.log("Error playing sound",error);
    }
  }


  const Restart=()=>{
    setIsRestart(false);
    setTimeout(() => {
      setIsRestart(true);
    }, 100);
  }

  const handleComplete=()=>{
    AlertSound();
    Alert.alert("Routine Update", "Do you want to mark as complete", [
      {
        text: "Complete",
        onPress: () => {
          completeRoutine();
        },
      },
      {
        text: "Cancel",
        onPress: () => {Restart()},
        style: "cancel",
      },
    ]);
    setIsPlaying(false);
  }


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ImageBackground source={bg} >
      {routine != null && (
        <>
          <Text style={styles.title}>{routine.name}</Text>

          <View style={styles.section}>
            <Text style={styles.text}>{routine.des}</Text>
          </View>

                    {/* Streak or Date Information */}
                    {type === "SR" ? (
            <View style={styles.section}>
              <Text style={styles.label}>Streak:</Text>
              <Text style={styles.text}>{routine.streak || "0"} Days</Text>
            </View>
          ) : (
            <>
              <View style={styles.section}>
                <Text style={styles.label}>Start Date:</Text>
                <Text style={styles.text}>{routine.startDate || "N/A"}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.label}>End Date:</Text>
                <Text style={styles.text}>{routine.endDate || "N/A"}</Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.label}>Days:</Text>
                <Text style={{...styles.text,fontSize:14}}>{parseDays(routine.days)|| "N/A"}</Text>
              </View>
            </>
          )}

          {/* Image Section */}
          {routine.img && routine.img.src && (
            <View style={styles.sectionlarge}>
              <Text style={{...styles.label,color:"white",backgroundColor:"#000",padding:5,borderWidth:1,borderRadius:10}}>Routine Image</Text>
              <Image
                source={{ uri: `${routine.img.src}?t=${routine.__v}` }}
                style={styles.image}
              />
            </View>
          )}

          {/* Video Section */}
          {routine.vi && routine.vi.src && (
            <View style={styles.sectionlarge}>
              <Text style={{...styles.label,color:"white",backgroundColor:"#000",padding:5,borderWidth:1,borderRadius:10}}>Routine Video</Text>
              <VideoComp isPlayingTimer={isPlaying} source={`${routine.vi.src}`} />
            </View>
          )}

          {/* Audio Section */}
          {routine.au && routine.au.src && (
            <View style={styles.sectionlarge}>
              <Text style={{...styles.label,color:"white",backgroundColor:"#000",padding:5,borderWidth:1,borderRadius:10}}>Routine Audio</Text>
              <AudioComp isPlayingTimer={isPlaying} source={`${routine.au.src}`} />
            </View>
          )}

{/* Timer Section with Start Button */}
{selectedDate && routinemeta && routine.duration && !routinemeta.completed && (
            <View style={styles.sectionCentered}>
              {isrestart && (
              <CountdownCircleTimer
                isPlaying={isPlaying}
                duration={parseInt(routine.duration)*60}
                colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                colorsTime={[7, 5, 2, 0]}
                size={200}
                onComplete={() => {
                  handleComplete();
                  return [false, 0];
                }}
              >
                {({ remainingTime }) => (
                  <View>
                <><Text style={styles.label}>Time Remaining:</Text>
                    <Text style={styles.text}>{Math.floor(remainingTime/60)} mins, {remainingTime%60} secs</Text>
                    </>
                  </View>
                )}
              </CountdownCircleTimer>
              )}
              <View style={{display:"flex",flexDirection:"row",gap:100}}>
              <Ionicons name="refresh" size={30} color="black" onPress={Restart} />
                {/*pause and play*/}
                {isPlaying && (
                  <Ionicons name="pause" size={30} color="black" onPress={() => setIsPlaying(false)} />
                )}
                {!isPlaying && (
                  <Ionicons name="play" size={30} color="black" onPress={() => setIsPlaying(true)} />
                )}
                </View>
              {/* Start Timer Button */}
            </View>
          )}
        </>
      )}

      {/* Complete Routine Button */}
      {routinemeta.completed !== undefined && (
        routinemeta.completed?
        <TouchableOpacity
        style={{...styles.buttonContainer,backgroundColor:"green"}}
          onPress={UncompleteRoutine}
        >
          <Text style={{color:"white"}}>Completed</Text>
        </TouchableOpacity>
      :
      <TouchableOpacity
            onPress={handleComplete}  style={{...styles.buttonContainer,backgroundColor:"#004777"}}
          >
            <Text style={{color:"white"}}>Mark as Completed</Text>
            </TouchableOpacity>
      )}

      {/* Add Suggested Routine Button */}
      {type === "SR" && (
        <View style={styles.buttonContainer}>
          <Button title="Add to My Routines" onPress={addSuggestedRoutine} />
        </View>
      )}
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 5,
    backgroundColor: "#f0f4f7", // Light background for a clean look
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20, // Theme color for the title
  },
  section: {
    display:"flex",
    flexDirection:"row",
    justifyContent:"space-between",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    backgroundColor: "rgba(255,255,255,0.6)", 
    // low opacity white background for sections
    shadowColor: "#fff", // Adding shadow to sections
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor:"#000", // Shadow effect for Android
    borderWidth: 1, // Light border around each section
  },
  sectionlarge: {
    display:"flex",
    flexDirection:"column",
    backgroundColor: "rgba(255,255,255,0.8)", // low opacity white background for sections
    justifyContent:"space-between",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#fff", // Adding shadow to sections
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderColor:"#000", // Shadow effect for Android
    borderWidth: 1,
  },
  sectionCentered: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    alignItems: "center", // Centering the content
    shadowColor: "#000", // Adding shadow to sections
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Shadow effect for Android
    borderColor: "#e0e0e0",
    borderWidth: 1, // Light border around each section
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
    textAlign: "center",
  },
  text: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
    resizeMode: "cover",
    borderColor: "#d1e8ff", // Border around the image
    borderWidth: 2,
  },
  video: {
    width: "100%",
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    display:"flex",
    flexDirection:"row",
    marginTop: 20, // Button theme color
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    marginBottom: 20,
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 10,
    justifyContent: "center",
  },
});

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
} from "react-native";
import { Video } from "expo-av";
import { Audio as ExpoAudio } from "expo-av"; // Ensure this import is correct

import { Retrieveit } from "../controllers/LocalStorage";
import AudioComp from "../components/Audio";
import VideoComp from "../components/Video";
import { useSchedule } from "../datastore/data";
import { format } from "date-fns";
import { ip } from "../datastore/data";
import { addSRoutine } from "../controllers/Operations";
import { useDataStore } from "../datastore/data";

import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { Ionicons } from "@expo/vector-icons";

import bg from "../assets/bg.png";

export default function RoutineDetailsScreen({ route, navigation }) {
  const { routinemeta, type, selectedDate } = route.params;
  const { schedules, setSchedule } = useSchedule();
  const [routine, setRoutine] = useState(null);
  const { user, setUser } = useDataStore();
  const [isPlaying, setIsPlaying] = useState(false); // New state for timer control

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
            </>
          )}

          {/* Image Section */}
          {routine.img && routine.img.src && (
            <View style={styles.sectionlarge}>
              <Text style={styles.label}>Routine Image:</Text>
              <Image
                source={{ uri: `${routine.img.src}?t=${routine.__v}` }}
                style={styles.image}
              />
            </View>
          )}

          {/* Video Section */}
          {routine.vi && routine.vi.src && (
            <View style={styles.sectionlarge}>
              <Text style={styles.label}>Routine Video:</Text>
              <VideoComp rep={routine.vi.fr} source={`${routine.vi.src}`} />
            </View>
          )}

          {/* Audio Section */}
          {routine.au && routine.au.src && (
            <View style={styles.sectionlarge}>
              <Text style={styles.label}>Routine Audio:</Text>
              <AudioComp rep={routine.au.fr} source={`${routine.au.src}`} />
            </View>
          )}

{/* Timer Section with Start Button */}
{selectedDate && routinemeta && routine.duration && !routinemeta.completed && (
            <View style={styles.sectionCentered}>
              <CountdownCircleTimer
                isPlaying={isPlaying}
                duration={parseInt(routine.duration)*60}
                colors={['#004777', '#F7B801', '#A30000', '#A30000']}
                colorsTime={[7, 5, 2, 0]}
                size={200}
                onComplete={() => {
                  completeRoutine();
                  return [false, 0];
                }}
              >
                {({ remainingTime }) => (
                  <View>
                {!isPlaying && (
                  <Button style={styles.buttonContainer}
                    title="Start Timer"
                    onPress={() => setIsPlaying(true)} // Start the timer
                  />
              )}
              {isPlaying && (
                <><Text style={styles.label}>Time Remaining:</Text>
                    <Text style={styles.text}>{Math.floor(remainingTime/60)} mins, {remainingTime%60} secs</Text>
                    </>)}
                  </View>
                )}
              </CountdownCircleTimer>
              <Ionicons name="refresh" size={30} color="black" onPress={() => setIsPlaying(false)} />

              {/* Start Timer Button */}
            </View>
          )}
        </>
      )}

      {/* Complete Routine Button */}
      {routinemeta.completed !== undefined && (
        <View style={styles.buttonContainer}>
          <Button
            title="Mark as Complete"
            onPress={completeRoutine}
            disabled={routine && routinemeta.completed}
          />
        </View>
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
    fontSize: 30,
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
    justifyContent:"space-between",
    backgroundColor: "transparent",
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
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
    textAlign: "center",
  },
  text: {
    fontSize: 18,
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
    marginTop: 20,
    backgroundColor: "#4a90e2", // Button theme color
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
});

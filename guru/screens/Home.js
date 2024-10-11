import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native';
import { useSchedule, useAuthStore, useDataStore, ip } from '../datastore/data';
import { Retrieveit } from '../controllers/LocalStorage';
import { updateUser } from '../controllers/UserControllers';
import bg from "../assets/bg.png";
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = ({navigation}) => {
  const { schedules, setSchedule } = useSchedule();
  const { user, setUser } = useDataStore();
  const { authenticated, setIsAuthenticated } = useAuthStore();
  const [tasks, setTasks] = useState([]);
  const [greeting, setGreeting] = useState("Good Morning");
  const feelings = ['amazing', 'good', 'okay', 'bad', 'terrible'];
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const LoadSchedule = async () => {
      try {
        const schedule1 = await Retrieveit("@schedule");
        console.log("neeee", schedule1, `${ip}${user.photo}`);
        
        if (schedule1 !== null) {
          let date = new Date().toISOString().split('T')[0];
          console.log(schedule1[date]);
          
          setTasks(schedule1[date] || []);
          setSchedule(schedule1);
        }
      } catch (error) {
        console.error('Error loading schedule:', error);
      }
    };
    LoadSchedule();

    // Set greeting based on the time of day
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour < 17) {
      setGreeting("Good Afternoon");
    } else if (currentHour < 20) {
      setGreeting("Good Evening");
    } else {
      setGreeting("Good Night");
    }
  }, []);

  const handleEmoji = async (feeling) => {
    const newuser = { ...user.usermeta }; // Clone usermeta to avoid direct mutation
    console.log("ggg", user);

    const token = await Retrieveit("token");

    // Ensure usermeta and dates objects exist
    if (!newuser.dates) {
      newuser.dates = {};
    }

    if (!newuser.dates[today]) {
      newuser.dates[today] = ["", feeling];
    } else {
      newuser.dates[today][1] = feeling;
    }

    console.log("g", { ...user, usermeta: newuser });
    setUser({ ...user, usermeta: newuser }); // Update the user state
    await updateUser({ ...user, usermeta: newuser }, token); // Persist the change
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={{ flex: 1, alignItems: 'center',padding:5 }}>
        <LinearGradient 
        colors={['#4BC0C8','#FEAC5E']}
        start={{ x: 0.1, y: 0.2 }}
        style={styles.image}>
          {/* Wishing text, username, and quote */}
          <View style={styles.overlayTextContainer}>
            <Text style={styles.wishingText}>{greeting},</Text>
            <Text style={styles.usernameText}>{user.name}</Text>
            <Text style={styles.quoteText}>“Believe you can and you're halfway there.”</Text>
          </View>
          </LinearGradient>
        </View>

        {/* Mood Container */}
        <View style={styles.moodContainer}>
          <Text style={styles.moodText}>How was Your Day?</Text>
          <View style={styles.moodButtons}>
            {['😍', '😊', '😐', '😞', '😢'].map((emoji, index) => (
              <TouchableOpacity
                key={index}
                style={(user.usermeta?.dates?.[today]?.[1] === feelings[index])
                  ? { ...styles.moodButton, backgroundColor: "orange" }
                  : styles.moodButton}
                onPress={() => {
                  user.usermeta?.dates?.[today]?.[1] !== feelings[index]
                    ? handleEmoji(feelings[index])
                    : handleEmoji("");
                }}>
                <Text style={styles.emojiText}>{emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Image source={bg} width={50} height={50} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems:"center",
  },
  overlayTextContainer: {
    position: 'absolute',
    top: '40%',
    alignItems: 'center',
  },
  wishingText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  usernameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  quoteText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginTop: 5,
  },
  moodContainer: {
    backgroundColor: '#ffda8b',
    padding: 20,
    borderRadius: 10,
    margin: 5,
    alignItems: 'center',
    overflow: 'hidden',
  },
  moodText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  moodButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    width: '100%',
  },
  moodButton: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emojiText: {
    fontSize: 24,
  },
  checklistTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  taskContainer: {
    backgroundColor: '#ffda8b',
    padding: 20,
    borderRadius: 10,
    margin: 10,
  },
  taskTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  taskDescription: {
    fontSize: 14,
    color: '#333',
    marginVertical: 5,
  },
  startButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  startButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default HomeScreen;

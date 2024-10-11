import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Consistently using Ionicons
import JournelView from '../components/Journel/JournelView';
import { useSchedule, useAuthStore, useDataStore, ip } from '../datastore/data';

const TaskManager = ({ navigation }) => {
  const { schedules } = useSchedule();
  const [routinesForDate, setRoutineForDate] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { user, setUser } = useDataStore();
  const [show,setShow]=useState(null);
  const handleDateSelect = (day) => {
    console.log('Selected Date:', day.dateString);
    setSelectedDate(day.dateString);

    const routines = schedules[day.dateString] || [];
    setRoutineForDate(routines);
    console.log('Routines for Selected Date:', routines);
  };

  useEffect(() => {
    handleDateSelect({ dateString: selectedDate });
  }, [schedules]);

  // Count completed routines
  const perOfComp = (routines, flag) => {
    let completed = 0;
    let total = 0;
    for (let i = 0; i < routines.length; i++) {
      if (routines[i].completed) {
        completed++;
      }
      total++;
    }
    if (flag === 0) return completed; // Return completed count if flag is 0
    return total; // Return total count otherwise
  };

  const timesionicons = ['albums', 'checkmark-done-circle-outline'];

  return (
    <ScrollView style={styles.container}>
      <View>
        <Calendar
          style={{ marginBottom: 20 }}
          onDayPress={handleDateSelect}
          markedDates={{
            [selectedDate]: { selected: true, marked: true, selectedColor: 'orange' },
          }}
        />
        <View>
          <JournelView index={0} date={selectedDate} journel={user.usermeta.dates[selectedDate]} show={show} setShow={setShow} />
        </View>
        <View style={{ width: '100%', alignItems: 'center', marginBottom: 30 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
            Overall Completed: {perOfComp(routinesForDate, 0)}/{routinesForDate.length}
          </Text>
        </View>

        {[false, true].map((time, index) => (
          <View key={index} style={{ marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
              <Ionicons name={timesionicons[index]} size={24} color="black" />
              <Text style={{ fontSize: 18, fontWeight: 'bold', margin: 10 }}>
                {time ? 'Completed' : 'Pending'} Routines
              </Text>
            </View>

            {routinesForDate && routinesForDate.length > 0 ? (
              routinesForDate.map((item, itemIndex) =>
                item?.completed === time ? (
                  <TouchableOpacity
                    key={itemIndex}
                    onPress={() =>
                      navigation.navigate('RoutineDetails', {
                        routinemeta: item,
                        type: item.cate,
                        selectedDate: selectedDate,
                      })
                    }
                  >
                    <View style={styles.taskContainer}>
                      <Text style={styles.itemText}>{item?.r_name || 'Unnamed Task'}</Text>
                      <Ionicons
                        name={item?.completed ? 'checkmark-circle' : 'ellipse-outline'}
                        size={24}
                        color={item?.completed ? 'green' : 'blue'}
                      />
                    </View>
                  </TouchableOpacity>
                ) : null
              )
            ) : (
              <Text style={styles.noRoutinesText}>No routines for this date.</Text>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  taskContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    elevation: 3,
  },
  itemText: {
    fontSize: 16,
  },
  noRoutinesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
});

export default TaskManager;

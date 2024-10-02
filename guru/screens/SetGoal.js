import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getQuestions } from '../controllers/UserControllers';
import { useDataStore } from '../datastore/data';

const SetGoal = ({ navigation }) => {  // Receive navigation as a prop
  const [selectedOptions, setSelectedOptions] = useState({});
  const {user,token,setUser}=useDataStore();
  const [questions,setQuestions]=useState([]);


  useEffect(() => {
    getQuestions(token).then((data)=>{
      console.log(data);
      setQuestions(data.questions);
    }
    ).catch((err)=>{
      console.log(err);
    });
  }, []); // Initialize selectedOptions state with an empty array


  const handleOptionPress = (item,index) => {
    setSelectedOptions({...selectedOptions,[item._id]:index});
    console.log(selectedOptions);
    
  };

  return (
    <View style={styles.container}>
      {questions.map((item, index) => (
        <View>
          <Text style={styles.question}>{index+1}.{item.ques}</Text>
        {item.opt.map((i, ind) => (
        <TouchableOpacity
          key={ind}
          style={[styles.option,selectedOptions[item._id]==ind && styles.optionSelected]}
          onPress={() => handleOptionPress(item,ind)}
        >
          <Text>{i}</Text>
          </TouchableOpacity>
        ))}
          </View>
      ))}
      <TouchableOpacity 
        style={styles.nextButton}
        onPress={() => navigation.navigate('Profile',{questions:selectedOptions})} // Navigate when the button is pressed
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFBF5C',
    padding: 20,
    justifyContent: 'center',
  },
  question: {
    fontSize: 16,
    marginBottom: 20,
  },
  option: {
    height: 50,
    backgroundColor: '#FF914D',
    borderRadius: 10,
    marginBottom: 20,
  },
  optionSelected: {
    backgroundColor: '#4CAF50',
  },
  nextButton: {
    height: 50,
    backgroundColor: '#FF914D',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    width: 100,
    alignSelf: 'flex-end',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SetGoal;

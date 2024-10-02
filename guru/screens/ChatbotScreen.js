import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { aiguru } from '../controllers/AIguru';

const AiChatbotScreen = () => {
  const [messages, setMessages] = useState([
    { text: "Hello, How can I help you?", sender: "bot" }
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleSendMessage = async() => {
    if (inputMessage.trim()) {
      const newmsg=[...messages, { text: inputMessage, sender: "user" }]
      setMessages(newmsg);
      setInputMessage("");
      let res=await aiguru(inputMessage);
      setMessages([...newmsg, { text: res, sender: "bot" }]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Chatbot</Text>
        <Ionicons name="chatbubble-ellipses-outline" size={24} color="black" />
      </View>

      <ScrollView style={styles.chatContainer}>
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              message.sender === "user" ? styles.userMessage : styles.botMessage
            ]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="black" />
        </TouchableOpacity>
        <TextInput
          style={styles.textInput}
          placeholder="Type message"
          value={inputMessage}
          onChangeText={setInputMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Ionicons name="send" size={24} color="black" />
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop:40,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'orange',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
    padding: 16,
  },
  messageBubble: {
    padding: 16,
    borderRadius: 25,
    marginBottom: 12,
    maxWidth: '75%',
  },
  botMessage: {
    backgroundColor: '#E0E0E0',
    alignSelf: 'flex-start',
  },
  userMessage: {
    backgroundColor: 'orange',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 16,
    color: 'black',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F5F5F5',
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
  },
  addButton: {
    padding: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
  },
  textInput: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    backgroundColor: '#fff',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sendButton: {
    padding: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
  },
  bottomNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: 'white', // Ensure the footer has a background color
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    fontSize: 12,
    color: 'black',
  },
  navTextSelected: {
    fontSize: 12,
    color: 'orange',
  },
});

export default AiChatbotScreen;

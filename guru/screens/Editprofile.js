import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Button,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useDataStore } from "../datastore/data";
import { ip } from "../datastore/data";
import { Picker } from "@react-native-picker/picker"; // Import Picker
import { Retrieveit } from "../controllers/LocalStorage";

const EditProfile = ({ route, navigation }) => {
  const { user, setUser, token } = useDataStore();
  const [image, setImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { questions } = route.params || 0;

  useEffect(() => {
    // Fetch user data from the backend
    const fetchUserData = async () => {
      if (questions != undefined) {
        setIsEditing(true);
      }
      try {
        const response = await fetch(`${ip}/api/user/getuser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + token,
          },
        });
        if (!response.ok) {
          console.log(response.statusText);
          throw new Error("Error fetching user data");
        }
        const data = await response.json();
        console.log(data.user);
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0]);
      }
    } catch (error) {
      console.error("Error picking image: ", error);
    }
  };

  const toggleEditMode = async () => {
    if (isEditing) {
      // Save updated user data to the backend
      try {
        const formData = new FormData();
        formData.append("name", user.name);
        formData.append("email", user.email);
        formData.append("age", user.age);
        formData.append("profession", user.profession);
        formData.append("sex", user.sex);
        if (questions != undefined) {
          console.log("jjj", questions);
          formData.append("questions", JSON.stringify(questions));
        }
        if (image) {
          try {
            console.log(user._id);
            
            const filePath = image.uri;
            const file = {
              uri: filePath,
              name: `${user._id}_profile.jpg`,
              type: "image/jpeg",
            };
            formData.append("profileImage", file);
            console.log("Image added to form data");
          } catch (error) {
            console.error("Error reading image file:", error);
            return;
          }
        }

        const response = await fetch(`${ip}/api/user/update`, {
          method: "POST",
          headers: {
            authorization: "Bearer " + token,
          },
          body: formData,
        });
        if (!response.ok) {
          throw new Error("Error updating user data");
        }
        const responseData = await response.json();
        console.log("User data updated successfully:", responseData);
        let photo = responseData.photo;
        console.log(`${photo}`);
        setUser({ ...user, photo: `${photo}` });
        if (questions != undefined) {
          navigation.navigate("Home");
        }
      } catch (error) {
        console.log("Error updating user data:", error.message);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setUser({ ...user, [field]: value });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5a623" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <TouchableOpacity onPress={isEditing ? pickImage : () => {}}>
              {image ? (
                <Image
                  source={{ uri: image.uri }}
                  style={styles.profileImage}
                />
              ) : user.photo ? (
                <Image
                  source={{ uri: `${user.photo}?t=${user.__v}` }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>Pick an Image</Text>
                </View>
              )}
            </TouchableOpacity>
            {isEditing ? (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Name</Text>
                  <TextInput
                    style={styles.input}
                    value={user.name}
                    onChangeText={(text) => handleInputChange("name", text)}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={user.email}
                    onChangeText={(text) => handleInputChange("email", text)}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Age</Text>
                  <TextInput
                    style={styles.input}
                    value={user.age}
                    onChangeText={(text) => handleInputChange("age", text)}
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Profession</Text>
                  <TextInput
                    style={styles.input}
                    value={user.profession}
                    onChangeText={(text) =>
                      handleInputChange("profession", text)
                    }
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Sex</Text>
                  <Picker
                    selectedValue={user.sex}
                    style={styles.picker}
                    onValueChange={(itemValue) =>
                      handleInputChange("sex", itemValue)
                    }
                  >
                    <Picker.Item label="Male" value="Male" />
                    <Picker.Item label="Female" value="Female" />
                  </Picker>
                </View>
              </>
            ) : (
              <>
                <View style={styles.infoGroup}>
                  <Text style={styles.label}>Name</Text>
                  <Text style={styles.value}>{user.name}</Text>
                </View>
                <View style={styles.infoGroup}>
                  <Text style={styles.label}>Email</Text>
                  <Text style={styles.value}>{user.email}</Text>
                </View>
                <View style={styles.infoGroup}>
                  <Text style={styles.label}>Age</Text>
                  <Text style={styles.value}>{user.age}</Text>
                </View>
                <View style={styles.infoGroup}>
                  <Text style={styles.label}>Profession</Text>
                  <Text style={styles.value}>{user.profession}</Text>
                </View>
                <View style={styles.infoGroup}>
                  <Text style={styles.label}>Sex</Text>
                  <Text style={styles.value}>{user.sex}</Text>
                </View>
              </>
            )}
            <TouchableOpacity style={styles.button} onPress={toggleEditMode}>
              <Text style={styles.buttonText}>
                {isEditing ? "Save" : "Edit Profile"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 30,
  },
  container: {
    backgroundColor: "#f5a623",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#fff",
  },
  placeholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  placeholderText: {
    color: "#fff",
  },
  inputGroup: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: "10%",
    marginBottom: 5,
    fontSize: 16,
    color: "#333",
  },
  input: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    alignSelf: "center",
  },
  picker: {
    width: "80%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    alignSelf: "center",
  },
  infoGroup: {
    width: "100%",
    marginBottom: 15,
    alignItems: "center",
  },
  value: {
    fontSize: 18,
    color: "#666",
    alignSelf: "center",
    width: "80%",
    padding: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    textAlign: "center",
  },
  button: {
    backgroundColor: "white", // Background color of the button
    borderColor: "black", // Border color
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "orange", // Text color
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditProfile;

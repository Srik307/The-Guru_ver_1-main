import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ip, useDataStore } from "../datastore/data";

const HeaderComp = () => {
  const navigation = useNavigation();
  const { user, setUser } = useDataStore();
  console.log(`${user.photo}=${new Date().getTime()}`);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate("Profile")}
        style={styles.profileIcon}
      >
        <Image
          source={{ uri: `${user.photo}?t=${user.__v}` }}
          style={styles.profileImage}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.otherIcon}
        onPress={() => navigation.navigate("Settings")}
      >
        <Ionicons name="settings-outline" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 60,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: "#fff",
  },
  profileIcon: {
    position: "absolute",
    top: 20,
    left: 20,
  },
  otherIcon: {
    position: "absolute",
    top: 20,
    right: 20,
  },
});
export default HeaderComp;

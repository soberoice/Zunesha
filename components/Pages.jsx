import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";

const Pages = () => {
  return (
    <View style={styles.constainer}>
      <TouchableOpacity style={styles.icon}>
        <Icon name="home" color={"#32a88b"} size={20} />
        <Text style={styles.text}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.icon}>
        <Icon name="search" color={"#32a88b"} size={20} />
        <Text style={styles.text}>Search</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.icon}>
        <Icon name="bookmark" color={"#32a88b"} size={20} />
        <Text style={styles.text}>Watch List</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.icon}>
        <Icon name="tv" color={"#32a88b"} size={20} />
        <Text style={styles.text}>Watch </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Pages;

const styles = StyleSheet.create({
  constainer: {
    height: 75,
    backgroundColor: "#000",
    color: "#fff",
    justifyContent: "space-around",
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    paddingTop: 5,
  },
  icon: {
    justifyContent: "center",
    alignItems: "center",
    gap:5
  },
});

import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome";

const Navbar = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Icon name="play-circle" size={30} color={"white"} />
      <TouchableOpacity>
        <Icon name="search" size={25} color={"white"} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
});

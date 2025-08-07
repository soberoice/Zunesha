import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { TextInput } from "react-native-gesture-handler";

const Pagination = ({ setPage, page, hasNextPage }) => {
  function moveLeft() {
    if (page > 1) {
      setPage(page - 1);
    }
  }
  function moveRight() {
    if (hasNextPage) {
      setPage(page + 1);
    }
  }
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => moveLeft()}
        style={{
          opacity: page === 1 ? 0.5 : 1,
          borderWidth: 1,
          borderColor: "#fff",
          borderRadius: 5,
        }}
      >
        <Text>
          <Icon name="keyboard-arrow-left" color={"#fff"} size={30} />
        </Text>
      </TouchableOpacity>
      <Text style={{ color: "#fff" }}>{page}</Text>
      <TouchableOpacity
        onPress={() => moveRight()}
        style={{
          opacity: hasNextPage ? 1 : 0.5,
          borderWidth: 1,
          borderColor: "#fff",
          borderRadius: 5,
        }}
      >
        <Text>
          <Icon name="keyboard-arrow-right" color={"#fff"} size={30} />
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
});

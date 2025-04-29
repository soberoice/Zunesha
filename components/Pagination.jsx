import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";

const Pagination = ({ totalPages, setPage, page, hasNextPage }) => {
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
        style={{ opacity: page === 1 ? 0.5 : 1 }}
      >
        <Icon name="keyboard-arrow-left" color={"#fff"} size={30} />
      </TouchableOpacity>
      <Text style={{ color: "#fff" }}>
        {page} of {totalPages ? totalPages : 1}
      </Text>
      <TouchableOpacity
        onPress={() => moveRight()}
        style={{ opacity: hasNextPage ? 1 : 0.5 }}
      >
        <Icon name="keyboard-arrow-right" color={"#fff"} size={30} />
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
  },
});

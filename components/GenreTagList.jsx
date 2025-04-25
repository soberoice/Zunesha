import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

const GenreTagList = ({ genres }) => {
  return (
    <View
      style={{ flexDirection: "row", flexWrap: "wrap", marginHorizontal: 5 }}
    >
      {genres?.map((genre, index) => (
        <TouchableOpacity
          key={index}
          style={{
            backgroundColor: "#32a88b",
            borderRadius: 20,
            paddingHorizontal: 10,
            paddingVertical: 5,
            margin: 1,
            marginVertical: 5,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 12,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {genre}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default GenreTagList;

const styles = StyleSheet.create({});

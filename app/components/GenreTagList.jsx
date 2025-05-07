import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useNavigation } from "expo-router";

const GenreTagList = ({ genres }) => {
  const navigation = useNavigation();
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
          onPress={() =>
            navigation.navigate("more", {
              type: "genre",
              value: `${genre}`,
              Name: `${genre}`,
            })
          }
        >
          <Text
            style={{
              color: "white",
              fontSize: 10,
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

import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome6";
import { useNavigation } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const AnimeList = ({ data }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {data &&
        data.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => navigation.navigate("Details", { id: item.id })}
            style={styles.itemContainer}
          >
            <Text
              style={{
                fontWeight: "700",
                fontSize: 12,
                padding: 5,
                position: "absolute",
                color: "#fff",
                right: 0,
                zIndex: 1,
                bottom: 0,
              }}
            >
              {item.nsfw ? "+18" : "PG-13"}
            </Text>

            <ImageBackground
              borderRadius={5}
              source={{ uri: item.image }}
              style={styles.image}
            >
              <LinearGradient
                colors={["transparent", "#1a1a1a"]}
                start={{ x: 0.5, y: 0.8 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.slide}
              ></LinearGradient>
            </ImageBackground>
            <Text numberOfLines={1} style={styles.text}>
              {item.title.english || item.title.romaji}
            </Text>
          </TouchableOpacity>
        ))}
    </View>
  );
};

export default AnimeList;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    flexDirection: "row",
    flexWrap: "wrap",
    paddingVertical: 16,
  },
  itemContainer: {
    width: 150,
    backgroundColor: "#000",
    height: 200,
    paddingBottom: 10,
    marginHorizontal: 10,
    marginBottom: 50,
  },
  image: {
    width: 150,
    height: 200,
    resizeMode: "cover",
    marginBottom: 10,
    borderRadius: 10,
  },
  text: {
    fontSize: 15,
    color: "#fff",
    textAlign: "left",
  },
  rating: {},
  slide: {
    height: "100%",
  },
});

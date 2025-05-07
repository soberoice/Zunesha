import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome6";
import { useNavigation } from "expo-router";

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
                borderRadius: 5,
                position: "absolute",
                color: item.nsfw ? "#fff" : "#000",
                backgroundColor: item.nsfw ? "red" : "#fff",
                left: 0,
                zIndex: 1,
              }}
            >
              {item.nsfw ? "+18" : "PG-13"}
            </Text>
            <Text
              style={{
                fontWeight: "700",
                fontSize: 12,
                padding: 5,
                borderRadius: 5,
                position: "absolute",
                color: "#fff",
                backgroundColor: "#32a88b",
                right: 0,
                zIndex: 1,
              }}
            >
              {item.type}
            </Text>
            {item.sub && (
              <View
                style={{
                  padding: 5,
                  borderRadius: 5,
                  position: "absolute",
                  backgroundColor: "#32a88b",
                  left: 0,
                  zIndex: 1,
                  bottom: 0,
                  alignItems: "center",
                  flexDirection: "row",
                }}
              >
                <Icon name="closed-captioning" color={"#fff"} />
                <Text style={{ color: "#fff", marginLeft: 4 }}>{item.sub}</Text>
              </View>
            )}

            {item.dub > 0 && (
              <View
                style={{
                  fontWeight: "700",
                  fontSize: 12,
                  padding: 5,
                  borderRadius: 5,
                  position: "absolute",
                  color: "#fff",
                  backgroundColor: "#32a88b",
                  right: 0,
                  zIndex: 1,
                  bottom: 0,
                }}
              >
                <Icon name="microphone" />
                <Text style={{ color: "#fff", marginLeft: 4 }}>{item.dub}</Text>
              </View>
            )}
            <Image style={styles.image} source={{ uri: item.image }} />
            <Text numberOfLines={1} style={styles.text}>
              {item.title}
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
});

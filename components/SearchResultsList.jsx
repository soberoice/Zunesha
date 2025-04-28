import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome6";
import { useNavigation } from "expo-router";

const SearchResultsList = ({ data }) => {
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
            {/* <Text
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
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 12,
                  padding: 5,
                  borderRadius: 5,
                  position: "absolute",
                  color: "#fff",
                  backgroundColor: "#32a88b",
                  left: 0,
                  zIndex: 1,
                  bottom: 0,
                }}
              >
                <Icon name="closed-captioning" /> {item.sub}
              </Text>
            )}

            {item.dub > 0 && (
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
                  bottom: 0,
                }}
              >
                <Icon name="microphone" /> {item.dub}
              </Text>
            )} */}
            <Image style={styles.image} source={{ uri: item.image }} />
            <View style={styles.desContainer}>
              <Text numberOfLines={2} style={styles.text}>
                {item.title}
              </Text>
              <View style={{ flexDirection: "row", gap: 5 }}>
                <Text style={styles.desIcon}> {item.type}</Text>
                <Text style={styles.desIcon}> {item.duration}</Text>
                {item.sub && (
                  <Text style={styles.desIcon}>
                    <Icon name="closed-captioning" /> {item.sub}
                  </Text>
                )}
                {item.dub > 0 && (
                  <Text style={styles.desIcon}>
                    <Icon name="microphone" /> {item.dub}
                  </Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
    </View>
  );
};

export default SearchResultsList;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    flexDirection: "column",
    flexWrap: "wrap",
    paddingVertical: 16,
  },
  itemContainer: {
    display: "flex",
    width: "95%",
    flexDirection: "row",
    height: 100,
    marginVertical: 10,
    marginHorizontal: 5,
    paddingHorizontal: 5,
    gap: 10,
  },
  image: {
    width: 70,
    height: 100,
    resizeMode: "cover",
  },
  text: {
    fontSize: 15,
    color: "#fff",
    textAlign: "left",
    wrap: "wrap",
  },
  desContainer: {
    width: "80%",
    height: "100%",
    gap: 5,
  },
  desIcon: {
    fontWeight: "700",
    fontSize: 12,
    padding: 5,
    borderRadius: 5,
    color: "#fff",
    backgroundColor: "#32a88b",
    zIndex: 1,
  },
});

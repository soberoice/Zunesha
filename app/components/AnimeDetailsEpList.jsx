import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import React, { useState } from "react";

import { useNavigation } from "expo-router";

import {
  ScrollView,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";

const AnimeDetailsEpList = ({ ep, image }) => {
  const navigation = useNavigation();

  const [searchInput, setSearchInput] = useState("");

  function search() {
    const filteredEp = ep.filter(
      (episode) =>
        episode.number.toString() === searchInput ||
        episode.title.toLowerCase().includes(searchInput.toLowerCase())
    );

    console.log(filteredEp.number);

    return filteredEp.length ? (
      filteredEp.map((item) => (
        <TouchableOpacity
          style={styles.btn}
          key={item?.id} // Use filteredEp[0]?.id for the key
          onPress={() =>
            navigation.navigate("watchepisode", {
              id: item?.id,
              ep: ep,
              title: item?.title,
              number: item?.number,
              cover: image,
            })
          }
        >
          <Image style={styles.image} source={{ uri: image }} />
          <Icon
            name="play-circle"
            size={35}
            color={"#32a88b"}
            style={styles.playbtn}
          />
          <Text
            numberOfLines={3}
            style={{ color: "#32a88b", fontWeight: "bold" }}
          >
            Episode {item?.number}: {item?.title}
          </Text>
        </TouchableOpacity>
      ))
    ) : (
      <Text style={{ color: "#32a88b", fontWeight: "bold" }}>
        No SearchResults
      </Text>
    );
  }

  return (
    <GestureHandlerRootView style={{ height: "90%", width: "100%" }}>
      <View style={{ width: "100%", alignItems: "center" }}>
        <View
          style={{
            marginTop: 10,
            alignItems: "center",
            width: "90%",
            flexDirection: "row",
            borderWidth: 1,
            borderColor: "#32a88b",
            borderRadius: 5,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: "15%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="search" color={"#32a88b"} size={30} />
          </View>
          <TextInput
            onChangeText={(text) => setSearchInput(text)}
            placeholder="Search Episode"
            placeholderTextColor={"#32a88b"}
            style={styles.searchBar}
          />
        </View>
      </View>
      <ScrollView
        scrollEnabled={true}
        horizontal={true}
        contentContainerStyle={styles.scrollContainer}
      >
        {searchInput
          ? search()
          : ep?.slice(0, 26).map((item) => (
              <TouchableOpacity
                style={styles.btn}
                key={item?.number}
                onPress={() =>
                  navigation.navigate("watchepisode", {
                    id: item.id,

                    ep: ep,

                    title: item.title,

                    number: item.number,

                    cover: image,
                  })
                }
              >
                <Image style={styles.image} source={{ uri: image }} />
                <Icon
                  name="play-circle"
                  size={35}
                  color={"#32a88b"}
                  style={styles.playbtn}
                />
                <Text
                  numberOfLines={3}
                  style={{ color: "#32a88b", fontWeight: "bold", fontSize: 15 }}
                >
                  Episode {item?.number}: {item.title}
                </Text>
              </TouchableOpacity>
            ))}
      </ScrollView>
      {ep.length > 26 && (
        <Text
          style={{
            color: "#32a88b",
            fontWeight: "bold",
            paddingHorizontal: 20,
          }}
        >
          Search to see other episodes!
        </Text>
      )}
    </GestureHandlerRootView>
  );
};

export default AnimeDetailsEpList;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    height: 250,
    alignItems: "center",
    justifyContent: "center",
  },

  scrollContainer: {
    overflow: "scroll",
    marginVertical: 10,
    paddingHorizontal: 15,
  },

  btn: {
    paddingVertical: 10,
    marginHorizontal: 5,
    width: 150,
    alignItems: "left",
  },

  searchBar: {
    width: "85%",
    color: "#fff",
    height: 50,
  },
  image: {
    width: 150,
    height: 100,
    borderRadius: 5,
    opacity: 0.8,
  },
  playbtn: {
    position: "absolute",
    top: 40,
    right: 60,
  },
});

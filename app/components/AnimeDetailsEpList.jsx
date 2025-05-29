import {
  Image,
  ImageBackground,
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
import { LinearGradient } from "expo-linear-gradient";

const AnimeDetailsEpList = ({ name, ep, image, hasDub, hasSub, cover }) => {
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
              cover: cover,
              hasSub: hasSub,
              hasDub: hasDub,
              episodeHasDub: item?.isDubbed,
              name: name,
              nextEpisode: ep.filter(
                (episode) => episode.number.toString() === item.number + 1
              )[0]?.id,
            })
          }
        >
          <Image style={styles.image} source={{ uri: image }} />
          <Icon
            name="play-arrow"
            size={35}
            color={"#32a88b"}
            style={styles.playbtn}
          />
          <Text
            numberOfLines={3}
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: 13,
              position: "absolute",
              bottom: 0,
              left: 0,
              padding: 5,
            }}
          >
            Episode {item?.number}
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
            borderRadius: 50,
            justifyContent: "center",
            backgroundColor: "#000",
            paddingHorizontal: 10,
          }}
        >
          <TextInput
            onChangeText={(text) => setSearchInput(text)}
            placeholder="Search Episode"
            placeholderTextColor={"#32a88b"}
            style={styles.searchBar}
          />
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name="search" color={"#32a88b"} size={30} />
          </View>
        </View>
      </View>
      <ScrollView
        scrollEnabled={true}
        horizontal={true}
        contentContainerStyle={styles.scrollContainer}
      >
        {searchInput
          ? search()
          : ep?.slice(0, 26).map((item, index) => (
              <TouchableOpacity
                style={[styles.btn, { height: 100 }]}
                key={item?.number}
                onPress={() =>
                  navigation.navigate("watchepisode", {
                    id: item.id,
                    ep: ep,
                    title: item.title,
                    number: item.number,
                    cover: cover,
                    hasDub: hasDub,
                    hasSub: hasSub,
                    episodeHasDub: item.isDubbed,
                    nextEpisode: ep[index + 1]?.id,
                    name: name,
                  })
                }
              >
                <ImageBackground
                  borderRadius={5}
                  source={{ uri: cover }}
                  style={styles.image}
                >
                  <LinearGradient
                    colors={["transparent", "#1a1a1a"]}
                    start={{ x: 0.5, y: 0.4 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.slide}
                  ></LinearGradient>
                </ImageBackground>
                <Icon
                  name="play-arrow"
                  size={30}
                  color={"#32a88b"}
                  style={styles.playbtn}
                />
                <Text
                  numberOfLines={3}
                  style={{
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: 13,
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    padding: 5,
                  }}
                >
                  Episode {item?.number}
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
    marginHorizontal: 5,
    width: 150,
    alignItems: "left",
    marginTop: 10,
  },

  searchBar: {
    width: "85%",
    color: "#32a88b",
    height: 50,
  },
  image: {
    width: 150,
    height: 100,
    borderRadius: 5,
  },
  playbtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  slide: {
    height: "100%",
  },
});

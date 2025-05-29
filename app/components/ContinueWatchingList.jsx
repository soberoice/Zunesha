import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
  TextInput,
} from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useList } from "./Provider/WhatchlistProvider";
import { useNavigation } from "expo-router";

export default function ContinueWatchingList() {
  const { continueArray, removeFromContinue } = useList();
  const navigation = useNavigation();
  return (
    <GestureHandlerRootView style={{ width: "100%" }}>
      <ScrollView
        scrollEnabled={true}
        horizontal={true}
        contentContainerStyle={styles.scrollContainer}
      >
        {continueArray.map((item, index) => (
          <TouchableOpacity
            style={[styles.btn]}
            key={index}
            onPress={() =>
              navigation.navigate("watchepisode", {
                id: item.epId,
                ep: item.episodes,
                title: item.title,
                number: item.number,
                cover: item.cover,
                hasDub: item.hasDub,
                hasSub: item.hasSub,
                episodeHasDub: item.isDubbed,
                // nextEpisode: ep[index + 1]?.id,
              })
            }
          >
            <ImageBackground
              borderRadius={5}
              source={{ uri: item.cover }}
              style={styles.image}
            >
              <LinearGradient
                colors={["transparent", "#1a1a1a"]}
                start={{ x: 0.5, y: 0.2 }}
                end={{ x: 0.5, y: -0.2 }}
                style={styles.slide}
              ></LinearGradient>
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
            <TouchableOpacity
              style={styles.closebtn}
              onPress={() => removeFromContinue(item)}
            >
              <Icon name="close" size={30} color={"white"} />
            </TouchableOpacity>
            <Text
              numberOfLines={3}
              style={{
                color: "#fff",
                fontWeight: "bold",
                fontSize: 13,
                position: "absolute",
                top: 0,
                left: 0,
                padding: 5,
              }}
            >
              {item?.name}
            </Text>
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                padding: 5,
                paddingBottom: 10,
                width: "90%",
              }}
            >
              <Text
                numberOfLines={3}
                style={{
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: 13,
                }}
              >
                Episode {item?.number}
              </Text>
              <View
                style={{
                  width: "100%",
                  backgroundColor: "#888",
                  height: 4,
                  borderRadius: 5,
                }}
              >
                <View
                  style={{
                    width: `${(item.currentTime / item.duration) * 100}%`,
                    backgroundColor: "#32a88b",
                    height: 4,
                    borderRadius: 5,
                  }}
                ></View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    padding: 10,
    alignItems: "center",
    height: 250,
    alignItems: "center",
    justifyContent: "center",
  },

  scrollContainer: {
    overflow: "scroll",
    marginVertical: 10,
  },
  closebtn: {
    position: "absolute",
    top: 0,
    right: 0,
  },

  btn: {
    marginHorizontal: 15,
    width: 225,
    alignItems: "left",
    marginTop: 10,
    height: 150,
  },

  searchBar: {
    width: "85%",
    color: "#32a88b",
    height: 50,
  },
  image: {
    width: 225,
    height: 150,
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

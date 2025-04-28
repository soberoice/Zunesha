import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useList } from "../components/Provider/WhatchlistProvider";
import HorizontalAnimeList from "../components/HorizontalAnimeList";
import Icon from "react-native-vector-icons/MaterialIcons";

const WatchList = () => {
  const { watchListArray } = useList();
  return (
    <View style={styles.container}>
      <View
        style={{
          paddingHorizontal: 10,
          marginVertical: 20,
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 20,
          }}
        >
          WatchList
        </Text>
        <Text
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 20,
          }}
        >
          {watchListArray?.length} Anime
        </Text>
      </View>
        {watchListArray?.length > 0 ? (
          <HorizontalAnimeList data={watchListArray} />
        ) : (
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: "90%",
        }}
      >
            <Icon name="add-reaction" size={50} color={"#32a88b"} />
          <Text
            style={{
              color: "#32a88b",
              fontSize: 30,
            }}
          >
            Add To Watch List
          </Text>
      </View>
        )}
    </View>
  );
};

export default WatchList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001",
  },
});

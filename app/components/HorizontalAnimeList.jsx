import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { useNavigation } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useList } from "./Provider/WhatchlistProvider";

const HorizontalAnimeList = ({ data }) => {
  const navigation = useNavigation();
  const { addToWatchList, inWatchList } = useList();
  return (
    <View style={styles.container}>
      {data &&
        data?.map((item, index) => (
          <TouchableOpacity
            key={item?.id}
            onPress={() => navigation.navigate("Details", { id: item?.id })}
            style={styles.itemContainer}
          >
            <Image style={styles.image} source={{ uri: item?.image }} />
            <View style={styles.desContainer}>
              <View style={{ width: "70%", gap: 5 }}>
                <Text numberOfLines={2} style={styles.text}>
                  {item?.title.english || item?.title.romaji}
                </Text>
                <View style={{ flexDirection: "row", gap: 5 }}>
                  <Text style={styles.descText}>
                    {item?.nsfw ? "+18" : "PG-13"}
                  </Text>
                  <Text style={[{ fontSize: 20 }, styles.descText]}>
                    &middot;
                  </Text>
                  <Text style={styles.descText}>
                    {item?.totalEpisodes || item?.currentEpisodeCount} Episodes
                  </Text>
                  <Text style={[{ fontSize: 20 }, styles.descText]}>
                    &middot;
                  </Text>
                  <Text style={styles.descText}>
                    {(item?.rating / 10).toFixed(1)}
                    <Icon name="star-rate" />
                  </Text>
                </View>
              </View>
              {item && (
                <TouchableOpacity
                  onPress={() => addToWatchList(item)}
                  style={styles.btn2}
                >
                  <Icon
                    name={!inWatchList(item?.id) ? "add" : "remove"}
                    size={20}
                    color={"#fff"}
                  />
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        ))}
    </View>
  );
};

export default HorizontalAnimeList;

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
    height: 70,
    marginVertical: 10,
    marginHorizontal: 5,
    paddingHorizontal: 5,
    gap: 10,
  },
  image: {
    aspectRatio: 16 / 16,
    resizeMode: "cover",
    borderRadius: 5,
  },
  text: {
    fontSize: 15,
    color: "#fff",
    textAlign: "left",
  },
  desContainer: {
    width: "80%",
    height: "100%",
    gap: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  desIcon: {
    flexDirection: "row",
    borderRadius: 5,
    backgroundColor: "#32a88b",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  descText: {
    color: "#bfbfbf",
    fontSize: 12,
  },
  btn2: {
    backgroundColor: "rgba(0, 0, 0, 0.51)",
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    borderColor: "#fff",
    borderWidth: 1,
    height: 45,
    width: 45,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

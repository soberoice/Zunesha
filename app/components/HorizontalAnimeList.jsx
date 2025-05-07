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
              <Text numberOfLines={2} style={styles.text}>
                {item?.title}
              </Text>
              <View style={{ flexDirection: "row", gap: 5 }}>
                <View style={styles.desIcon}>
                  <Text style={styles.descText}>{item?.type}</Text>
                </View>
                {item?.duration && (
                  <View style={styles.desIcon}>
                    <Text style={styles.descText}>{item?.duration}</Text>
                  </View>
                )}
                {item && (
                  <View style={styles.desIcon}>
                    <Icon name="closed-caption" size={18} color={"#fff"} />
                    <Text style={styles.descText}>
                      {item?.sub || item?.totalEpisodes}
                    </Text>
                  </View>
                )}
                {item?.dub > 0 && (
                  <View style={styles.desIcon}>
                    <Icon name="mic" size={18} color={"#fff"} />
                    <Text style={styles.descText}>{item?.dub}</Text>
                  </View>
                )}
              </View>
              {item && (
                <TouchableOpacity
                  style={{ width: 55 }}
                  onPress={() => addToWatchList(item)}
                >
                  {inWatchList(item?.id) ? (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Icon
                        name={"bookmark-remove"}
                        size={25}
                        color={"#32a88b"}
                      />
                      <Text style={{ color: "#32a88b" }}>Remove</Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Icon name={"bookmark-add"} size={25} color={"#fff"} />
                      <Text style={{ color: "#fff" }}>Add</Text>
                    </View>
                  )}
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
    borderRadius: 5,
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
    flexDirection: "row",
    borderRadius: 5,
    backgroundColor: "#32a88b",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  descText: {
    color: "#fff",
    fontSize: 12,
  },
});

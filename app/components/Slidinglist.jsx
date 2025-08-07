import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const Slidinglist = ({ data, limit, start }) => {
  const navigation = useNavigation();

  return (
    <ScrollView
      scrollEnabled={true}
      horizontal={true}
      contentContainerStyle={styles.scrollContainer}
    >
      {data &&
        data.slice(start ? start : 0, limit).map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => navigation.navigate("Details", { id: item.id })}
            style={styles.itemContainer}
          >
            <Text
              style={{
                fontWeight: "700",
                fontSize: 10,
                padding: 5,
                borderRadius: 5,
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
    </ScrollView>
  );
};

export default Slidinglist;

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 10,
    flexDirection: "row",
    height: 250,
    flexWrap: "nowrap",
    gap: 10,
  },
  slide: {
    height: "100%",
  },
  itemContainer: {
    height: 175,
    paddingBottom: 10,
    aspectRatio: 9 / 12,
  },
  image: {
    height: 175,
    resizeMode: "cover",
    marginBottom: 10,
    aspectRatio: 9 / 12,
  },
  text: {
    fontSize: 13,
    color: "#fff",
    textAlign: "left",
  },
  rating: {},
});

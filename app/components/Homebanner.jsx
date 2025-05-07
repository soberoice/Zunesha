import {
  Dimensions,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import Navbar from "./Navbar";
import { useNavigation } from "expo-router";
import { useList } from "./Provider/WhatchlistProvider";
const { width } = Dimensions.get("window");

const Homebanner = () => {
  const { addToWatchList, inWatchList } = useList();
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://aniwatch-api-v1-0.onrender.com/api/parse"
        );
        const json = await response.json();
        setData(json.slides);
      } catch (error) {
        console.error("Error fetching banner data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  const fetchMaindetails = async (id) => {
    try {
      const response = await fetch(
        `https://consapi-chi.vercel.app/anime/zoro/info?id=${id}`
      );
      const json = await response.json();
      console.log("mainData: ", json);
      addToWatchList(json);
    } catch (error) {
      console.error("Error fetching banner data:", error);
    }
  };
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % data.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }, 5000); // 3 seconds

    return () => clearInterval(interval); // cleanup
  }, [currentIndex, data]);
  if (loading) {
    return <View style={{ aspectRatio: 16 / 12 }}></View>;
  }
  const renderItem = ({ item }) => {
    return (
      <View style={{ aspectRatio: 16 / 12 }}>
        <ImageBackground
          source={{ uri: item.imageAnime }}
          style={{
            width: width,
            aspectRatio: 16 / 12,
          }}
        >
          <LinearGradient
            colors={["transparent", "#001"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.slide}
          >
            <Text numberOfLines={1} style={styles.text}>
              {item.name}
            </Text>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity style={styles.btn}>
                <Icon name="play-circle" size={20} color="white" />
                <Text
                  style={styles.btnText}
                  onPress={() =>
                    navigation.navigate("Details", { id: item.animeId })
                  }
                >
                  Watch Now
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => fetchMaindetails(item.animeId)}
                style={styles.btn2}
              >
                <Icon
                  name={
                    !inWatchList(item?.animeId)
                      ? "bookmark-add"
                      : "bookmark-added"
                  }
                  size={20}
                  color={!inWatchList(item?.animeId) ? "#fff" : "#32a88b"}
                />
                <Text
                  style={{
                    color: !inWatchList(item?.animeId) ? "#fff" : "#32a88b",
                    fontSize: 13,
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Watch Later
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>
    );
  };
  return (
    <View>
      <LinearGradient
        colors={["transparent", "#001"]}
        start={{ x: 0.5, y: 1 }}
        end={{ x: 0.5, y: 0 }}
        style={styles.navbar}
      >
        <Navbar />
      </LinearGradient>
      <FlatList
        ref={flatListRef}
        keyExtractor={(item) => item?.animeId?.toString()}
        horizontal
        data={data}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        renderItem={renderItem}
      />
    </View>
  );
};

export default Homebanner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  slide: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    color: "white",
    padding: 10,
    alignItems: "left",
    height: "full",
    width: "100%",
  },
  text: {
    fontSize: 18,
    color: "#fff",
  },
  btn: {
    backgroundColor: "#32a88b",
    padding: 10,
    borderRadius: 50,
    marginTop: 10,
    width: "35%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
  },
  btn2: {
    backgroundColor: "transparent",
    width: "35%",
    borderRadius: 50,
    marginTop: 10,
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
  },
  btnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
  },
  navbar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    zIndex: 1,
  },
});

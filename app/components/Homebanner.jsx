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
import Icon from "react-native-vector-icons/Feather";
import Navbar from "./Navbar";
import { useNavigation } from "expo-router";
import { useList } from "./Provider/WhatchlistProvider";
const { width } = Dimensions.get("window");

const Homebanner = () => {
  const onViewRef = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const { addToWatchList, inWatchList } = useList();
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCurrentIndex(0);
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/anime/zoro/most-popular`);
        const json = await response.json();
        console.log(json);
        const originalSlides = json.results.slice(0, 5);
        const tripledSlides = [
          ...originalSlides,
          ...originalSlides,
          ...originalSlides,
        ];
        setData(tripledSlides);
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: originalSlides.length,
            animated: false,
          });
          setCurrentIndex(originalSlides.length);
        }, 50);
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
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/anime/zoro/info?id=${id}`);
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
      let nextIndex = currentIndex + 1;

      if (nextIndex >= data.length) {
        nextIndex = data.length / 3; // jump to start of middle copy
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: false,
        });
      } else {
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }

      setCurrentIndex(nextIndex);
    }, 5000);

    return () => clearInterval(interval);
  }, [currentIndex, data]);

  const handleScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(offsetX / width);
    const originalLength = data.length / 3;

    // Loop back to middle set when reaching ends
    if (newIndex === 0) {
      flatListRef.current?.scrollToIndex({
        index: originalLength,
        animated: false,
      });
      setCurrentIndex(originalLength);
    } else if (newIndex === data.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: originalLength * 2 - 1,
        animated: false,
      });
      setCurrentIndex(originalLength * 2 - 1);
    } else {
      setCurrentIndex(newIndex);
    }
  };

  if (!data) {
    return <View style={{ aspectRatio: 16 / 16 }}></View>;
  }

  const BannerItem = React.memo(({ item }) => (
    <View style={{ aspectRatio: 16 / 16 }}>
      <ImageBackground
        source={{ uri: item.image }}
        style={{ width: width, aspectRatio: 16 / 16 }}
      />
    </View>
  ));
  const renderItem = ({ item }) => <BannerItem item={item} />;
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
        keyExtractor={(item, index) => index.toString()}
        horizontal
        data={data}
        showsHorizontalScrollIndicator={false}
        pagingEnabled={true}
        renderItem={renderItem}
        onMomentumScrollEnd={handleScrollEnd}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        removeClippedSubviews={true}
      />

      <LinearGradient
        colors={["transparent", "#1f1f1f"]}
        start={{ x: 0.5, y: -0.03 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.slide}
      >
        <Text numberOfLines={1} style={styles.text}>
          {data[currentIndex]?.title}
        </Text>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
            alignItems: "center",
            height: 50,
            width: "100%",
          }}
        >
          <TouchableOpacity
            style={styles.btn}
            onPress={() =>
              navigation.navigate("Details", {
                id: data[currentIndex].id,
              })
            }
          >
            <Icon name="info" size={20} color="white" />
            <Text style={styles.btnText}>Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => addToWatchList(data[currentIndex])}
            style={styles.btn2}
          >
            <Icon
              name={!inWatchList(data[currentIndex]?.id) ? "plus" : "minus"}
              size={20}
              color={"#fff"}
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
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
    borderRadius: 10,
    marginTop: 10,
    width: "30%",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    gap: 5,
    height: 45,
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

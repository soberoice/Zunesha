import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";
import GenreTagList from "../components/GenreTagList";

const AnimeDetails = ({ route }) => {
  const { id } = route.params;
  const [data, setData] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://consapi-chi.vercel.app/anime/zoro/info?id=${id}`
        );
        const res = await response.json();
        setData(res);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <ImageBackground style={styles.image} source={{ uri: data?.image }}>
          <LinearGradient
            colors={["transparent", "rgb(0, 0, 0)"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.slide}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text numberOfLines={1} style={styles.text}>
                {data?.title}
              </Text>
              <TouchableOpacity style={styles.btn2}>
                <Icon name="bookmark" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ImageBackground>
        <GenreTagList genres={data?.genres} />
        <ScrollView contentContainerStyle={styles.descContainer}>
          <Text style={styles.des}>{data?.description}</Text>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnimeDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    padding: 10,
  },
  image: {
    width: "100%",
    height: 300,
  },
  des: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "400",
    padding: 10,
  },
  descContainer: {
    height: 200,
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
  btn2: {
    backgroundColor: "transparent",
    borderRadius: 50,
    padding: 10,
  },
  btnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "bold",
    textAlign: "center",
  },
});

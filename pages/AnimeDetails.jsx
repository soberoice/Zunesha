import {
  ActivityIndicator,
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
import Slidinglist from "../components/Slidinglist";
const EpisodeList = React.lazy(() => import("../components/EpisodeList"));

const AnimeDetails = ({ route }) => {
  const { id } = route.params;
  const [data, setData] = useState();
  const [tab, setTab] = useState("Episodes");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://consapi-chi.vercel.app/anime/zoro/info?id=${id}`
        );
        const res = await response.json();
        setData(res);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={"#32a88b"} size={50} />
      </View>
    );
  }
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
                gap: 10,
              }}
            >
              <View>
                <Text numberOfLines={1} style={styles.text}>
                  {data?.title}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingVertical: 10,
                  }}
                >
                  <Text
                    style={{
                      color: "#32a88b",
                      paddingHorizontal: 5,
                    }}
                  >
                    {data?.status}
                  </Text>
                  <Text
                    style={{
                      color: "#fff",
                      paddingHorizontal: 5,
                    }}
                  >
                    {data?.season}
                  </Text>
                  <Text
                    style={{
                      color: "#fff",
                      paddingHorizontal: 5,
                    }}
                  >
                    {data?.totalEpisodes} Episodes
                  </Text>
                  <Text
                    style={{
                      color: "#32a88b",
                      paddingHorizontal: 5,
                      borderWidth: 1,
                      borderColor: "#32a88b",
                      borderRadius: 5,
                    }}
                  >
                    {data?.type}
                  </Text>
                </View>
              </View>
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
        <View
          style={{
            flexDirection: "row",
            marginTop: 10,
            alignItems: "flex-start",
          }}
        >
          <TouchableOpacity onPress={() => setTab("Episodes")}>
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: "700",
                padding: 10,
                marginTop: 10,
                marginLeft: 10,
                marginBottom: 10,
                borderBottomWidth: 2,
                borderBottomColor: tab === "Episodes" ? "#32a88b" : "#fff",
                opacity: tab === "Episodes" ? 1 : 0.5,
              }}
            >
              Episodes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab("Related")}>
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: "700",
                padding: 10,
                marginTop: 10,
                marginLeft: 10,
                marginBottom: 10,
                borderBottomWidth: 2,
                borderBottomColor: tab === "Related" ? "#32a88b" : "#fff",
                opacity: tab === "Related" ? 1 : 0.5,
              }}
            >
              Related
            </Text>
          </TouchableOpacity>
        </View>{" "}
        {tab === "Episodes" && data?.episodes?.length > 0 && (
          <React.Suspense fallback={<ActivityIndicator color="#32a88b" />}>
            <EpisodeList ep={data.episodes} />
          </React.Suspense>
        )}
        {tab === "Related" && (
          <Slidinglist
            data={data?.relatedAnime}
            limit={data?.relatedAnime.length}
          />
        )}
        <View>
          <Text
            style={{
              paddingLeft: 10,
              color: "#fff",
              fontSize: 20,
              fontWeight: "700",
            }}
          >
            Recomendations
          </Text>
          <Slidinglist data={data?.recommendations} limit={5} />
        </View>
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
  tabs: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    padding: 10,
    marginTop: 10,
    marginLeft: 10,
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#32a88b",
  },
});

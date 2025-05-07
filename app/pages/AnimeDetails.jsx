import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";

import * as ScreenOrientation from "expo-screen-orientation";
import { useNavigation } from "expo-router";
import AnimeDetailsEpList from "../components/AnimeDetailsEpList";
import { useList } from "../components/Provider/WhatchlistProvider";
import Slidinglist from "../components/Slidinglist";
import GenreTagList from "../components/GenreTagList";
import YoutubeIframe from "react-native-youtube-iframe";

const AnimeDetails = ({ route }) => {
  const { addToWatchList, inWatchList } = useList();
  const { id } = route.params;
  const [data, setData] = useState();
  const [tab, setTab] = useState("Episodes");
  const [loading, setLoading] = useState(false);
  const [desToggle, setDesToggle] = useState(false);
  const isInWatchList = data?.id ? inWatchList(id) : false;
  const [metaData, setMetaData] = useState();
  const navigation = useNavigation();

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
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    StatusBar.setHidden(false);
    fetchData();
  }, [id]);

  useEffect(() => {
    if (data) {
      const fetchMeta = async () => {
        try {
          const meta = await fetch(
            `https://consapi-chi.vercel.app/meta/mal/info/${data?.malID}`
          );
          const metaRes = await meta.json();
          setMetaData(metaRes);
          console.log("meta data: ", metaRes);
          console.log(
            "trailer link: ",
            `${metaData?.trailer?.site}${metaData?.trailer?.id}`
          );
          console.log("trailer thumbnail: ", `${metaData?.trailer?.thumbnail}`);
        } catch (error) {
          console.log("error fetching meta data: ", error);
        }
      };
      fetchMeta();
    }
  }, [data]);
  const trailerLink = `${metaData?.trailer?.site}${metaData?.trailer?.id}`;
  if (!data && loading) {
    return (
      <View style={styles.container}>
        <Text>
          <ActivityIndicator color={"#32a88b"} size={50} />
        </Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <ImageBackground style={styles.image} source={{ uri: data?.image }}>
          <LinearGradient
            colors={["transparent", "#001"]}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icon
                style={{ padding: 10 }}
                name="keyboard-backspace"
                color={"white"}
                size={30}
              />
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient
            colors={["transparent", "#001"]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.slide}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "90%",
                gap: 10,
              }}
            >
              <View style={{ width: "90%" }}>
                <Text style={styles.text}>{data?.title}</Text>
                <View
                  style={{
                    flexDirection: "row",
                    paddingVertical: 10,
                    width: "100%",
                    gap: 10,
                    alignItems: "center",
                  }}
                >
                  {data?.status && (
                    <Text
                      style={{
                        fontSize: 13,
                        color: "#32a88b",
                      }}
                    >
                      {data?.status}
                    </Text>
                  )}

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      width: 25,
                      justifyContent: "center",
                    }}
                  >
                    <Icon name="star-rate" color={"#32a88b"} size={15} />
                    {metaData?.rating && (
                      <Text
                        style={{
                          fontSize: 13,
                          color: "#fff",
                        }}
                      >
                        {metaData?.rating.toFixed(1)}
                      </Text>
                    )}
                  </View>
                  {data?.totalEpisodes && (
                    <Text
                      style={{
                        fontSize: 13,
                        color: "#fff",
                      }}
                    >
                      {data?.totalEpisodes} Episodes
                    </Text>
                  )}
                  {data?.type && (
                    <Text
                      style={{
                        fontSize: 13,
                        color: "#32a88b",
                        paddingHorizontal: 4,
                        borderWidth: 1,
                        borderColor: "#32a88b",
                        borderRadius: 5,
                      }}
                    >
                      {data?.type}
                    </Text>
                  )}
                </View>
              </View>
              <TouchableOpacity
                style={styles.btn2}
                onPress={() => addToWatchList(data)}
              >
                <Text>
                  {data && (
                    <Icon
                      name={isInWatchList ? "bookmark-added" : "bookmark-add"}
                      size={30}
                      color={isInWatchList ? "#32a88b" : "#fff"}
                    />
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </ImageBackground>
        <GenreTagList genres={data?.genres} />
        <Text numberOfLines={desToggle ? null : 5} style={styles.des}>
          {data?.description}
        </Text>
        <TouchableOpacity
          style={{ marginLeft: "auto", marginRight: 10 }}
          onPress={() => setDesToggle(!desToggle)}
        >
          <Text style={{ color: "#32a88b", fontWeight: "bold" }}>
            {!desToggle ? "+ more" : "- less"}
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            marginTop: 10,
            alignItems: "center",
            justifyContent: "space-evenly",
            width: Dimensions.get("screen").width,
          }}
        >
          <TouchableOpacity onPress={() => setTab("Episodes")}>
            <Text
              style={[
                styles.tabs,
                {
                  borderBottomColor: tab === "Episodes" ? "#32a88b" : "#fff",
                  opacity: tab === "Episodes" ? 1 : 0.5,
                },
              ]}
            >
              Episodes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab("Trailer")}>
            <Text
              style={[
                styles.tabs,
                {
                  borderBottomColor: tab === "Trailer" ? "#32a88b" : "#fff",
                  opacity: tab === "Trailer" ? 1 : 0.5,
                },
              ]}
            >
              Trailer
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab("Related")}>
            <Text
              style={[
                styles.tabs,
                {
                  borderBottomColor: tab === "Related" ? "#32a88b" : "#fff",
                  opacity: tab === "Related" ? 1 : 0.5,
                },
              ]}
            >
              Related
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setTab("Recomended")}>
            <Text
              style={[
                styles.tabs,
                {
                  borderBottomColor: tab === "Recomended" ? "#32a88b" : "#fff",
                  opacity: tab === "Recomended" ? 1 : 0.5,
                },
              ]}
            >
              Recomended
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 300, alignItems: "center" }}>
          {tab === "Episodes" && data?.episodes?.length > 0 && (
            <React.Suspense
              fallback={
                <Text>
                  <ActivityIndicator color="#32a88b" />
                </Text>
              }
            >
              <AnimeDetailsEpList ep={data.episodes} image={data?.image} />
            </React.Suspense>
          )}
          {tab === "Related" && (
            <Slidinglist data={data?.relatedAnime} limit={15} />
          )}
          {tab === "Trailer" && (
            <View style={{ width: "100%", alignItems: "center" }}>
              <View style={{ width: "100%" }}>
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 18,
                    marginVertical: 5,
                    fontWeight: "bold",
                    textAlign: "left",
                    paddingLeft: 10,
                  }}
                >
                  {data?.title} Trailer
                </Text>
              </View>
              <YoutubeIframe
                height={250}
                width={"95%"}
                play={false}
                videoId={metaData?.trailer?.id}
                webViewProps={{
                  allowsFullscreenVideo: false,
                }}
                initialPlayerParams={{
                  controls: 0, // Hide playback controls
                  modestbranding: true, // Hide YouTube logo
                  showinfo: false, // Deprecated, but still safe
                  rel: false, // Disable related videos at end
                  fs: 0, // Disable fullscreen button
                  iv_load_policy: 0, // Hide annotations
                  loop: true,
                }}
              />
            </View>
          )}
          {tab === "Recomended" && (
            <Slidinglist data={data?.recommendations} limit={10} />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnimeDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    paddingVertical: 10,
  },
  image: {
    width: "100%",
    height: 300,
  },
  des: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "400",
    padding: 10,
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
  tabs: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 2,
  },
});

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
import CharacterList from "../components/CharacterList";

const AnimeDetails = ({ route }) => {
  const { addToWatchList, inWatchList } = useList();
  const { id } = route.params;
  const [data, setData] = useState();
  const [tab, setTab] = useState("Episodes");
  const [loading, setLoading] = useState(false);
  const [desToggle, setDesToggle] = useState(false);
  const isInWatchList = data?.id ? inWatchList(id) : false;
  const navigation = useNavigation();
  const [remainingSeconds, setRemainingSeconds] = useState(null);

  useEffect(() => {
    if (remainingSeconds === null) return;

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds]);
  function getTime(seconds) {
    let time;
    if (!seconds) {
      time = {
        d: "00",
        h: "00",
        m: "00",
        s: "00",
      };
    } else {
      const days = Math.floor(seconds / (3600 * 24));
      const hrs = Math.floor((seconds % (3600 * 24)) / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      time = {
        d: String(days).padStart(2, "0"),
        h: String(hrs).padStart(2, "0"),
        m: String(mins).padStart(2, "0"),
        s: String(secs).padStart(2, "0"),
      };
    }
    return time;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        const response = await fetch(
          `${apiUrl}/meta/anilist/info/${id}?provider=animepahe`
        );
        console.log("Anime Id: ", id);
        const res = await response.json();
        setData(res);
        setRemainingSeconds(res.nextAiringEpisode?.timeUntilAiring);
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

  if (loading) {
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
        <ImageBackground style={styles.image} source={{ uri: data?.cover }}>
          <LinearGradient
            colors={["transparent", "#1a1a1a"]}
            start={{ x: 0.5, y: 0.7 }}
            end={{ x: 0.5, y: 0 }}
            style={{ height: 55 }}
          >
            <TouchableOpacity
              style={{ zIndex: 100 }}
              onPress={() => navigation.goBack()}
            >
              <Icon
                style={{ padding: 10 }}
                name="keyboard-backspace"
                color={"white"}
                size={30}
              />
            </TouchableOpacity>
          </LinearGradient>
          <LinearGradient
            colors={["transparent", "#1a1a1a"]}
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
                position: "absolute",
                bottom: 0,
                left: 10,
              }}
            >
              <View style={{ width: "90%" }}>
                <Text style={styles.text} numberOfLines={1}>
                  {data?.title.english ||
                    data?.title.romaji ||
                    data?.title.native}
                </Text>
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
                    {data?.rating && (
                      <Text
                        style={{
                          fontSize: 13,
                          color: "#fff",
                        }}
                      >
                        {(data?.rating / 10).toFixed(1)}
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
              {data && (
                <TouchableOpacity
                  onPress={() => addToWatchList(data)}
                  style={styles.btn2}
                >
                  <Icon
                    name={!inWatchList(data?.id) ? "add" : "remove"}
                    size={20}
                    color={"#fff"}
                  />
                </TouchableOpacity>
              )}
            </View>
          </LinearGradient>
        </ImageBackground>
        <GenreTagList genres={data?.genres} />
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            minHeight: 40,
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
              width: "90%",
              backgroundColor: "#000",
              marginHorizontal: "auto",
              borderRadius: 50,
              height: 60,
            }}
          >
            <View
              style={{
                color: "#32a88b",
                justifyContent: "center",
                alignItems: "center",
                width: 30,
              }}
            >
              <Text
                style={{ color: "#32a88b", fontSize: 15, fontWeight: "700" }}
              >
                {getTime(remainingSeconds).d}
              </Text>
              <Text style={{ color: "#32a88b", lineHeight: 15, fontSize: 10 }}>
                days
              </Text>
            </View>
            <Text style={{ color: "#32a88b" }}>:</Text>
            <View
              style={{
                color: "#32a88b",
                justifyContent: "center",
                alignItems: "center",
                width: 30,
              }}
            >
              <Text
                style={{ color: "#32a88b", fontSize: 15, fontWeight: "700" }}
              >
                {getTime(remainingSeconds).h}
              </Text>
              <Text style={{ color: "#32a88b", lineHeight: 15, fontSize: 10 }}>
                hrs
              </Text>
            </View>
            <Text style={{ color: "#32a88b" }}>:</Text>
            <View
              style={{
                color: "#32a88b",
                width: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: "#32a88b", fontSize: 15, fontWeight: "700" }}
              >
                {getTime(remainingSeconds).m}
              </Text>
              <Text style={{ color: "#32a88b", lineHeight: 15, fontSize: 10 }}>
                min
              </Text>
            </View>
            <Text style={{ color: "#32a88b" }}>:</Text>
            <View
              style={{
                color: "#32a88b",
                width: 30,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: "#32a88b", fontSize: 15, fontWeight: "700" }}
              >
                {getTime(remainingSeconds).s}
              </Text>
              <Text style={{ color: "#32a88b", lineHeight: 15, fontSize: 10 }}>
                sec
              </Text>
            </View>
          </View>
        </View>
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
        <View style={{ height: 250, alignItems: "center" }}>
          {tab === "Episodes" && data?.episodes?.length > 0 && (
            <AnimeDetailsEpList
              ep={data.episodes}
              image={data?.image}
              // hasDub={data.hasDub}
              // hasSub={data.hasSub}
              cover={data?.cover || data.image}
              name={
                data?.title?.english ||
                data?.title?.romaji ||
                data?.title.native
              }
            />
          )}
          {tab === "Related" && (
            <Slidinglist data={data?.relations} limit={15} />
          )}
          {tab === "Trailer" && data?.trailer?.id && (
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
                  {data?.title.english ||
                    data?.title.romaji ||
                    data?.title.native}{" "}
                  Trailer
                </Text>
              </View>
              <YoutubeIframe
                height={250}
                width={"95%"}
                play={false}
                videoId={data?.trailer?.id}
                webViewProps={{
                  allowsFullscreenVideo: false,
                }}
                initialPlayerParams={{
                  controls: false, // Hide playback controls
                  modestbranding: true, // Hide YouTube logo
                  showinfo: false, // Deprecated, but still safe
                  rel: false, // Disable related videos at end
                  fs: 0, // Disable fullscreen button
                  iv_load_policy: 0, // Hide annotations
                  loop: true,
                  showClosedCaptions: true,
                  playerLang: "english",
                }}
              />
            </View>
          )}
          {tab === "Recomended" && (
            <Slidinglist data={data?.recommendations} limit={10} />
          )}
        </View>
        <View>
          {data?.characters && <CharacterList characters={data?.characters} />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnimeDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f1f1f",
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
    height: "100%",
    width: "100%",
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

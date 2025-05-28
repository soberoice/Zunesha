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
  const [metaData, setMetaData] = useState();
  const [anilist, setAnilist] = useState();
  const navigation = useNavigation();

  function getTime(time) {
    const timestamp = time; // Unix timestamp in seconds
    const date = new Date(timestamp * 1000); // Convert to milliseconds
    const formattedDate = date.toLocaleString(); // You can customize this format
    return formattedDate;
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/anime/zoro/info?id=${id}`);
        console.log("Anime Id: ", id);
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
          setMetaData();
          const apiUrl = process.env.EXPO_PUBLIC_API_URL;
          const meta = await fetch(`${apiUrl}/meta/mal/info/${data?.malID}`);
          console.log("MAL Id: ", data.malID);
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
      const fetchAnilistMeta = async () => {
        try {
          setAnilist();
          const apiUrl = process.env.EXPO_PUBLIC_API_URL;
          const meta = await fetch(
            `${apiUrl}/meta/anilist/info/${data?.alID}?provider=gogoanime`
          );
          console.log("anilist id: ", data.alID);
          const metaRes = await meta.json();
          setAnilist(metaRes);
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
      fetchAnilistMeta();
    }
  }, [data]);

  if (loading || !metaData || !anilist) {
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
        <ImageBackground
          style={styles.image}
          source={{ uri: anilist?.cover || data?.image }}
        >
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
            <View style={{ alignItems: "center", paddingTop: 20 }}>
              <Image
                style={{ width: 125, height: 175 }}
                source={{ uri: anilist?.image || data?.image }}
              />
            </View>
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
                  {data?.title}
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
        <View
          style={{ width: "100%", justifyContent: "center", minHeight: 35 }}
        >
          {anilist?.nextAiringEpisode ? (
            <Text
              style={{ color: "#32a88b", fontWeight: "bold", paddingLeft: 10 }}
            >
              Episode {anilist?.nextAiringEpisode?.episode} Estimated Release
              Time: {getTime(anilist?.nextAiringEpisode?.airingTime)}
            </Text>
          ) : (
            <Text
              style={{ color: "#32a88b", fontWeight: "bold", paddingLeft: 10 }}
            >
              No Estimated Release Date
            </Text>
          )}
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
        <View style={{ height: 300, alignItems: "center" }}>
          {tab === "Episodes" && data?.episodes?.length > 0 && metaData && (
            <AnimeDetailsEpList
              ep={data.episodes}
              image={data?.image}
              hasDub={data.hasDub}
              hasSub={data.hasSub}
              cover={anilist?.cover || data?.image}
            />
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
        <View>
          {anilist?.characters && (
            <CharacterList characters={anilist?.characters} />
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
    fontSize: 12,
    fontWeight: "700",
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 2,
  },
});

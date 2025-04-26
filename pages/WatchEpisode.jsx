import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useVideoPlayer, VideoView } from "expo-video";

const WatchEpisode = ({ route }) => {
  const { id } = route.params;
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const video = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://consapi-chi.vercel.app/anime/zoro/watch/${id}`
        );
        const res = await response.json();
        setData(res);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  //   if (loading) {
  //     return (
  //       <View style={styles.container}>
  //         <ActivityIndicator color={"#32a88b"} size={50} />
  //       </View>
  //     );
  //   }
  const videoSource = data?.sources[0]?.url;
  const player = useVideoPlayer(videoSource, (player) => {
    player.loop = true;
    player.play();
    console.log(videoSource);
  });
  return (
    <View style={styles.container}>
      {data?.sources?.[0]?.url ? (
        <VideoView
          allowsFullscreen
          player={player}
          source={{ uri: `${proxy}${data.sources[0].url}` }}
          style={styles.video}
          useNativeControls
          resizeMode="contain"
          isLooping
          onError={(e) => console.error("Video error:", e)}
        />
      ) : (
        <Text style={{ color: "#fff", textAlign: "center", marginTop: 20 }}>
          No video source found.
        </Text>
      )}
    </View>
  );
};

export default WatchEpisode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  video: {
    flex: 1,
  },
});

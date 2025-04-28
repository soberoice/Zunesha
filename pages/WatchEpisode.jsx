import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import Video from "react-native-video";
import React, { useEffect, useRef, useState } from "react";
import EpisodeList from "../components/EpisodeList";

const WatchEpisode = ({ route }) => {
  const { id, ep, title, number } = route.params;
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const video = useRef(null);
  const [subtitleTracks, setSubtitleTracks] = useState([]);
  const [selectedSubtitleTrack, setSelectedSubtitleTrack] = useState({
    type: "index",
    value: 0,
  });

  const [isVideoReady, setIsVideoReady] = useState(false);
  const [NullSubtitleIndex, setNullSubtitleIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData();
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

  useEffect(() => {
    if (data?.subtitles && data?.subtitles?.length > 0) {
      setSubtitleTracks(data?.subtitles);
      console.log("Subtitle Tracks: ", data?.subtitles);
    }
  }, [data?.subtitles]);

  const videoSource = data?.sources[0]?.url;

  return (
    <View style={styles.container}>
      {videoSource ? (
        <View>
          <Video
            ref={video}
            allowsFullscreen
            resizeMode={"contain"}
            source={{
              uri: videoSource,
              textTracks: subtitleTracks?.map((track, index) => ({
                title: track.lang || "Untitled",
                language: track.lang?.toLowerCase(),
                uri: track.url || "",
                index,
                type: "text/vtt",
              })),
            }}
            onLoad={(value) => {
              setIsVideoReady(true);
              const nullTrackCount =
                value.textTracks?.filter(
                  (track) => !track.language && !track.title
                ).length || 0;
              setNullSubtitleIndex(nullTrackCount);
              console.log("nullIndex:", nullTrackCount);
            }}
            style={styles.video}
            onTextTracks={(event) => {
              console.log("Text Tracks:", event);
              const tracks = event.textTracks;

              const englishTrack = tracks.find((track) =>
                track.language?.toLowerCase().includes("english")
              );

              if (englishTrack) {
                setSelectedSubtitleTrack({
                  type: "index",
                  value: englishTrack.index,
                });
                console.log(
                  "Selected English subtitle at index:",
                  englishTrack.index
                );
              } else {
                console.log("No English subtitle found");
              }
            }}
            selectedTextTrack={selectedSubtitleTrack}
            controls
            onError={(e) => console.error("Video error:", e)}
            subtitleStyle={{ paddingBottom: 25, fontSize: 15, opacity: 0.8 }}
          />
        </View>
      ) : (
        <View
          style={{
            color: "#fff",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
            height: 230,
          }}
        >
          <ActivityIndicator color={"#32a88b"} size={50} />
        </View>
      )}
      <Text style={{ fontSize: 20, color: "#fff" }}>
        Episode {number}: {title}
      </Text>
      <EpisodeList ep={ep} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  video: {
    width: "100%",
    height: 250,
  },
});

export default WatchEpisode;

import {
  ActivityIndicator,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Video from "react-native-video";
import React, { useCallback, useEffect, useRef, useState } from "react";
import EpisodeList from "../components/EpisodeList";
import * as ScreenOrientation from "expo-screen-orientation";
import Slider from "@react-native-community/slider";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useMemo } from "react";
import * as SystemUI from "expo-system-ui";

const WatchEpisode = ({ route }) => {
  const { id, ep, title, number, image } = route.params;
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const video = useRef(null);
  const [subtitleTracks, setSubtitleTracks] = useState([]);
  const [paused, setPaused] = useState(true);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekTime, setSeekTime] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [playbackState, setPlaybackState] = useState({
    isPlaying: false,
    isSeeking: false,
  });
  const [selectedSubtitleTrack, setSelectedSubtitleTrack] = useState({
    type: "index",
    value: 0,
  });
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [NullSubtitleIndex, setNullSubtitleIndex] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const hasSetSubtitle = useRef(false);
  const videoSource = data?.sources[0]?.url;
  const [playerDimensions, setPlayerDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [dimensions, setDimensions] = useState({
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
  });
  const [wrapperDimensions, setWrapperDimensions] = useState({
    width: 0,
    height: 0,
  });
  const videoStyle = useMemo(
    () => ({
      width: isFullScreen ? Dimensions.get("window").height : "100%",
      height: isFullScreen ? dimensions.width : undefined,
      aspectRatio: isFullScreen ? undefined : 16 / 9, // Default 16:9 aspect ratio in normal mode
      backgroundColor: "black",
      top: 0,
      left: 0,
      position: "absolute",
    }),
    [isFullScreen, dimensions]
  );

  const videoSourceObject = useMemo(
    () => ({
      uri: videoSource,
      textTracks: subtitleTracks?.map((track, index) => ({
        title: track.lang || "Untitled",
        language: track.lang?.toLowerCase(),
        uri: track.url || "",
        index,
        type: "text/vtt",
      })),
    }),
    [videoSource, subtitleTracks]
  );
  const handlePlayPress = useCallback(() => {
    if (video.current) {
      if (playbackState.isPlaying) {
        video.current.pause();
      } else {
        video.current.resume();
      }
    }
  }, [playbackState.isPlaying]);
  const handleFullscreenToggle = () => {
    setIsFullScreen(!isFullScreen);

    if (!isFullScreen) {
      // Enter Fullscreen mode
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
      setDimensions({
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
      });

      // Hide StatusBar
      StatusBar.setHidden(true);
    } else {
      // Exit Fullscreen mode
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
      setDimensions({
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
      });

      // Show StatusBar again (automatically reappears on swipe down)
      StatusBar.setHidden(false, "fade");
    }
  };

  useEffect(() => {
    if (isFullScreen) {
      SystemUI.setBackgroundColorAsync("#000"); // Makes bar black if visible
    } else {
      SystemUI.setBackgroundColorAsync("#000");
    }
  }, [isFullScreen]);

  const handlePlaybackStateChange = useCallback((state) => {
    setPlaybackState(state);
    console.log("Playback State:", state);
  }, []);
  const handleSeek = (time) => {
    video.current.seek(time);
    setCurrentTime(time);
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds == null) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

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
  return (
    <View style={styles.container}>
      {loading && (
        <View
          style={{
            height: 250,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator color="#32a88b" size={50} />
        </View>
      )}

      {videoSource ? (
        <View
          style={{
            backgroundColor: "#000",
            width: isFullScreen ? dimensions.height : "100%",
            height: isFullScreen ? dimensions.width : undefined,
            aspectRatio: isFullScreen ? undefined : 16 / 9,
          }}
        >
          <View
            style={{ flex: 1 }}
            onLayout={(e) => {
              const { width, height } = e.nativeEvent.layout;
              setPlayerDimensions({ width, height });
              setWrapperDimensions({
                width,
                height,
              });
            }}
          >
            <Video
              ref={video}
              allowsFullscreen
              controls={false}
              resizeMode={"contain"}
              source={videoSourceObject}
              onProgress={({ currentTime }) => setCurrentTime(currentTime)}
              onPlaybackStateChanged={handlePlaybackStateChange}
              onLoad={({ duration, textTracks }) => {
                setDuration(duration);
                setIsVideoReady(true);
                const nullTrackCount =
                  textTracks?.filter((track) => !track.language && !track.title)
                    .length || 0;
                setNullSubtitleIndex(nullTrackCount);
              }}
              style={videoStyle}
              onTextTracks={(event) => {
                if (hasSetSubtitle.current) return;

                const tracks = event.textTracks;
                const englishTrack = tracks.find((track) =>
                  track.language?.toLowerCase().includes("english")
                );

                if (englishTrack) {
                  setSelectedSubtitleTrack({
                    type: "index",
                    value: englishTrack.index,
                  });
                  hasSetSubtitle.current = true;
                }
              }}
              selectedTextTrack={isVideoReady && selectedSubtitleTrack}
              onError={(e) => console.error("Video error:", e)}
              subtitleStyle={{ paddingBottom: 25, fontSize: 15, opacity: 0.8 }}
              poster={{ source: { uri: image }, resizeMode: "contain" }}
              onFullscreenPlayerWillPresent={async () => {
                await ScreenOrientation.lockAsync(
                  ScreenOrientation.OrientationLock.LANDSCAPE
                );
              }}
              onFullscreenPlayerWillDismiss={async () => {
                await ScreenOrientation.lockAsync(
                  ScreenOrientation.OrientationLock.PORTRAIT_UP
                );
              }}
            />
          </View>
          <View style={[styles.overlay, { zIndex: 1 }]}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 18,
                color: "#fff",
                position: "absolute",
                top: 0,
                left: 0,
                padding: 5,
              }}
            >
              Episode {number}: {title}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handlePlayPress()}
            >
              <Text style={styles.buttonText}>
                <Icon
                  name={playbackState.isPlaying ? "pause" : "play-arrow"}
                  size={40}
                  color="#fff"
                />
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
                height: 40,
                position: "absolute",
                bottom: 0,
              }}
            >
              <Text style={styles.time}>
                {formatTime(isSeeking ? seekTime : currentTime)}
              </Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={duration}
                value={currentTime}
                minimumTrackTintColor="#32a88b"
                maximumTrackTintColor="#888"
                thumbTintColor="#32a88b"
                onValueChange={(value) => {
                  setIsSeeking(true);
                  setSeekTime(value);
                }}
                onSlidingStart={() => {
                  setIsSeeking(true);
                }}
                onSlidingComplete={(value) => {
                  handleSeek(value);
                  setIsSeeking(false);
                }} // resume playback after seeking
              />

              <Text style={styles.time}>{formatTime(duration)}</Text>
              <TouchableOpacity onPress={() => handleFullscreenToggle()}>
                <Text>
                  <Icon
                    name={isFullScreen ? "fullscreen-exit" : "fullscreen"}
                    size={30}
                    color={"#fff"}
                  />
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View></View>
      )}
      <View style={{ paddingVertical: 10 }}>
        <EpisodeList ep={ep} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Optional dim effect
  },
  buttonText: {
    color: "#fff",
  },
  slider: {
    width: "70%",
    height: 40,
  },
  time: {
    color: "white",
  },
});

export default WatchEpisode;

import {
  ActivityIndicator,
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Video from "react-native-video";
import React, { useCallback, useEffect, useRef, useState } from "react";
import EpisodeList from "../components/EpisodeList";
import * as ScreenOrientation from "expo-screen-orientation";
import Slider from "@react-native-community/slider";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useMemo } from "react";
import VideoSettings from "../components/VideoSettings";
import { useNavigation } from "expo-router";
// import * as SystemUI from "expo-system-ui";

const WatchEpisode = ({ route }) => {
  const { id, ep, title, number, image } = route.params;
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const video = useRef(null);
  const [subtitleTracks, setSubtitleTracks] = useState([]);
  const [subtitleIndex, setSubtitleIndex] = useState(2);
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
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [NullSubtitleIndex, setNullSubtitleIndex] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const timeoutRef = useRef(null);
  const videoSource = data?.sources[0]?.url;
  const [playerDimensions, setPlayerDimensions] = useState({
    width: 0,
    height: 0,
  });
  const navigation = useNavigation();

  const [dimensions, setDimensions] = useState({
    width: Dimensions.get("screen").width,
    height: Dimensions.get("screen").height,
  });
  const [wrapperDimensions, setWrapperDimensions] = useState({
    width: 0,
    height: 0,
  });
  const overlayOpacity = useRef(new Animated.Value(0)).current;
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
  const [toggleSettings, setToggleSettings] = useState(false);
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

      StatusBar.setHidden(false, "fade");
    }
  };

  // useEffect(() => {
  //   if (isFullScreen) {
  //     SystemUI.setBackgroundColorAsync("#000"); // Makes bar black if visible
  //   } else {
  //     SystemUI.setBackgroundColorAsync("#000");
  //   }
  // }, [isFullScreen]);

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
    console.log(`subtitleindex: ${subtitleIndex}`);
  }, [id]);

  useEffect(() => {
    if (data?.subtitles && data?.subtitles?.length > 0) {
      setSubtitleTracks(data?.subtitles);
      console.log("Subtitle Tracks: ", data?.subtitles);
    }
    showOverlay();
  }, [data?.subtitles]);

  const showOverlay = () => {
    setOverlayVisible(true);
    Animated.timing(overlayOpacity, {
      toValue: 1,
      duration: 500, // Fade-in duration
      useNativeDriver: true,
    }).start();

    // Clear any existing timeout and set a new one
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      hideOverlay(); // Hide the overlay after 3 seconds of inactivity
    }, 3000); // 3 seconds timeout (adjust as needed)
  };

  const hideOverlay = () => {
    Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: 500, // Fade-out duration
      useNativeDriver: true,
    }).start(() => {
      setOverlayVisible(false); // Set visible state to false after fade-out
    });
  };

  const handleOverlayPress = () => {
    if (overlayVisible) {
      hideOverlay();
    } else {
      showOverlay();
    }
  };

  const handleRewind = (farward) => {
    if (farward) {
      video.current.seek(currentTime + 10);
    } else {
      video.current.seek(currentTime - 10);
    }
  };
  const handleBackPress = () => {
    if (isFullScreen) {
      setIsFullScreen(false);
      // Exit Fullscreen mode
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP
      );
      setDimensions({
        width: Dimensions.get("screen").width,
        height: Dimensions.get("screen").height,
      });

      StatusBar.setHidden(false, "fade");
    } else {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View
          style={{
            aspectRatio: 16 / 9,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <ActivityIndicator color="#32a88b" size={50} />
        </View>
      )}

      {videoSource ? (
        <TouchableWithoutFeedback onPress={handleOverlayPress}>
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
                onProgress={({ currentTime }) => {
                  setCurrentTime((prev) => Math.floor(currentTime));
                }}
                progressUpdateInterval={1000}
                onPlaybackStateChanged={handlePlaybackStateChange}
                onLoad={({ duration, textTracks }) => {
                  setDuration(duration);
                  setIsVideoReady(true);
                  const nullTrackCount =
                    textTracks?.filter(
                      (track) => !track.language && !track.title
                    ).length || 0;
                  setNullSubtitleIndex(nullTrackCount);
                  console.log(`duration: ${duration}`);
                }}
                style={videoStyle}
                onTextTracks={(event) => {
                  const tracks = event.textTracks;
                  console.log(`subtitle index: ${subtitleIndex}`);
                  setSelectedSubtitleTrack({
                    type: "index",
                    value: subtitleIndex,
                  });
                }}
                selectedTextTrack={isVideoReady && selectedSubtitleTrack}
                onError={(e) => console.error("Video error:", e)}
                subtitleStyle={{
                  paddingBottom: 25,
                  fontSize: 15,
                  opacity: 0.8,
                }}
                poster={{ source: { uri: image }, resizeMode: "contain" }}
              />
            </View>
            {overlayVisible && (
              <Animated.View
                style={[styles.overlay, { opacity: overlayOpacity }]}
              >
                <View style={[styles.overlay, { zIndex: 1 }]}>
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      padding: 5,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 5,
                      }}
                      onPress={() => handleBackPress()}
                    >
                      <Icon
                        name="keyboard-backspace"
                        color={"#fff"}
                        size={30}
                      />
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: 15,
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                      >
                        Episode {number}: {title}
                      </Text>
                    </TouchableOpacity>
                    {!isFullScreen && (
                      <TouchableOpacity
                        style={styles.button}
                        onPress={() => setToggleSettings(!toggleSettings)}
                      >
                        <Text style={styles.buttonText}>
                          <Icon name={"settings"} size={25} color="#fff" />
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={{ flexDirection: "row", gap: 20 }}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => handleRewind(false)}
                    >
                      <Text style={styles.buttonText}>
                        <Icon name={"replay-10"} size={45} color="#fff" />
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => handlePlayPress()}
                    >
                      <Text style={styles.buttonText}>
                        <Icon
                          name={
                            playbackState.isPlaying ? "pause" : "play-arrow"
                          }
                          size={45}
                          color="#fff"
                        />
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => handleRewind(true)}
                    >
                      <Text style={styles.buttonText}>
                        <Icon name={"forward-10"} size={45} color="#fff" />
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                      alignItems: "center",
                      height: 40,
                      bottom: 0,
                      width: "100%",
                      position: "absolute",
                    }}
                  >
                    <View>
                      <Text style={styles.time} key={currentTime}>
                        {formatTime(currentTime)}
                      </Text>
                    </View>
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
              </Animated.View>
            )}
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <View></View>
      )}
      <View style={{ paddingVertical: 10 }}>
        <EpisodeList ep={ep} />
      </View>
      {isVideoReady && (
        <VideoSettings
          toggleSettings={toggleSettings}
          setToggleSettings={setToggleSettings}
          setSubtitleIndex={setSubtitleIndex}
          subtileTracks={subtitleTracks}
          subtitleIndex={subtitleIndex}
        />
      )}
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
    width: "100%",
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
    fontSize: 15,
    zIndex: 999,
  },
});

export default WatchEpisode;

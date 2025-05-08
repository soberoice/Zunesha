import {
  ActivityIndicator,
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Video from "react-native-video";
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import Slider from "@react-native-community/slider";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useMemo } from "react";
import VideoSettings from "../components/VideoSettings";
import { useNavigation } from "expo-router";
import * as SystemUI from "expo-system-ui";
import EpisodeList from "../components/EpisodeList";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
const WatchEpisode = ({ route }) => {
  const { id, ep, title, number, cover, hasSub, hasDub, episodeHasDub } =
    route.params;
  const [isDub, setIsDub] = useState(false);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const video = useRef(null);
  const [subtitleTracks, setSubtitleTracks] = useState([]);
  const [subtitleIndex, setSubtitleIndex] = useState(null);
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
  const [isMute, setIsMute] = useState(false);
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
      aspectRatio: isFullScreen ? undefined : 16 / 12, // Default 16:9 aspect ratio in normal mode
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
  const prevSubIndex = usePrevious(subtitleIndex);
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

    const totalSeconds = Math.floor(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const h = hours > 0 ? `${hours}:` : "";
    const m =
      hours > 0 ? `${minutes.toString().padStart(2, "0")}` : `${minutes}`;
    const s = secs.toString().padStart(2, "0");

    return `${h}${m}:${s}`;
  };
  const fetchData = async () => {
    try {
      setIsVideoReady(false);
      setIsMute(false);
      setData();
      setLoading(true);
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const response = await fetch(
        `${apiUrl}/anime/zoro/watch/${id}?dub=${isDub}`
      );
      const res = await response.json();
      setData(res);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
      console.log(data);
    }
  };

  const [englishIndex, setEnglishIndex] = useState();
  useEffect(() => {
    fetchData();
    setSubtitleIndex(undefined);
  }, [id]);
  useEffect(() => {
    if (isDub && episodeHasDub) {
      fetchData();
      setSubtitleIndex(undefined);
    } else if (isDub && !episodeHasDub) {
      setIsDub(false);
      ToastAndroid.show(
        `Episode ${number} not available in dub`,
        ToastAndroid.SHORT
      );
    }
  }, [isDub]);
  useEffect(() => {
    if (
      prevSubIndex !== englishIndex &&
      prevSubIndex !== subtitleIndex &&
      prevSubIndex !== undefined
    ) {
      fetchData();
    }
  }, [subtitleIndex]);

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
  const handleVolumePress = () => {
    const newMuteState = !isMute;
    console.log("Toggling mute. New state: ", newMuteState);
    setIsMute(newMuteState);

    if (video.current) {
      video.current.setVolume(newMuteState ? 0.0 : 1.0);
    }
  };

  return (
    <View style={styles.container}>
      {!isVideoReady && (
        <View
          style={{
            aspectRatio: 16 / 12,
            position: "absolute",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            width: "100%",
          }}
        >
          {console.log("video Sourse", videoSource)}
          <ActivityIndicator color="#32a88b" size={50} />
        </View>
      )}
      {loading && (
        <View
          style={{
            aspectRatio: 16 / 12,
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
            width: "100%",
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
              width: isFullScreen ? dimensions.height - "10%" : "100%",
              height: isFullScreen ? dimensions.width : undefined,
              aspectRatio: isFullScreen ? undefined : 16 / 12,
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
                  console.log("cover: ", cover);
                }}
                style={videoStyle}
                onTextTracks={(event) => {
                  const tracks = event.textTracks;
                  const englishTrack = tracks.find((track) =>
                    track.language?.toLowerCase().includes("english")
                  );
                  if (subtitleIndex === undefined) {
                    setSubtitleIndex(englishTrack?.index);
                    setEnglishIndex(englishTrack?.index);
                  }
                  console.log(`english: ${englishTrack?.index}`);
                  console.log(`subtitle index: ${subtitleIndex}`);
                }}
                selectedTextTrack={{
                  type: "index",
                  value: subtitleIndex,
                }}
                onError={(e) => console.error("Video error:", e)}
                subtitleStyle={{
                  paddingBottom: 25,
                  fontSize: 15,
                  opacity: isDub ? 0 : 0.8,
                }}
                poster={{
                  source: { uri: cover },
                  resizeMode: "cover",
                }}
              />
            </View>
            {overlayVisible && (
              <Animated.View
                style={[styles.overlay, { opacity: overlayOpacity }]}
              >
                {/* CONTROLES OVERLAY */}
                <View style={[styles.overlay, { zIndex: 1 }]}>
                  {/* TOP OF CONTROLE NAME AND SETTINGS */}
                  <View
                    style={{
                      position: "absolute",
                      top: 0,
                      padding: 5,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      width: "100%",
                      alignItems: "center",
                    }}
                  >
                    {/* NAME */}
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
                          width: "80%",
                        }}
                      >
                        Episode {number}: {title}
                      </Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: "row", gap: 10 }}>
                      {/* SETTINGS */}
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
                      thumbTintColor="#fff"
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
                    {/* MUTE  */}
                    <TouchableOpacity onPress={() => handleVolumePress()}>
                      <Icon
                        name={!isMute ? "volume-up" : "volume-off"}
                        color={"#fff"}
                        size={25}
                      />
                    </TouchableOpacity>
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
      <View
        style={{
          flexDirection: "row",
          width: Dimensions.get("window").width,
          alignItems: "center",
        }}
      >
        {hasSub && (
          <TouchableOpacity
            style={{ width: "50%" }}
            onPress={() => setIsDub(false)}
          >
            <Text
              style={[
                styles.tabs,
                {
                  borderBottomColor: !isDub ? "#32a88b" : "transparent",
                  opacity: !isDub ? 1 : 0.5,
                },
              ]}
            >
              Sub
            </Text>
          </TouchableOpacity>
        )}
        {hasDub && (
          <TouchableOpacity
            style={{ width: "50%" }}
            onPress={() => setIsDub(true)}
          >
            <Text
              style={[
                styles.tabs,
                {
                  borderBottomColor: isDub ? "#32a88b" : "#fff",
                  opacity: isDub ? 1 : 0.5,
                },
              ]}
            >
              Dub
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={{ paddingVertical: 10 }}>
        <EpisodeList
          ep={ep}
          image={cover}
          currentEp={number}
          isDub={isDub}
          hasSub={hasSub}
          hasDub={hasDub}
        />
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
    zIndex: 2,
  },
  buttonText: {
    color: "#fff",
  },
  slider: {
    width: "60%",
    height: 40,
  },
  time: {
    color: "white",
    fontSize: 15,
    zIndex: 999,
  },
  tabs: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 2,
    width: "100%",
    textAlign: "center",
  },
});

export default WatchEpisode;

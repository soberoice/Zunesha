import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef } from "react";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";

const VideoSettings = ({
  toggleSettings,
  setToggleSettings,
  subtileTracks,
  subtitleIndex,
  setSubtitleIndex,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: toggleSettings ? 1 : 0,
      duration: 300,
      useNativeDriver: false, // must be false to animate height
    }).start();
  }, [toggleSettings]);

  const animatedHeight = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  });

  return (
    <GestureHandlerRootView style={toggleSettings ? styles.overlay : null}>
      {toggleSettings && (
        <TouchableOpacity
          onPress={() => setToggleSettings(false)}
          style={styles.fullscreenTouchable}
        />
      )}
      <Animated.View style={[styles.container, { height: animatedHeight }]}>
        <Text style={styles.title}>VideoSettings</Text>
        <ScrollView
          scrollEnabled={true}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={styles.subtitleLabel}>Subtitles</Text>
          <View style={styles.subtitleWrapper}>
            {subtileTracks?.map((track, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  {
                    backgroundColor:
                      subtitleIndex !== index ? "#32a88b" : "transparent",
                    borderColor:
                      subtitleIndex === index ? "#32a88b" : "transparent",
                    borderWidth: subtitleIndex === index ? 1 : 0,
                  },
                  styles.subBtn,
                ]}
                onPress={() => setSubtitleIndex(index)}
              >
                <Text
                  style={{
                    color: subtitleIndex === index ? "#32a88b" : "#fff",
                    textAlign: "center",
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                  }}
                >
                  {track.lang.slice(0, 2)}{" "}
                  {track.lang.toLowerCase().includes("dubtitle") && "Dub"}
                  {track.lang.toLowerCase().includes("simplified") &&
                    "Simplified"}
                  {track.lang.toLowerCase().includes("traditional") &&
                    "Traditional"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </Animated.View>
    </GestureHandlerRootView>
  );
};

export default VideoSettings;

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 10,
  },
  fullscreenTouchable: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: "100%",
    backgroundColor: "#1f1f1f",
    position: "absolute",
    bottom: 0,
    zIndex: 11,
    overflow: "hidden",
  },
  title: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 20,
  },
  scrollContent: {
    flexDirection: "column",
    gap: 10,
    marginHorizontal: 10,
    marginBottom: 50,
  },
  subtitleLabel: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  subtitleWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  subBtn: {
    borderRadius: 5,
  },
});

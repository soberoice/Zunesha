import {
  Animated,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
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
  skipIntro,
  setSkipIntro,
  skipIntroFunc,
  isFullScreen,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: toggleSettings ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [toggleSettings]);

  const animatedHeight = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, isFullScreen ? 300 : 400],
  });
  const isEnabled = skipIntro;

  const toggleSwitch = () => {
    const newSkipState = !skipIntro;
    setSkipIntro(newSkipState);
    console.log("skipIntro", newSkipState);
    skipIntroFunc(newSkipState);
  };

  return (
    <GestureHandlerRootView style={toggleSettings ? styles.overlay : null}>
      {toggleSettings && (
        <TouchableOpacity
          onPress={() => setToggleSettings(false)}
          style={styles.fullscreenTouchable}
        />
      )}
      <Animated.View
        style={[
          styles.container,
          {
            height: animatedHeight,
            width: isFullScreen ? 450 : "100%",
            marginHorizontal: isFullScreen ? "auto" : 0,
          },
        ]}
      >
        <Text style={styles.title}>VideoSettings</Text>
        <ScrollView
          scrollEnabled={true}
          contentContainerStyle={styles.scrollContent}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View>
              <Text style={styles.subtitleLabel}>Skip Intro</Text>
              <Text style={{ color: "#32a88b" }}>
                {isEnabled ? "ON" : "OFF"}
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#32a88b" }}
              thumbColor={skipIntro ? "#32a88b" : "#fff"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={skipIntro}
            />
          </View>
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
                  {track.lang}
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
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenTouchable: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: "#1f1f1f",
    position: "absolute",
    bottom: 0,
    zIndex: 11,
    overflow: "hidden",
    padding: 10,
    gap: 10,
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
    gap: 5,
  },
  subBtn: {
    borderRadius: 5,
  },
});

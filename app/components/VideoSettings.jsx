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
  isFullScreen,
  qualitySources,
  qualityIndex,
  setQualityIndex,
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
          <Text style={styles.subtitleLabel}>Quality</Text>
          <View style={styles.subtitleWrapper}>
            {qualitySources?.map((track, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  {
                    backgroundColor:
                      qualityIndex !== index ? "#32a88b" : "transparent",
                    borderColor:
                      qualityIndex === index ? "#32a88b" : "transparent",
                    borderWidth: qualityIndex === index ? 1 : 0,
                  },
                  styles.subBtn,
                ]}
                onPress={() => setQualityIndex(index)}
              >
                <Text
                  style={{
                    color: qualityIndex === index ? "#32a88b" : "#fff",
                    textAlign: "center",
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                  }}
                >
                  {track.quality}
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

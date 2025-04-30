import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
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
  return (
    <GestureHandlerRootView
      style={[
        {
          height: toggleSettings && "100%",
          width: toggleSettings && "100%",
        },
        styles.overlay,
      ]}
    >
      <TouchableOpacity
        onPress={() => setToggleSettings(false)}
        style={{
          height: toggleSettings && "100%",
          width: toggleSettings && "100%",
        }}
      ></TouchableOpacity>
      <View style={[{ height: toggleSettings ? 300 : 0 }, styles.container]}>
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold",
            fontSize: 18,
            marginTop: 20,
          }}
        >
          VideoSettings
        </Text>
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            flexDirection: "column",
            flexWrap: "wrap",
            gap: 5,
            position: "relative",
            marginVertical: 20,
            marginHorizontal: 10,
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Subtitles
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 5 }}>
            {subtileTracks?.map((track, index) => (
              <TouchableOpacity
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
      </View>
    </GestureHandlerRootView>
  );
};

export default VideoSettings;

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    bottom: 0,
    right: 0,
    width: "100%",
    backgroundColor: "#1f1f1f",
    zIndex: 10,
    position: "absolute",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    position: "absolute",
  },
  subBtn: {
    borderRadius: 5,
  },
});

import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";

const CharacterList = ({ characters }) => {
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const Length = Math.floor(characters?.length / 5);

  function prev() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
      setStart(start - 5);
      setEnd(end - 5);
    }
  }
  function next(length) {
    if (currentPage !== length) {
      console.log(length);
      setCurrentPage(currentPage + 1);
      setStart(start + 5);
      setEnd(end + 5);
    }
  }
  return (
    <View
      style={{
        gap: 10,
        width: Dimensions.get("window").width,
        alignItems: "center",
      }}
    >
      <View style={{ width: "90%" }}>
        <Text
          style={{
            color: "#fff",
            fontWeight: "bold",
            fontSize: 18,
            textAlign: "left",
          }}
        >
          Characters
        </Text>
      </View>
      {characters?.slice(start, end).map((char) => (
        <View
          key={char?.id}
          style={{
            width: "95%",
            height: 70,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              width: "45%",
            }}
          >
            <Image
              style={{ width: 50, height: 50, borderRadius: 50 }}
              source={{ uri: char.image }}
            />
            <View>
              <Text numberOfLines={1} style={styles.text}>
                {char?.name?.full}
              </Text>
              <Text style={[styles.text, { color: "#32a88b" }]}>
                {char?.role}
              </Text>
            </View>
          </View>

          <View
            style={{
              height: 70,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            <View>
              <Text style={[styles.text, { textAlign: "right" }]}>
                {char?.voiceActors[0]?.name.full}
              </Text>
              <Text
                style={[styles.text, { color: "#32a88b", textAlign: "right" }]}
              >
                {char?.voiceActors[0]?.language}
              </Text>
            </View>
            <Image
              style={{ width: 50, height: 50, borderRadius: 50 }}
              source={{ uri: char?.voiceActors[0]?.image }}
            />
          </View>
        </View>
      ))}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingBottom: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            prev();
          }}
        >
          <Icon
            size={30}
            name="keyboard-arrow-left"
            style={{ color: "#fff", opacity: currentPage !== 1 ? 1 : 0.4 }}
          />
        </TouchableOpacity>
        {Array.from({ length: Length }).map((_, index) => (
          <View
            style={{
              height: 10,
              width: 10,
              backgroundColor: "#fff",
              borderRadius: 10,
              marginHorizontal: 2,
              opacity: index + 1 == currentPage ? 1 : 0.3,
            }}
          ></View>
        ))}
        <TouchableOpacity
          onPress={() => {
            next(Length);
          }}
        >
          <Icon
            size={30}
            name="keyboard-arrow-right"
            style={{ color: "#fff", opacity: currentPage !== Length ? 1 : 0.4 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CharacterList;

const styles = StyleSheet.create({
  text: {
    color: "#fff",
    fontSize: 13,
  },
});

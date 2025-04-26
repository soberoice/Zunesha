import {
  InputAccessoryView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "expo-router";

// Helper function to split array into chunks of 50
const splitIntoChunks = (array) => {
  const result = [];
  for (let i = 0; i < array.length; i += 50) {
    result.push(array.slice(i, i + 50));
  }
  return result;
};

const EpisodeList = ({ ep }) => {
  const navigation = useNavigation();
  const chunks = splitIntoChunks(ep); // Split the episodes into chunks
  const [epList, setEpList] = useState(1); // State to store selected chunk
  const [searchInput, setSearchInput] = useState("");

  function search() {
    const filteredEp = ep.filter(
      (episode) => episode.number.toString() === searchInput
    );
    console.log(filteredEp.number);
    return (
      <TouchableOpacity style={styles.btn} key={index} 
      onPress={() => navigation.navigate("watchepisode", { id: filteredEp[0]?.id })}>
        <Text style={{ color: "#fff" }}>{filteredEp[0]?.number}</Text>
      </TouchableOpacity>
    );
  }
  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        <Picker
          dropdownIconColor="#32a88b"
          selectedValue={epList}
          onValueChange={(itemValue) => setEpList(itemValue)}
          style={styles.picker}
          mode="dropdown"
        >
          {chunks.map((item, index) => {
            return (
              <Picker.Item label={index + 1} value={index + 1} key={index} />
            );
          })}
        </Picker>
        <TextInput
          onChangeText={(text) => setSearchInput(text)}
          placeholder="Search Episode"
          style={styles.searchBar}
        />
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
      >
        {searchInput
          ? search()
          : chunks[epList - 1]?.map((item) => (
              <TouchableOpacity style={styles.btn} key={item?.id} 
              onPress={() => navigation.navigate("watchepisode", { id: item.id })}>
                <Text style={{ color: "#fff" }}>{item?.number}</Text>
              </TouchableOpacity>
            ))}
      </ScrollView>
    </View>
  );
};

export default EpisodeList;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    alignItems: "center",
  },
  scrollView: {
    height: 500,
    overflow: "scroll",
  },
  btn: {
    backgroundColor: "#32a88b",
    padding: 10,
    borderRadius: 5,
    margin: 5,
    width: 55,
    alignItems: "center",
  },
  picker: {
    height: 50,
    width: "30%",
    color: "#32a88b",
    borderWidth: 1,
    borderBlockColor: "#32a88b",
    backgroundColor: "none",
    marginLeft: "10",
    borderRadius: 10,
  },
  searchBar: {
    width: "60%",
    borderWidth: 1,
    borderColor: "#32a88b",
    borderRadius: 5,
    color: "#fff",
  },
});

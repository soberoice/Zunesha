import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "expo-router";
import DropDownPicker from "react-native-dropdown-picker";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Icon from "react-native-vector-icons/MaterialIcons";

// Helper function to split array into chunks of 40
const splitIntoChunks = (array) => {
  const result = [];
  for (let i = 0; i < array.length; i += 100) {
    result.push(array.slice(i, i + 100));
  }
  return result;
};

const EpisodeList = ({ ep, image }) => {
  const navigation = useNavigation();
  const chunks = splitIntoChunks(ep);
  const [epList, setEpList] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [open, setOpen] = useState(false);
  const searchIcon = <Icon name="search" size={20} color={"#32a88b"} />;
  const page = <Icon name="list" size={20} color={"#32a88b"} />;
  const dropdownItems = chunks.map((chunk, index) => ({
    label: `${chunk[0]?.number}-${chunk[chunk?.length - 1]?.number}`,
    value: index + 1,
  }));

  function search() {
    const filteredEp = ep.filter(
      (episode) => episode.number.toString() === searchInput
    );

    if (!filteredEp[0]) return null;

    return (
      <TouchableOpacity
        style={styles.btn}
        key={filteredEp[0].id}
        onPress={() =>
          navigation.navigate("watchepisode", {
            id: filteredEp[0]?.id,
            ep: ep,
            title: filteredEp[0].title,
            number: filteredEp[0].number,
            cover: image,
          })
        }
      >
        <Text style={{ color: "#fff" }}>{filteredEp[0]?.number}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={{ width: "100%" }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "#fff",
          paddingLeft: 10,
        }}
      >
        List Of Episodes
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginVertical: 15,
          width: "100%",
          alignItems: "center",
        }}
      >
        <View
          style={{
            width: "35%",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {page}
          <DropDownPicker
            open={open}
            value={epList}
            items={dropdownItems}
            setOpen={setOpen}
            setValue={setEpList}
            setItems={() => {}}
            style={{
              backgroundColor: "#000",
              borderColor: "transparent",
              width: "80%",
            }}
            textStyle={{
              color: "#32a88b",
            }}
            dropDownContainerStyle={{
              backgroundColor: "#001",
              borderColor: "transparent",
              width: "80%",
            }}
            listItemLabelStyle={{
              color: "#32a88b",
            }}
            arrowIconStyle={{
              tintColor: "#32a88b",
            }}
            selectedItemContainerStyle={{
              color: "#32a88b",
            }}
          />
        </View>
        <View
          style={{
            width: "50%",
            flexDirection: "row",
            borderWidth: 1,
            alignItems: "center",
            borderRadius: 5,
            gap: 2,
          }}
        >
          <Text>{searchIcon}</Text>
          <TextInput
            placeholderTextColor={"#32a88b"}
            onChangeText={(text) => setSearchInput(text)}
            placeholder={`Search Episode`}
            style={styles.searchBar}
          />
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.container, { paddingBottom: "100%" }]}
      >
        {searchInput
          ? search()
          : chunks[epList - 1]?.map((item) => (
              <TouchableOpacity
                style={styles.btn}
                key={item?.id}
                onPress={() =>
                  navigation.navigate("watchepisode", {
                    id: item.id,
                    ep: ep,
                    title: item.title,
                    number: item.number,
                    cover: image,
                  })
                }
              >
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
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    zIndex: 0,
  },
  btn: {
    backgroundColor: "#32a88b",
    padding: 10,
    borderRadius: 5,
    width: 55,
    alignItems: "center",
  },
  searchBar: {
    width: "70%",
    height: 50,
  },
  scrollView: {
    marginBottom: 150,
    zIndex: 0,
  },
});

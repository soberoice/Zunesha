import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { useNavigation } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import Pagination from "../components/Pagination";
import HorizontalAnimeList from "../components/HorizontalAnimeList";

const Searchscreen = () => {
  const [searchInput, setSearchInput] = useState();
  const [searchResults, setSearchResults] = useState();
  const [totalPages, setTotalPages] = useState();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const navigation = useNavigation();
  const fetchData = async () => {
    try {
      setLoading(true);
      setSearchResults([]);
      setPage(1);
      setLoading(true);
      const apiUrl = process.env.EXPO_PUBLIC_API_URL;
      const respons = await fetch(
        `${apiUrl}/anime/zoro/${searchInput}?page=${page}`
      );
      const data = await respons.json();
      setSearchResults(data);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [page]);

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              style={{ padding: 10 }}
              name="keyboard-backspace"
              color={"white"}
              size={30}
            />
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "80%",
              backgroundColor: "#000",
              borderRadius: 50,
              paddingHorizontal: 15,
              boxShadow: "0px 5px 20px black",
            }}
          >
            <TextInput
              onChangeText={(text) => setSearchInput(text)}
              placeholder="Search Anime"
              placeholderTextColor={"#32a88b"}
              style={styles.searchBar}
              onSubmitEditing={() => fetchData()}
            />
            <Icon name="search" color={"#32a88b"} size={30} />
          </View>
        </View>
        {!loading ? (
          searchResults && (
            <ScrollView>
              <HorizontalAnimeList data={searchResults.results} />
              <Pagination
                totalPages={totalPages}
                setPage={setPage}
                page={page}
                hasNextPage={searchResults?.hasNextPage}
              />

              <View style={{ height: 90 }}></View>
            </ScrollView>
          )
        ) : (
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
            }}
          >
            <ActivityIndicator size={50} color={"#33a88b"} />

            <View style={{ height: 80 }}></View>
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default Searchscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1f1f1f",
    paddingTop: 20,
  },
  searchBar: {
    width: "80%",
    borderRadius: 50,
    color: "#32a88b",
    height: 50,
    marginHorizontal: "auto",
  },
});

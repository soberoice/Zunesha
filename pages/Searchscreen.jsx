import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import {
  GestureHandlerRootView,
  NativeViewGestureHandler,
  ScrollView,
} from "react-native-gesture-handler";
import HorizontalAnimeList from "../components/HorizontalAnimeList";
import AnimeList from "../components/AnimeList";

const Searchscreen = () => {
  const [searchInput, setSearchInput] = useState();
  const [searchResults, setSearchResults] = useState();
  const [placeholder, setPlaceholder] = useState();
  const [loading, setLoading] = useState(false);
  const fetchData = async () => {
    setLoading(true);
    setSearchResults([]);
    try {
      setLoading(true);
      const respons = await fetch(
        `https://consapi-chi.vercel.app/anime/zoro/${searchInput}`
      );
      const data = await respons.json();
      setSearchResults(data.results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!searchInput) {
      const fetchPlaceholder = async () => {
        setPlaceholder([]);
        try {
          setLoading(true);
          const respons = await fetch(
            `https://consapi-chi.vercel.app/anime/zoro//most-favorite`
          );
          const data = await respons.json();
          setPlaceholder(data.results);
        } catch (error) {
          console.error(error);
        }
      };
      fetchPlaceholder();
    }
  }, []);

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <TextInput
          onChangeText={(text) => setSearchInput(text)}
          placeholder="Search Anime"
          placeholderTextColor={"#32a88b"}
          style={styles.searchBar}
          onSubmitEditing={() => fetchData()}
        />
        {!searchInput && (
          <ScrollView>
            <AnimeList data={placeholder} />
          </ScrollView>
        )}
        {!loading ? (
          searchResults && (
            <ScrollView>
              <HorizontalAnimeList data={searchResults} />
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
    backgroundColor: "#001",
    paddingVertical: 20,
  },
  searchBar: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#32a88b",
    borderRadius: 5,
    color: "#fff",
    height: 50,
    paddingHorizontal: 10,
    marginHorizontal: "auto",
  },
});

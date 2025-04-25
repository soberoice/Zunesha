import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Slidinglist from "../components/Slidinglist";
import Homebanner from "../components/Homebanner";

const Homepage = () => {
  const [topAiring, setTopAiring] = useState();
  const [newEpisodes, setNewEpisodes] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const topResponse = await fetch(
          "https://consapi-chi.vercel.app/anime/zoro/top-airing"
        );
        const newResponse = await fetch(
          "https://consapi-chi.vercel.app/anime/zoro/recent-episodes"
        );
        const newData = await newResponse.json();
        const topData = await topResponse.json();
        setTopAiring(topData.results);
        setNewEpisodes(newData.results);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);
  return (
    <SafeAreaView style={{ backgroundColor: "#000", flex: 1 }}>
      <ScrollView>
        <Homebanner />
        {topAiring && (
          <View
            style={{
              flexDirection: "column",
              paddingVertical: 10,
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  paddingLeft: 10,
                  color: "#fff",
                  fontSize: 20,
                  fontWeight: "700",
                }}
              >
                Top Airing
              </Text>
              <Text
                style={{
                  paddingRight: 10,
                  color: "#32a88b",
                  fontSize: 15,
                  fontWeight: "700",
                }}
              >
                See more
              </Text>
            </View>
            <Slidinglist data={topAiring} limit={10} />
          </View>
        )}
        <View
          style={{
            flexDirection: "column",
            paddingVertical: 10,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                paddingLeft: 10,
                color: "#fff",
                fontSize: 20,
                fontWeight: "700",
              }}
            >
              New Episodes
            </Text>
            <Text
              style={{
                paddingRight: 10,
                color: "#32a88b",
                fontSize: 15,
                fontWeight: "700",
              }}
            >
              See more
            </Text>
          </View>
          <Slidinglist data={newEpisodes} limit={10} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Homepage;

const styles = StyleSheet.create({});

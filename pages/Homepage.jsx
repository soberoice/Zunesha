import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Slidinglist from "../components/Slidinglist";
import Homebanner from "../components/Homebanner";

const Homepage = () => {
  const [topAiring, setTopAiring] = useState();
  const [newEpisodes, setNewEpisodes] = useState();
  const [popular, setPopular] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const topResponse = await fetch(
          "https://consapi-chi.vercel.app/anime/zoro/top-airing"
        );
        const newResponse = await fetch(
          "https://consapi-chi.vercel.app/anime/zoro/recent-episodes"
        );
        const popularRes = await fetch(
          "https://consapi-chi.vercel.app/anime/zoro/most-popular"
        );
        const newData = await newResponse.json();
        const topData = await topResponse.json();
        const popularData = await popularRes.json();
        setPopular(popularData.results);
        setTopAiring(topData.results);
        setNewEpisodes(newData.results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={"#32a88b"} size={50} />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Homebanner />
        {topAiring && (
          <View>
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
                  Most popular
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
              <Slidinglist data={popular} limit={10} />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Homepage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001",
    justifyContent: "center",
    alignItems: "center",
  },
});

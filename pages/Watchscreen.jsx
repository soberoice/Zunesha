import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
const AnimeList = React.lazy(()=> import("../components/AnimeList"));


const Watchscreen = () => {
  const [active, setActive] = useState("TV");
  const tags = ["TV", "Movies", "Specials", "ONA", "OVA"];
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setData({});
        setLoading(true);
        const response = await fetch(
          `https://consapi-chi.vercel.app/anime/zoro/${active.toLowerCase()}`
        );
        const res = await response.json();
        setData(res.results);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [active]);
  return (
    <View style={styles.container}>
      <View style={styles.tagContainer}>
        {tags.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={styles.btn}
            onPress={() => setActive(tag)}
          >
            <Text
              style={{
                color: active === tag ? "#32a88b" : "#fff",
                fontWeight: "bold",
              }}
            >
              {tag}
              {console.log(tag)}
            </Text>
            {active === tag && (
              <Text style={{ color: "#32a88b", fontWeight: "bold" }}>__</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
      {loading ? (
        <ActivityIndicator color={"#32a88b"} size={50} />
      ) : (
        <ScrollView>
          <AnimeList data={data} />
        </ScrollView>
      )}
    </View>
  );
};

export default Watchscreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001",
    color: "#fff",
  },
  text: {
    color: "#32a88b",
    fontWeight: "bold",
  },
  btn: {
    width: 65,
    alignItems: "center",
  },
  tagContainer: {
    flexDirection: "row",
    gap: 4,
    marginVertical: 25,
    marginHorizontal: "auto",
  },
});

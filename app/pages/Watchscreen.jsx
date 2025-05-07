import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import AnimeList from "../components/AnimeList";

const Watchscreen = () => {
  const [active, setActive] = useState("TV");
  const tags = ["TV", "Movies", "Specials", "ONA", "OVA"];
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState();
  const [hasNextPage, setHasNextPage] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        setData({});
        setLoading(true);
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        const response = await fetch(
          `${apiUrl}/anime/zoro/${active.toLowerCase()}?page=${page}`
        );
        const res = await response.json();
        setData(res.results);
        setTotalPages(res.totalPages);
        setHasNextPage(res.hasNextPage);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [active, page]);
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
          <Pagination
            page={page}
            totalPages={totalPages}
            setPage={setPage}
            hasNextPage={hasNextPage}
          />
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
    alignItems: "center",
  },
  tagContainer: {
    flexDirection: "row",
    gap: 25,
    marginTop: 25,
    marginHorizontal: "auto",
    marginBottom: 10,
  },
});

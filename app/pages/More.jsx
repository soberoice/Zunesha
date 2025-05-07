import {
  ActivityIndicator,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import AnimeList from "../components/AnimeList";
import {
  GestureHandlerRootView,
  NativeViewGestureHandler,
  ScrollView,
} from "react-native-gesture-handler";
import Pagination from "../components/Pagination";
import { useNavigation } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";

const More = ({ route }) => {
  const { type, value, Name } = route.params;
  const [data, setData] = useState();
  const [loading, setLoading] = useState();
  const [totalPages, setTotalPages] = useState();
  const [hasNextPage, setHasNextPage] = useState();
  const [page, setPage] = useState(1);
  const navigation = useNavigation();
  const [message, setMessage] = useState();
  useEffect(() => {
    const fetchData = async () => {
      console.log("More Genre Value: ", value);
      try {
        setData();
        setLoading(true);
        const apiUrl = process.env.EXPO_PUBLIC_API_URL;
        const respons = await fetch(
          type === `genre`
            ? `${apiUrl}/anime/zoro/genre/${value}?page=${page}`
            : `${apiUrl}/anime/zoro/${value}?page=${page}`
        );
        const res = await respons.json();
        setData(res.results);
        setTotalPages(res.totalPages);
        setHasNextPage(res.hasNextPage);
        console.log("genre List: ", res);
      } catch (err) {
        console.log("fetch more error: ", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [value, page]);
  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              style={{ padding: 10 }}
              name="keyboard-backspace"
              color={"white"}
              size={30}
            />
          </TouchableOpacity>
          <Text style={styles.header}>{Name}</Text>
        </View>
        {data ? (
          <ScrollView>
            <AnimeList data={data} />
            <Pagination
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              page={page}
              setPage={setPage}
            />
          </ScrollView>
        ) : (
          <ActivityIndicator size={50} color={"#32a88b"} />
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default More;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#001",
    paddingBottom: 25,
  },
  header: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 20,
  },
});

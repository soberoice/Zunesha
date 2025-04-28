import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Homepage from "../pages/Homepage";
import Searchscreen from "../pages/Searchscreen";
import WatchList from "../pages/WatchList";
import Icon from "react-native-vector-icons/FontAwesome";
import { StyleSheet, View } from "react-native";
import Watchscreen from "../pages/Watchscreen";
import AnimeDetails from "../pages/AnimeDetails";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native"; // ✅ Import here
import WatchEpisode from "../pages/WatchEpisode";
import { WatchListProvider } from "../components/Provider/WhatchlistProvider";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#32a88b",
        tabBarStyle: {
          backgroundColor: "#000",
          borderColor: "#000",
          height: 70,
        },
        headerShown: false,
        tabBarLabelStyle: {
          fontSize: 12,
          paddingBottom: 5,
          fontWeight: "700",
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Search") iconName = "search";
          else if (route.name === "WatchList") iconName = "bookmark";
          else if (route.name === "watch") iconName = "tv";

          return <Icon name={iconName} size={20} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={Homepage} />
      <Tab.Screen name="Search" component={Searchscreen} />
      <Tab.Screen name="WatchList" component={WatchList} />
      <Tab.Screen name="watch" component={Watchscreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <WatchListProvider>
      <Stack.Navigator styles={styles.container}>
        <Stack.Screen
          name="Tabs"
          component={Tabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Details"
          options={{ headerShown: false }}
          component={AnimeDetails}
        />
        <Stack.Screen
          name="watchepisode"
          options={{ headerShown: false }}
          component={WatchEpisode}
        />
      </Stack.Navigator>
    </WatchListProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
});

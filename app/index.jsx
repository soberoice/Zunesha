import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import { StyleSheet, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { WatchListProvider } from "./components/Provider/WhatchlistProvider";
import WatchEpisode from "./pages/WatchEpisode";
import AnimeDetails from "./pages/AnimeDetails";
import Homepage from "./pages/Homepage";
import Searchscreen from "./pages/Searchscreen";
import WatchList from "./pages/WatchList";
import Watchscreen from "./pages/Watchscreen";
import More from "./pages/More";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: "#000",
          borderColor: "#000",
          height: 60,
          marginHorizontal: 20,
          marginBottom: 20,
          borderRadius: 25,
          position: "absolute",
          boxShadow: "0px 5px 20px black",
        },
        headerShown: false,
        tabBarIconStyle: {
          margin: "auto",
        },
        tabBarLabelStyle: {
          display: "none",
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconColor = focused ? "#fff" : "#32a88b";
          let iconBackground = focused ? "#32a88b" : "transparent";

          if (route.name === "Home") iconName = "home";
          else if (route.name === "Search") iconName = "search";
          else if (route.name === "WatchList") iconName = "bookmark";
          else if (route.name === "watch") iconName = "tv";

          return (
            <View
              style={{
                backgroundColor: iconBackground,
                width: 50,
                borderRadius: 50,
                height: 35,
              }}
            >
              <Icon
                style={{ margin: "auto" }}
                name={iconName}
                size={20}
                color={iconColor}
              />
            </View>
          );
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
      <View style={styles.container}>
        <Stack.Navigator>
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
          <Stack.Screen
            name="more"
            options={{ headerShown: false }}
            component={More}
          />
        </Stack.Navigator>
      </View>
    </WatchListProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    backgroundColor: "#1a1a1a",
  },
});

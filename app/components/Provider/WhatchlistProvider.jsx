import { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WatchListContext = createContext();

export const useList = () => useContext(WatchListContext);

export const WatchListProvider = ({ children }) => {
  const [watchListArray, setWatchListArray] = useState([]);

  // Load watch list from storage when app starts
  useEffect(() => {
    const loadWatchList = async () => {
      try {
        const storedList = await AsyncStorage.getItem("@watchlist");
        console.log("Stored Watch List: ", storedList);
        if (storedList !== null) {
          setWatchListArray(JSON.parse(storedList));
        }
      } catch (e) {
        console.error("Failed to load watchlist", e);
      }
    };
    loadWatchList();
  }, []);

  // Save watch list to storage whenever it changes
  useEffect(() => {
    const saveWatchList = async () => {
      try {
        const cleanedList = watchListArray.filter((item) => item && item.id);
        await AsyncStorage.setItem("@watchlist", JSON.stringify(cleanedList));
      } catch (e) {
        console.error("Failed to save watchlist", e);
      }
    };
    saveWatchList();
  }, [watchListArray]);

  const addToList = (item) => {
    if (!item || typeof item !== "object" || !item.id) {
      console.warn("Attempted to add invalid item to watch list:", item);
      return;
    }
    setWatchListArray((prev) => [...prev, item]);
  };

  const removeFromList = (item) => {
    setWatchListArray(watchListArray.filter((i) => i?.id !== item?.id));
  };

  function addToWatchList(item) {
    console.log("anime :", item);
    console.log(watchListArray);
    const exists = inWatchList(item?.id);
    if (exists) {
      removeFromList(item);
    } else {
      addToList(item);
    }
  }

  function inWatchList(itemId) {
    const exists = watchListArray.some((i) => i?.id === itemId);
    return exists;
  }

  return (
    <WatchListContext.Provider
      value={{
        watchListArray,
        setWatchListArray,
        addToWatchList,
        inWatchList,
      }}
    >
      {children}
    </WatchListContext.Provider>
  );
};

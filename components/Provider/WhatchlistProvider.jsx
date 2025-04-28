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
        await AsyncStorage.setItem(
          "@watchlist",
          JSON.stringify(watchListArray)
        );
      } catch (e) {
        console.error("Failed to save watchlist", e);
      }
    };
    saveWatchList();
  }, [watchListArray]);

  const addToList = (item) => {
    setWatchListArray([...watchListArray, item]);
  };

  const removeFromList = (item) => {
    setWatchListArray(watchListArray.filter((i) => i.id !== item.id));
  };
  function addToWatchList(item) {
    const exists = watchListArray.some((i) => i.id === item.id);

    if (exists) {
      removeFromList(item);
    } else {
      addToList(item);
    }
  }
  function inWatchList(item) {
    const exists = watchListArray.some((i) => i?.id === item);
    if (item) {
      return exists;
    }
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

import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, Text, Share } from "react-native";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  getDoc,
  doc,
  addDoc,
  collection,
  updateDoc,
  where,
  query,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { FIRESTORE_DB, FIREBASE_AUTH } from "@/firebase-config";
interface MediaActionsProps {
  shareLink: string | undefined;
  mediaId: string;
  mediaType: string;
}
const MediaActions: React.FC<MediaActionsProps> = ({
  shareLink,
  mediaId,
  mediaType,
}) => {
  const [isWatchlist, setIsWatchlist] = useState(false);
  const auth = FIREBASE_AUTH;
  const userId = auth.currentUser?.uid;
  const watchlistRef = collection(FIRESTORE_DB, "WatchList");

  useEffect(() => {
    const checkWatchlist = async () => {
      try {
        const watchlistQuery = query(
          watchlistRef,
          where("userId", "==", userId),
          where("mediaId", "==", mediaId),
          where("mediaType", "==", mediaType)
        );

        const querySnapshot = await getDocs(watchlistQuery);
        setIsWatchlist(!querySnapshot.empty);
      } catch (error) {
        console.error("Error checking watchlist:", error);
      }
    };

    checkWatchlist();
  }, [userId, mediaId, mediaType, setIsWatchlist, watchlistRef]);

  const handleWatchlist = async () => {
    try {
      const tempIsWatchlist = isWatchlist;
      setIsWatchlist(tempIsWatchlist);
      const userRef = userId ? doc(FIRESTORE_DB, "Users", userId) : null;
      if (!userRef) return;
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) return;
      const watchlistArray = userDoc.data().watchlist ?? [];
      const watchlistQuery = query(
        watchlistRef,
        where("userId", "==", userId),
        where("mediaId", "==", mediaId),
        where("mediaType", "==", mediaType)
      );
      const querySnapshot = await getDocs(watchlistQuery);
      if (tempIsWatchlist) {
        if (!querySnapshot.empty) {
          const docRef = querySnapshot.docs[0].ref;
          await deleteDoc(docRef);
        }
        const updatedWatchlist = watchlistArray.filter(
          (item: string) => item !== querySnapshot.docs[0].id
        );
        await updateDoc(userRef, {
          watchlist: updatedWatchlist,
        });
      } else if (querySnapshot.empty) {
        const watchlistDocRef = await addDoc(watchlistRef, {
          mediaId,
          mediaType,
          userId,
        });
        const updatedWatchlist = [...watchlistArray, watchlistDocRef.id];
        await updateDoc(userRef, { watchlist: updatedWatchlist });
      }

      setIsWatchlist(!isWatchlist);
    } catch (error) {
      console.error(
        `Error ${isWatchlist ? "removing from" : "adding to"} watchlist:`,
        error
      );
      setIsWatchlist(!isWatchlist);
    }
  };

  return (
    <View className="flex-row mx-4 mt-1">
      <TouchableOpacity
        className="flex-col items-center py-2 mx-3 rounded-full"
        onPress={handleWatchlist}
      >
        <AntDesign
          name={isWatchlist ? "check" : "plus"}
          size={24}
          color="white"
        />
        <Text className="text-neutral-400 text-xs">
          {isWatchlist ? "Added" : "Watchlist"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="flex-col items-center py-1 mx-6 rounded-full"
        onPress={() =>
          Share.share({
            message: `${shareLink}`,
          })
        }
      >
        <MaterialCommunityIcons name="share-outline" size={28} color="white" />
        <Text className="text-neutral-400 text-xs">Share</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MediaActions;

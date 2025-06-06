import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Platform,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { VideoSection, VideoTrailer, MediaGrid } from "@/src/components";
import { router, useLocalSearchParams } from "expo-router";
import {
  fetchRecommendedTVorMovies,
  fetchSimilarTVorMovies,
  fetchTVorMovieVideosByID,
} from "@/api/media";
import { VideoDataItem } from "@/assets/types";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const ios = Platform.OS === "ios";

export default function Index() {
  const { mediaId, videoKey } = useLocalSearchParams<{
    mediaId: string;
    videoKey: string;
  }>();
  const mediaType = "movie";
  const [videosData, setVideosData] = useState<VideoDataItem[]>([]);
  const [currentVideo, setCurrentVideo] = useState<VideoDataItem>();
  const [recommendedMovies, setRecommendedMovies] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);

  useEffect(() => {
    getVideosData(mediaId);
    getRecommendedMovies(mediaId);
    getSimilarMovies(mediaId);
  }, [mediaId, videoKey]);

  const getVideosData = async (id: string) => {
    const data = await fetchTVorMovieVideosByID(mediaType, id);
    if (data && data.results) {
      setVideosData(data.results);
      const foundVideo = data.results.find(
        (video: { key: string }) => video.key === videoKey
      );
      setCurrentVideo(foundVideo);
    }
  };

  const getRecommendedMovies = async (id: string) => {
    const data = await fetchRecommendedTVorMovies(mediaType, id);
    if (data && data.results) {
      setRecommendedMovies(data.results);
    }
  };

  const getSimilarMovies = async (id: string) => {
    const data = await fetchSimilarTVorMovies("movie", id);
    if (data && data.results) {
      setSimilarMovies(data.results);
    }
  };

  return (
    <LinearGradient colors={["#000", "#011", "#121"]} className="flex-1">
      <StatusBar backgroundColor="#000" />
      <SafeAreaView className={ios ? "-mb-2" : "mb-3"}>
        <SafeAreaView className="absolute z-20 w-full flex-row left-2 top-6">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <MaterialIcons name="keyboard-backspace" size={28} color="white" />
          </TouchableOpacity>
        </SafeAreaView>
        <View className="mt-7">
          <VideoTrailer
            videoId={videoKey}
            thumbnailUrl={`https://img.youtube.com/vi/${videoKey}/mqdefault.jpg`}
            playerHeight={230}
            controlsEnabled={true}
            isOverlay={false}
            isMuted={false}
          />
        </View>
        {currentVideo && (
          <Text className="text-white text-base font-semibold mx-3">
            {currentVideo.name}
          </Text>
        )}
      </SafeAreaView>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        {videosData.length > 1 && (
          <VideoSection
            videosData={videosData}
            mediaId={mediaId}
            mediaType={mediaType}
          />
        )}
        {similarMovies.length > 0 && (
          <MediaGrid
            title={"More Like This"}
            data={similarMovies.slice(0, 6)}
          />
        )}
        {recommendedMovies.length > 0 && (
          <MediaGrid
            title={"Recommended"}
            data={recommendedMovies.slice(0, 6)}
          />
        )}
      </ScrollView>
    </LinearGradient>
  );
}

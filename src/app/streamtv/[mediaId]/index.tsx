import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  Cast,
  EpisodeSection,
  Loading,
  MediaActions,
  MediaList,
  VideoSection,
  VideoTrailer,
} from "@/src/components";
import {
  fetchTVorMovieCreditsByID,
  fetchTVorMovieDetailsByID,
  fetchRecommendedTVorMovies,
  fetchSimilarTVorMovies,
  fetchTVorMovieVideosByID,
  fetchTvContentRatingByID,
  baseUrl,
  fetchTvEpisodeDetails,
} from "@/api/media";
import { MediaData, VideoDataItem } from "@/assets/types";
import { LinearGradient } from "expo-linear-gradient";

export default function ShowsScreen() {
  const { mediaId } = useLocalSearchParams<{ mediaId: string }>();
  const [show, setShow] = useState<MediaData>();
  const [cast, setCast] = useState([]);
  const [recommendedShows, setRecommendedShows] = useState([]);
  const [similarShows, setSimilarShows] = useState([]);
  const [videosData, setVideosData] = useState<VideoDataItem[]>([]);
  const [contentRating, setContentRating] = useState<string>("");
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [episodesData, setEpisodesData] = useState();
  const [loading, setLoading] = useState(false);
  const isComingSoon = new Date(show?.first_air_date ?? "") > new Date();
  const scrollViewRef = useRef<ScrollView | null>(null);

  useEffect(() => {
    setLoading(true);
    getShowDetails(mediaId);
    getShowCredits(mediaId);
    getContentRating(mediaId);
    getRecommendedShows(mediaId);
    getSimilarShows(mediaId);
    getVideosData(mediaId);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
    setSelectedSeason(1);
  }, [mediaId]);

  useEffect(() => {
    getEpisodesDetail(mediaId, selectedSeason.toString());
  }, [mediaId, selectedSeason]);

  const getShowDetails = async (id: string) => {
    const data = await fetchTVorMovieDetailsByID("tv", id);
    setLoading(false);
    if (data) {
      setShow({ ...show, ...data });
    }
  };

  const getShowCredits = async (id: string) => {
    const data = await fetchTVorMovieCreditsByID("tv", id);
    if (data && data.cast) {
      setCast(data.cast);
    }
  };

  const getVideosData = async (id: string) => {
    const data = await fetchTVorMovieVideosByID("tv", id);
    if (data && data.results) {
      setVideosData(data.results);
    }
  };

  const getRecommendedShows = async (id: string) => {
    const data = await fetchRecommendedTVorMovies("tv", id);
    if (data && data.results) {
      setRecommendedShows(data.results);
    }
  };

  const getSimilarShows = async (id: string) => {
    const data = await fetchSimilarTVorMovies("tv", id);
    if (data && data.results) {
      setSimilarShows(data.results);
    }
  };

  const getContentRating = async (id: string) => {
    const data = await fetchTvContentRatingByID(id);
    if (data && data.results) {
      const rating =
        data.results.find((date: { iso_3166_1: string; rating: string }) =>
          ["IN", "US"].some(
            (country) => date.iso_3166_1 === country && date.rating !== ""
          )
        ) ||
        data.results.find((date: { rating: string }) => date.rating !== "");

      setContentRating(rating?.rating);
    }
  };

  const getEpisodesDetail = async (id: string, season_number: string) => {
    const data = await fetchTvEpisodeDetails(id, season_number);
    if (data) {
      setEpisodesData(data);
    }
  };

  return (
    <LinearGradient colors={["#000", "#011", "#121"]} className="flex-1">
      <StatusBar backgroundColor="black" />
      <SafeAreaView className="absolute z-20 w-full flex-row px-5">
        <TouchableOpacity onPress={() => router.push("/")}>
          <MaterialIcons name="keyboard-backspace" size={26} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ paddingBottom: 20 }}
        className="flex-1"
      >
        <View className="w-full">
          {loading ? (
            <Loading />
          ) : (
            <VideoTrailer
              videoId={
                videosData.find((video) => video.type === "Trailer")?.key
              }
              thumbnailUrl={`${baseUrl}${
                show?.backdrop_path || show?.poster_path
              }`}
              playerHeight={210}
              outerViewClasses="mt-8 mx-2.5 overflow-hidden rounded-xl"
              controlsEnabled={false}
              isOverlay={true}
              isMuted={true}
            />
          )}
        </View>

        <View className="space-y-3">
          <View className="mt-4">
            <Text className="text-white text-center text-5xl font-extralight tracking-widest">
              {show?.name}
            </Text>
            <Text className="text-neutral-200 text-center italic font-extralight">
              {show?.tagline}
            </Text>
          </View>
          {show?.id ? (
            <View>
              <View className="flex-row items-center justify-center space-x-1">
                <Text className="text-neutral-300 font-medium text-sm">
                  {show?.first_air_date?.split("-")[0]} •
                </Text>
                <Text className="text-neutral-300 font-medium text-sm">
                  {`${show?.number_of_seasons} Seasons`} •
                </Text>
                <Text className="text-neutral-100 bg-neutral-700 px-1.5 rounded-sm font-medium text-xs">
                  {contentRating}
                </Text>
              </View>
              <View className="w-full my-4">
                {!isComingSoon ? (
                  <Button
                    onClick={() =>
                      router.push(`/streamtv/${mediaId}/1/1/watch`)
                    }
                    label="Watch First Episode"
                    icon={
                      <Ionicons name="play-sharp" size={20} color="black" />
                    }
                  />
                ) : (
                  <Button
                    label="Coming Soon"
                    disabled={true}
                    icon={
                      <MaterialCommunityIcons
                        name="timer-sand"
                        size={20}
                        color="black"
                      />
                    }
                  />
                )}
              </View>
              <View className="flex-row items-center justify-center pb-3">
                {show?.genres.map((genre, index) => (
                  <View
                    key={genre.name}
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <Text className="text-indigo-600">{genre.name}</Text>
                    {index < show.genres.length - 1 && (
                      <Text className="text-indigo-400 mx-1">|</Text>
                    )}
                  </View>
                ))}
              </View>
              <Text className="text-neutral-400 mx-4 tracking-wide text-justify">
                {show?.overview}
              </Text>
              <MediaActions
                shareLink={`https://muvotv.vercel.app/shows/${mediaId}`}
                mediaId={mediaId}
                mediaType="tv"
              />
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="border-b border-zinc-800 my-2"
              >
                {show?.seasons
                  ?.filter((season: any) => season.name !== "Specials")
                  .map((season: any) => (
                    <TouchableOpacity
                      key={season.season_number}
                      onPress={() => setSelectedSeason(season.season_number)}
                      className={`mx-3 ${
                        selectedSeason === season.season_number
                          ? "border-b-[1px] border-[#8DC53E]"
                          : ""
                      }`}
                    >
                      <Text
                        className={`${
                          selectedSeason === season.season_number
                            ? "text-white"
                            : "text-neutral-500"
                        } pb-2`}
                      >
                        {season.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
              <EpisodeSection episodesData={episodesData} mediaId={mediaId} />
            </View>
          ) : null}
        </View>
        {show?.id && cast.length > 0 && <Cast cast={cast} />}
        {show?.id && recommendedShows.length > 0 && (
          <MediaList
            title={"Recommended Tv Shows"}
            data={recommendedShows}
            hideSeeAll={true}
            mediaType="tv"
          />
        )}

        {show?.id && similarShows.length > 0 && (
          <MediaList
            title={"Similar Tv Shows"}
            data={similarShows}
            hideSeeAll={true}
            mediaType="tv"
          />
        )}

        {show?.id && videosData.length > 0 && (
          <VideoSection
            videosData={videosData}
            title="Trailers & more"
            mediaId={mediaId}
            mediaType="tv"
          />
        )}
      </ScrollView>
    </LinearGradient>
  );
}

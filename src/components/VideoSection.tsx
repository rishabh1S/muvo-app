import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { VideoDataItem } from "@/assets/types";
import MarqueeView from "react-native-marquee-view";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
interface VideoSectionProps {
  videosData: VideoDataItem[];
  title?: string;
  mediaId: string;
  mediaType: string;
}

const VideoSection: React.FC<VideoSectionProps> = ({
  videosData,
  title,
  mediaId,
  mediaType,
}) => {
  const renderVideoItem = ({ item }: { item: VideoDataItem }) => (
    <TouchableOpacity
      onPress={() => {
        const route =
          mediaType === "tv"
            ? `/streamtv/${mediaId}/${item.key}`
            : `/streammovie/${mediaId}/${item.key}`;
        router.navigate(route as any);
      }}
      className="mr-3"
    >
      <Image
        source={{
          uri: `https://img.youtube.com/vi/${item.key}/mqdefault.jpg`,
        }}
        className="w-44 h-24 rounded-xl"
      />
      {item.name.length > 24 ? (
        <MarqueeView style={{ width: 170 }}>
          <Text className="text-sm text-neutral-300 mt-1">{item.name}</Text>
        </MarqueeView>
      ) : (
        <Text className="text-sm text-neutral-300 mt-1">{item.name}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View className="mx-4 mb-3">
      <Text className="my-2 font-semibold text-xl text-white">{title}</Text>
      <FlashList
        data={videosData.slice(0, 5)}
        horizontal
        removeClippedSubviews={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderVideoItem}
        estimatedItemSize={180}
      />
    </View>
  );
};

export default React.memo(VideoSection);

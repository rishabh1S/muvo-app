import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { fallbackPersonImage, image342 } from "@/api/media";
import MarqueeView from "react-native-marquee-view";
import * as WebBrowser from "expo-web-browser";
import { FlashList } from "@shopify/flash-list";
interface CastProps {
  cast: {
    id: number;
    profile_path: string;
    name: string;
    character: string;
  }[];
}

const CastItem: React.FC<{ person: any }> = ({ person }) => (
  <TouchableOpacity
    className="mr-4 items-center"
    onPress={() =>
      WebBrowser.openBrowserAsync(
        `https://www.google.com/search?q=${person.name}`
      )
    }
  >
    <View className="overflow-hidden rounded-full h-20 w-20 items-center">
      <Image
        className="rounded-2xl h-24 w-20"
        source={{
          uri: image342(person?.profile_path) ?? fallbackPersonImage,
        }}
      />
    </View>
    {person?.original_name.length > 14 ? (
      <MarqueeView style={{ width: 80 }}>
        <Text className="text-sm text-white">{person?.original_name}</Text>
      </MarqueeView>
    ) : (
      <Text className="text-sm text-white">{person?.original_name}</Text>
    )}
    {person?.character.length > 14 ? (
      <MarqueeView style={{ width: 80 }}>
        <Text className="text-neutral-400 text-xs text-center">
          {person?.character}
        </Text>
      </MarqueeView>
    ) : (
      <Text className="text-neutral-400 text-xs text-center">
        {person?.character}
      </Text>
    )}
  </TouchableOpacity>
);

const Cast: React.FC<CastProps> = ({ cast }) => {
  return (
    <View className="my-6">
      <Text className="font-semibold text-white text-xl mx-4 mb-5">
        Top Cast
      </Text>
      <FlashList
        horizontal
        removeClippedSubviews
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        data={cast.slice(0, 10)}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={({ item, index }) => <CastItem key={index} person={item} />}
        estimatedItemSize={100}
      />
    </View>
  );
};

export default React.memo(Cast);

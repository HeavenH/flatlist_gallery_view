import React, { useEffect, useState, useRef } from "react";
import { ActivityIndicator } from "react-native";

import {
  StatusBar,
  FlatList,
  Image,
  Animated,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Easing,
  SafeAreaViewBase,
  SafeAreaView,
} from "react-native";
const { width, height } = Dimensions.get("screen");

const API_KEY = "563492ad6f91700001000001519510f08cd546c1828316897ab1f59c";
const API_URL =
  "https://api.pexels.com/v1/search?query=nature&orientation=portrait&size=small&per_page=20";

const IMAGE_SIZE = 80;
const SPACING = 10;

const fetchImagesFromPexels = async () => {
  const data = await fetch(API_URL, {
    headers: {
      Authorization: API_KEY,
    },
  });

  const { photos } = await data.json();

  return photos;
};

const Animation = () => {
  const [images, setImages] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      const images = await fetchImagesFromPexels();

      setImages(images);
    };

    fetchImages();
  }, []);

  const topRef = useRef();
  const thumbRef = useRef();

  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToActiveIndex = (index) => {
    setActiveIndex(index);
    topRef?.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    });
    if (index * (IMAGE_SIZE + SPACING) - IMAGE_SIZE / 2 > width / 2) {
      thumbRef?.current?.scrollToOffset({
        offset: index * (IMAGE_SIZE + SPACING) - width / 2 + IMAGE_SIZE / 2,
        animated: true,
      });
    } else {
      thumbRef?.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
    }
  };

  if (!images) {
    return <ActivityIndicator />;
  }

  const renderImages = ({ item }) => (
    <View style={{ width, height }}>
      <Image
        source={{ uri: item.src.portrait }}
        style={[StyleSheet.absoluteFillObject]}
      />
    </View>
  );

  const renderImagesBox = ({ item, index }) => (
    <TouchableOpacity onPress={() => scrollToActiveIndex(index)}>
      <Image
        source={{ uri: item.src.portrait }}
        style={{
          width: IMAGE_SIZE,
          height: IMAGE_SIZE,
          borderRadius: 12,
          marginRight: SPACING,
          borderWidth: 2,
          borderColor: activeIndex === index ? "#fff" : "transparent",
        }}
      />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <StatusBar hidden />
      <FlatList
        ref={topRef}
        data={images}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderImages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(ev) => {
          scrollToActiveIndex(
            Math.floor(ev.nativeEvent.contentOffset.x / width)
          );
        }}
      />
      <FlatList
        ref={thumbRef}
        data={images}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderImagesBox}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ position: "absolute", bottom: 40 }}
        contentContainerStyle={{ paddingHorizontal: SPACING }}
      />
    </View>
  );
};

export default Animation;

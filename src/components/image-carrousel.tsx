import React, { useRef, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  Platform,
  ViewProps,
  LayoutChangeEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ImageCarouselProps {
  images: string[];
  isEditable?: boolean;
  containeStyle?: ViewProps["style"];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, isEditable, containeStyle }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [carouselWidth, setCarouselWidth] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handlePreview = (base64: string) => {
    setSelectedImage(base64);
    setPreviewVisible(true);
  };

  const scrollToIndex = (index: number) => {
    if (index >= 0 && index < images.length && carouselWidth > 0) {
      scrollRef.current?.scrollTo({ x: index * carouselWidth, animated: true });
      setActiveIndex(index);
    }
  };

  const onScroll = (event: any) => {
    if (carouselWidth > 0) {
      const index = Math.round(event.nativeEvent.contentOffset.x / carouselWidth);
      setActiveIndex(index);
    }
  };

  const onLayout = (event: LayoutChangeEvent) => {
    setCarouselWidth(event.nativeEvent.layout.width);
  };

  return (
    <View
      style={[styles.container, containeStyle, { alignSelf: "stretch" }]}
      onLayout={onLayout}
    >
      {carouselWidth > 0 && activeIndex > 0 && (
        <TouchableOpacity
          style={[styles.arrowButton, { left: 5 }]}
          onPress={() => scrollToIndex(activeIndex - 1)}
        >
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      {carouselWidth > 0 && activeIndex < images.length - 1 && (
        <TouchableOpacity
          style={[styles.arrowButton, { right: 5 }]}
          onPress={() => scrollToIndex(activeIndex + 1)}
        >
          <Ionicons name="chevron-forward" size={28} color="#fff" />
        </TouchableOpacity>
      )}

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
      >
        {images.map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            onPress={() => handlePreview(item)}
            style={{ width: carouselWidth }}
          >
            <Image
              source={{ uri: `data:image/png;base64,${item}` }}
              style={[styles.image, { width: carouselWidth }]}
              resizeMode="cover"
            />
            {isEditable && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => console.log("Remover imagem")}
              >
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>
          Imagem {activeIndex + 1} de {images.length}
        </Text>
      </View>

      <Modal
        visible={previewVisible}
        transparent={Platform.OS !== "web"}
        animationType="fade"
        onRequestClose={() => setPreviewVisible(false)}
      >
        <Pressable style={styles.modalBackground} onPress={() => setPreviewVisible(false)}>
          <Image
            source={{ uri: `data:image/png;base64,${selectedImage}` }}
            style={styles.modalImage}
            resizeMode="contain"
          />
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 260,
    position: "relative",
    justifyContent: "center",
  },
  image: {
    height: 250,
    borderRadius: Platform.OS === 'web' ? 8 : 0,
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
    borderRadius: 15,
    zIndex: 1,
  },
  counterContainer: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  counterText: {
    color: "#fff",
    fontSize: 14,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImage: {
    width: "90%",
    height: "90%",
  },
  arrowButton: {
    position: "absolute",
    top: "50%",
    marginTop: -20,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 6,
    borderRadius: 20,
  },
});

export default ImageCarousel;

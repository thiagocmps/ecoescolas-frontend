import React from 'react';
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Button from './button/button';

type Props = {
  images: string[]; // Agora controlado pelo pai
  onImagesChange: (images: string[]) => void;
  maxImages: number;
  title: string;
};

export default function ImagePickerMultiple({ images, onImagesChange, maxImages, title }: Props) {
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);

  const pickImage = async () => {
    if (images.length >= maxImages) {
      Alert.alert("Limite atingido", `Você pode selecionar no máximo ${maxImages} imagens.`);
      return;
    }

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permissão necessária", "Você precisa permitir o acesso à galeria.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled && result.assets?.[0]?.base64) {
      const newImage = result.assets[0].base64;
      const updatedImages = [...images, newImage];
      onImagesChange(updatedImages);
    }
  };

  const removeImage = (index: number) => {
    Alert.alert(
      "Remover imagem",
      "Tem certeza que deseja remover esta imagem?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => {
            const updatedImages = images.filter((_, i) => i !== index);
            onImagesChange(updatedImages);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Button
        title={`${title} (${images.length}/${maxImages})`}
        onPress={pickImage}
        icon='image-outline'
        variant={"outlined"}
      />

      <ScrollView horizontal style={styles.imageContainer}>
        {images.map((base64, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setPreviewImage(base64)}
            onLongPress={() => removeImage(index)}
          >
            <Image source={{ uri: `data:image/png;base64,${base64}` }} style={styles.image} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Modal visible={!!previewImage} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <TouchableOpacity
            style={styles.modalCloseArea}
            onPress={() => setPreviewImage(null)}
          />
          <Image source={{ uri: `data:image/png;base64,${previewImage!}` }} style={styles.fullImage} />
          <Button title="Fechar" onPress={() => setPreviewImage(null)} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: 'center',
  },
  imageContainer: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
    borderRadius: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCloseArea: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  fullImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
    marginBottom: 20,
  },
});

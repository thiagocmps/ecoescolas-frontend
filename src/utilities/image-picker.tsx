import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";

export default function imagePicker() {
  const [newImageUri, setNewImageUri] = useState<string | null>(null);
    
    useEffect(() => {
      const fetchImage = async () => {
        const imageUri = await processImage();
        setNewImageUri(imageUri);
      };
      fetchImage();
    }, []);
  
    return newImageUri;
}

  async function processImage(): Promise<string | null> {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Você precisa permitir o acesso à galeria.");
      return null;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const base64Image = result.assets[0].base64;
      return imageUri;
    }
    return null;
  };
  {
  }
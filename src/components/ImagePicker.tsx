import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import Text from "./Text";
import { theme } from "../../config/theme";

interface ImagePickerFieldProps {
  imageUri: string | null;
  onPress: () => void;
  placeholder?: string;
}

const ImagePickerField: React.FC<ImagePickerFieldProps> = ({
  imageUri,
  onPress,
  placeholder = "Tap to add image",
}) => {
  return (
    <TouchableOpacity style={styles.imagePicker} onPress={onPress}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons
            name="camera"
            size={40}
            color={theme.colors.textSecondary}
          />
          <Text
            variant="body2"
            text={placeholder}
            color={theme.colors.textSecondary}
            style={styles.imageText}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ImagePickerField;

const styles = StyleSheet.create({
  imagePicker: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: theme.spacing.xxlg,
    backgroundColor: theme.colors.background,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderStyle: "dashed",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  imageText: {
    marginTop: theme.spacing.md,
  },
});
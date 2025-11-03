import {
  StyleSheet,
  View,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import Text from "../../../components/Text";
import Ionicons from "@expo/vector-icons/Ionicons";
import { theme } from "../../../../config/theme";
import ImagePickerField from "../../../components/ImagePicker";
import { Controller, useForm } from "react-hook-form";
import FormInput from "../../../components/FormInput";
import { z } from "zod";
import { useToastMessage } from "../../../hooks/useToastMessage";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProductStore } from "../../../hooks/useProduct";
import * as ImagePicker from "expo-image-picker";
import type { ProductType } from "../../../types";
import { CommonActions, useNavigation } from "@react-navigation/native";
const generateUniqueId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .transform((val) => parseFloat(val))
    .refine(
      (val) => !isNaN(val) && val >= 0,
      "Price must be a valid number >= 0"
    ),
});

type FormData = {
  name: string;
  description: string;
  price: string;
};
const AddNewProduct = () => {
  const navigation = useNavigation<any>();
  const [image, setImage] = useState<string | null>(null);
  const { showToast } = useToastMessage();
  const { addProduct } = useProductStore();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
    },
  });
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onSubmit = (data: FormData) => {
    if (!image) {
      showToast("Please select an image", "danger");
      return;
    }

    const newProduct: ProductType = {
      id: generateUniqueId(),
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      imageUrl: image,
    };
    // @ts-ignore
    addProduct(newProduct);
    reset();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Admin" }],
      })
    );

    showToast("Product added successfully!", "success");
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, padding: 20 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ImagePickerField
          imageUri={image}
          onPress={pickImage}
          placeholder="Tap to add image"
        />

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <FormInput
              label="Product Name"
              placeholder="Enter product name"
              value={value}
              onChangeText={onChange}
              error={errors.name?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <FormInput
              label="Description"
              placeholder="Enter product description"
              value={value}
              onChangeText={onChange}
              error={errors.description?.message}
              isTextArea
              multiline
              numberOfLines={4}
            />
          )}
        />

        <Controller
          control={control}
          name="price"
          render={({ field: { onChange, value } }) => (
            <FormInput
              label="Price"
              placeholder="Enter price"
              value={value}
              onChangeText={onChange}
              error={errors.price?.message}
              keyboardType="decimal-pad"
            />
          )}
        />

        <TouchableOpacity
          style={styles.submitButton}
          //   @ts-ignore
          onPress={handleSubmit(onSubmit)}
        >
          <Text
            variant="body1Bold"
            text="Add Product"
            color={theme.colors.white}
          />
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddNewProduct;

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: theme.colors.primary,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xxlg,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
    marginBottom: 30,
  },
});

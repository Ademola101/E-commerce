import { StyleSheet, TouchableOpacity, View, TextInput, Image, ScrollView, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import React, { useCallback, useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Text from "../../../components/Text";
import { theme } from "../../../../config/theme";
import { useToastMessage } from "../../../hooks/useToastMessage";
import { z } from "zod";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProductStore } from "../../../hooks/useProduct";
import type { ProductType } from "../../../types";
import { formatToMoney } from "../../../utils/formatToMoney";

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
    .refine((val) => !isNaN(val) && val >= 0, "Price must be a valid number >= 0"),
});

type FormData = {
  name: string;
  description: string;
  price: string;
};

const Admin = () => {
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [image, setImage] = useState<string | null>(null);
  const { showToast } = useToastMessage();
  const { products, addProduct, removeProduct } = useProductStore();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
    },
  });

  const handleOpenModal = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleCloseModal = useCallback(() => {
    bottomSheetRef.current?.dismiss();
    reset();
    setImage(null);
  }, [reset]);

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
      showToast("Please select an image", "error");
      return;
    }

    const newProduct: ProductType = {
      id: generateUniqueId(),
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      imageUrl: image,
    };

    addProduct(newProduct);
    showToast("Product added successfully!", "success");
    handleCloseModal();
  };

  const handleDeleteProduct = (id: string) => {
    removeProduct(id);
    showToast("Product deleted", "success");
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    []
  );

  const renderProduct = ({ item }: { item: ProductType }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text
          variant="h6Bold"
          text={item.name}
          color={theme.colors.textPrimary}
          lines={1}
        />
        <Text
          variant="body2"
          text={item.description}
          color={theme.colors.textSecondary}
          lines={2}
          style={styles.productDescription}
        />
        <Text
          variant="body1Bold"
          text={formatToMoney(item.price)}
          color={theme.colors.primary}
        />
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteProduct(item.id)}
      >
        <Ionicons name="trash-outline" size={20} color={theme.colors.accentPink} />
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="cube-outline" size={64} color={theme.colors.textTertiary} />
      <Text
        variant="h5"
        text="No Products Yet"
        color={theme.colors.textSecondary}
        style={styles.emptyText}
      />
      <Text
        variant="body2"
        text="Tap the + button to add your first product"
        color={theme.colors.textTertiary}
      />
    </View>
  );

  return (
    <View
      style={{ flex: 1, paddingTop: insets.top + 20, paddingHorizontal: 20 }}
    >
      <View style={styles.headerContainer}>
        <View style={{ flex: 1 }}>
          <Text
            variant="h3"
            text="Welcome Admin"
            color={theme.colors.textPrimary}
          />
          <Text
            variant="body1"
            text="Manage your e-commerce platform efficiently"
            color={theme.colors.textSecondary}
            spacing="lg"
          />
        </View>
        <TouchableOpacity
          onPress={handleOpenModal}
          style={styles.addButton}
        >
          <Ionicons name="add" size={28} color={theme.colors.white} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />

      <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={["90%"]}
        backdropComponent={renderBackdrop}
        enablePanDownToClose
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
          >
            <ScrollView 
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.header}>
                <Text
                  variant="h3"
                  text="Add New Product"
                  color={theme.colors.textPrimary}
                />
                <TouchableOpacity onPress={handleCloseModal}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={theme.colors.textPrimary}
                  />
                </TouchableOpacity>
              </View>

              {/* Image Picker */}
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.image} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Ionicons
                      name="camera"
                      size={40}
                      color={theme.colors.textSecondary}
                    />
                    <Text
                      variant="body2"
                      text="Tap to add image"
                      color={theme.colors.textSecondary}
                      style={styles.imageText}
                    />
                  </View>
                )}
              </TouchableOpacity>

              {/* Product Name */}
              <View style={styles.inputContainer}>
                <Text
                  variant="body1Bold"
                  text="Product Name"
                  color={theme.colors.textPrimary}
                  spacing="s"
                />
                <Controller
                  control={control}
                  name="name"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Enter product name"
                      value={value}
                      onChangeText={onChange}
                      placeholderTextColor={theme.colors.textSecondary}
                    />
                  )}
                />
                {errors.name && (
                  <Text
                    variant="body3"
                    text={errors.name.message || ""}
                    color={theme.colors.accentPink}
                    style={styles.errorText}
                  />
                )}
              </View>

              {/* Description */}
              <View style={styles.inputContainer}>
                <Text
                  variant="body1Bold"
                  text="Description"
                  color={theme.colors.textPrimary}
                  spacing="s"
                />
                <Controller
                  control={control}
                  name="description"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={[styles.input, styles.textArea]}
                      placeholder="Enter product description"
                      value={value}
                      onChangeText={onChange}
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                      placeholderTextColor={theme.colors.textSecondary}
                    />
                  )}
                />
                {errors.description && (
                  <Text
                    variant="body3"
                    text={errors.description.message || ""}
                    color={theme.colors.accentPink}
                    style={styles.errorText}
                  />
                )}
              </View>

              {/* Price */}
              <View style={styles.inputContainer}>
                <Text
                  variant="body1Bold"
                  text="Price"
                  color={theme.colors.textPrimary}
                  spacing="s"
                />
                <Controller
                  control={control}
                  name="price"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Enter price"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="decimal-pad"
                      placeholderTextColor={theme.colors.textSecondary}
                    />
                  )}
                />
                {errors.price && (
                  <Text
                    variant="body3"
                    text={errors.price.message || ""}
                    color={theme.colors.accentPink}
                    style={styles.errorText}
                  />
                )}
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                style={styles.submitButton}
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
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

export default Admin;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
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
  productCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 12,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    flexDirection: "row",
    elevation: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: theme.colors.background,
  },
  productInfo: {
    flex: 1,
    marginLeft: theme.spacing.lg,
    justifyContent: "space-between",
  },
  productDescription: {
    marginVertical: theme.spacing.s,
  },
  deleteButton: {
    padding: theme.spacing.s,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.s,
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
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.white,
    fontFamily: "Regular",
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  errorText: {
    marginTop: theme.spacing.s,
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
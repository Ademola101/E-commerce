import { StyleSheet, TouchableOpacity, View, ScrollView,
  FlatList, KeyboardAvoidingView, Platform, Alert } from "react-native";
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
import FloatingButton from "../../../components/FloatingButton";
import { useAuthStore } from "../../../hooks/useAuth";
import ProductCard from "../../../components/ProductCard";

import FormInput from "../../../components/FormInput";

import EmptyState from "../../../components/EmptyState";
import ImagePickerField from "../../../components/ImagePicker";

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
  const { logout } = useAuthStore();
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          logout();
        },
      },
    ]);
  };
  
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
    <ProductCard product={item} onDelete={handleDeleteProduct} />
  );

  const renderEmptyState = () => (
    <EmptyState
      icon="cube-outline"
      title="No Products Yet"
      subtitle="Tap the + button to add your first product"
    />
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
      
      <FloatingButton 
        onPress={handleLogout}
        icon="log-out-outline"
        label="Logout"
        backgroundColor={theme.colors.accentPink}
        position={{ bottom: 30, right: 20 }}
      />
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
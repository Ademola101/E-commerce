import { StyleSheet, TouchableOpacity, View,
  FlatList, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Text from "../../../components/Text";
import { theme } from "../../../../config/theme";
import { useToastMessage } from "../../../hooks/useToastMessage";
import { z } from "zod";

import { useProductStore } from "../../../hooks/useProduct";
import type { ProductType } from "../../../types";
import FloatingButton from "../../../components/FloatingButton";
import { useAuthStore } from "../../../hooks/useAuth";
import ProductCard from "../../../components/ProductCard";

import EmptyState from "../../../components/EmptyState";
import { useNavigation } from "@react-navigation/native";


const Admin = () => {
  const navigation = useNavigation<any>();
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
  const { showToast } = useToastMessage();
  const { products,removeProduct } = useProductStore();


  

  const handleDeleteProduct = (id: string) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            removeProduct(id);
            showToast("Product deleted successfully", "success");
          },
        },
      ],
      { cancelable: true }
    );
  };

  

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
          onPress={() => navigation.navigate("AddNewProduct")}
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
  
});
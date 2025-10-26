import { StyleSheet, View, FlatList, Dimensions, Alert } from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Text from "../../../components/Text";
import ProductCardGrid from "../../../components/ProductCardGrid";
import EmptyState from "../../../components/EmptyState";
import { theme } from "../../../../config/theme";
import { useProductStore } from "../../../hooks/useProduct";
import { useToastMessage } from "../../../hooks/useToastMessage";
import type { ProductType } from "../../../types";
import { useAuthStore } from "../../../hooks/useAuth";
import FloatingButton from "../../../components/FloatingButton";

const { width } = Dimensions.get("window");
const CARD_SPACING = theme.spacing.lg;
const HORIZONTAL_PADDING = 20;

const Dashboard = () => {
  const {logout} = useAuthStore();
  const insets = useSafeAreaInsets();
  const { products, removeProduct } = useProductStore();
  const { showToast } = useToastMessage();
  const [searchQuery, setSearchQuery] = useState("");
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            logout();
            showToast("Logged out successfully", "success");
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Filter products based on search query
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteProduct = (id: string) => {
    removeProduct(id);
    showToast("Product removed from list", "success");
  };

  const renderProduct = ({ item, index }: { item: ProductType; index: number }) => {
    const isLeftColumn = index % 2 === 0;
    return (
      <View
        style={[
          styles.cardWrapper,
          { marginRight: isLeftColumn ? CARD_SPACING / 2 : 0 },
          { marginLeft: !isLeftColumn ? CARD_SPACING / 2 : 0 },
        ]}
      >
        <ProductCardGrid product={item} onDelete={handleDeleteProduct} />
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyWrapper}>
      <EmptyState
        icon="basket-outline"
        title="No Products Found"
        subtitle={
          searchQuery
            ? "Try adjusting your search"
            : "Products will appear here once added"
        }
      />
    </View>
  );

  const renderHeader = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statCard}>
        <Ionicons name="cube" size={24} color={theme.colors.primary} />
        <Text
          variant="h3"
          text={products.length}
          color={theme.colors.textPrimary}
          style={styles.statNumber}
        />
        <Text
          variant="body2"
          text="Total Products"
          color={theme.colors.textSecondary}
        />
      </View>

      <View style={styles.statCard}>
        <Ionicons name="pricetag" size={24} color={theme.colors.accentPink} />
        <Text
          variant="h3"
          text={filteredProducts.length}
          color={theme.colors.textPrimary}
          style={styles.statNumber}
        />
        <Text
          variant="body2"
          text="Showing"
          color={theme.colors.textSecondary}
        />
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top + 20, paddingHorizontal: HORIZONTAL_PADDING },
      ]}
    >
      {/* Header */}
      <View style={styles.headerContainer}>
        <View>
          <Text
            variant="h3"
            text="Product Dashboard"
            color={theme.colors.textPrimary}
          />
          <Text
            variant="body1"
            text="Browse and manage your products"
            color={theme.colors.textSecondary}
            spacing="lg"
          />
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color={theme.colors.textSecondary}
          style={styles.searchIcon}
        />
        <Text
          variant="body1"
          text={searchQuery || "Search products..."}
          color={searchQuery ? theme.colors.textPrimary : theme.colors.textSecondary}
          style={styles.searchText}
        />
      </View>

      {/* Product Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        ListHeaderComponent={products.length > 0 ? renderHeader : null}
      />
      <FloatingButton icon="log-out-outline" onPress={handleLogout} />
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.lg,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: 12,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchIcon: {
    marginRight: theme.spacing.md,
  },
  searchText: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 12,
    padding: theme.spacing.lg,
    alignItems: "center",
    elevation: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    marginVertical: theme.spacing.s,
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  cardWrapper: {
    flex: 1,
    maxWidth: (width - HORIZONTAL_PADDING * 2 - CARD_SPACING) / 2,
  },
  emptyWrapper: {
    width: width - HORIZONTAL_PADDING * 2,
  },
});
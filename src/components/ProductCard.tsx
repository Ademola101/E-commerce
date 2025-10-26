import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import Text from "./Text";
import { theme } from "../../config/theme";
import type { ProductType } from "../types";
import { formatToMoney } from "../utils/formatToMoney";

interface ProductCardProps {
  product: ProductType;
  onDelete: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
  return (
    <View style={styles.productCard}>
      <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text
          variant="h6Bold"
          text={product.name}
          color={theme.colors.textPrimary}
          lines={1}
        />
        <Text
          variant="body2"
          text={product.description}
          color={theme.colors.textSecondary}
          lines={2}
          style={styles.productDescription}
        />
        <Text
          variant="body1Bold"
          text={formatToMoney(product.price)}
          color={theme.colors.primary}
        />
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(product.id)}
      >
        <Ionicons name="trash-outline" size={20} color={theme.colors.accentPink} />
      </TouchableOpacity>
    </View>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
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
});
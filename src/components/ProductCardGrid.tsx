import { StyleSheet, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import Text from "./Text";
import { theme } from "../../config/theme";
import type { ProductType } from "../types";
import { formatToMoney } from "../utils/formatToMoney";
import { useNavigation } from "@react-navigation/native";

interface ProductCardGridProps {
  product: ProductType;
  onDelete: (id: string) => void;
}

const ProductCardGrid: React.FC<ProductCardGridProps> = ({
  product,
  onDelete,
}) => {
  const navigation = useNavigation<any>();
  return (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => {
        navigation.navigate("ProductDetails" as never, { product } as never);
      }}
    >
      <Image source={{ uri: product.imageUrl }} style={styles.productImage} />

      

      <View style={styles.productInfo}>
        <Text
          variant="body1Bold"
          text={product.name}
          color={theme.colors.textPrimary}
          lines={1}
        />
        <Text
          variant="body3"
          text={product.description}
          color={theme.colors.textSecondary}
          lines={2}
          style={styles.productDescription}
        />
        <Text
          variant="body1Bold"
          text={formatToMoney(product.price)}
          color={theme.colors.primary}
          style={styles.price}
        />
      </View>
    </TouchableOpacity>
  );
};

export default ProductCardGrid;

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: theme.spacing.lg,
  },
  productImage: {
    width: "100%",
    height: 140,
    backgroundColor: theme.colors.background,
  },
  productInfo: {
    padding: theme.spacing.md,
  },
  productDescription: {
    marginVertical: theme.spacing.s,
  },
  price: {
    marginTop: theme.spacing.s,
  },
  deleteButton: {
    position: "absolute",
    top: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.s,
    borderRadius: 20,
    elevation: 3,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

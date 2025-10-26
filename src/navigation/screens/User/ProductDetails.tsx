import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import Text from "../../../components/Text";
import { theme } from "../../../../config/theme";
import { useCartStore } from "../../../hooks/useProduct";
import { useToastMessage } from "../../../hooks/useToastMessage";
import type { ProductType } from "../../../types";
import { formatToMoney } from "../../../utils/formatToMoney";

const { width, height } = Dimensions.get("window");

const ProductDetails = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { product } = route.params as { product: ProductType };
  const { addProduct, products } = useCartStore();
  const { showToast } = useToastMessage();
  const [quantity, setQuantity] = useState(1);

  
  const isInCart = products.some((item) => item.id === product.id);

  const handleAddToCart = () => {
    if (isInCart) {
      showToast("Product already in cart", "danger");
      return;
    }

    const productWithQuantity = {
      ...product,
      quantity,
    };

    addProduct(productWithQuantity);
    showToast("Added to cart successfully!", "success");
  };

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header with back button */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + 10, paddingHorizontal: 20 },
        ]}
      >
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Ionicons
            name="arrow-back"
            size={24}
            color={theme.colors.textPrimary}
          />
        </TouchableOpacity>
        <Text
          variant="h5Bold"
          text="Product Details"
          color={theme.colors.textPrimary}
        />
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.imageUrl }} style={styles.image} />
        </View>

        {/* Product Info */}
        <View style={styles.contentContainer}>
          {/* Name and Price */}
          <View style={styles.titleSection}>
            <Text
              variant="h3"
              text={product.name}
              color={theme.colors.textPrimary}
              style={styles.productName}
            />
            <Text
              variant="h4Bold"
              text={formatToMoney(product.price)}
              color={theme.colors.primary}
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text
              variant="body1Bold"
              text="Description"
              color={theme.colors.textPrimary}
              spacing="md"
            />
            <Text
              variant="body1"
              text={product.description}
              color={theme.colors.textSecondary}
              style={styles.description}
            />
          </View>

          {/* Quantity Selector */}
          <View style={styles.section}>
            <Text
              variant="body1Bold"
              text="Quantity"
              color={theme.colors.textPrimary}
              spacing="md"
            />
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  quantity === 1 && styles.quantityButtonDisabled,
                ]}
                onPress={decrementQuantity}
                disabled={quantity === 1}
              >
                <Ionicons
                  name="remove"
                  size={20}
                  color={
                    quantity === 1
                      ? theme.colors.textTertiary
                      : theme.colors.textPrimary
                  }
                />
              </TouchableOpacity>

              <View style={styles.quantityDisplay}>
                <Text
                  variant="h5Bold"
                  text={quantity}
                  color={theme.colors.textPrimary}
                />
              </View>

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={incrementQuantity}
              >
                <Ionicons
                  name="add"
                  size={20}
                  color={theme.colors.textPrimary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Total Price */}
          <View style={styles.totalContainer}>
            <Text
              variant="body1"
              text="Total Price"
              color={theme.colors.textSecondary}
            />
            <Text
              variant="h4Bold"
              text={formatToMoney(product.price * quantity)}
              color={theme.colors.primary}
            />
          </View>

          {/* Features/Info Cards */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureCard}>
              <Ionicons
                name="shield-checkmark"
                size={24}
                color={theme.colors.primary}
              />
              <Text
                variant="body2Bold"
                text="Quality Assured"
                color={theme.colors.textPrimary}
                style={styles.featureText}
              />
            </View>

            <View style={styles.featureCard}>
              <Ionicons
                name="rocket"
                size={24}
                color={theme.colors.accentPink}
              />
              <Text
                variant="body2Bold"
                text="Fast Delivery"
                color={theme.colors.textPrimary}
                style={styles.featureText}
              />
            </View>

            <View style={styles.featureCard}>
              <Ionicons
                name="refresh"
                size={24}
                color={theme.colors.accent}
              />
              <Text
                variant="body2Bold"
                text="Easy Returns"
                color={theme.colors.textPrimary}
                style={styles.featureText}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View
        style={[
          styles.bottomContainer,
          { paddingBottom: insets.bottom + 16 },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.addToCartButton,
            isInCart && styles.addToCartButtonDisabled,
          ]}
          onPress={handleAddToCart}
          disabled={isInCart}
        >
          <Ionicons
            name={isInCart ? "checkmark-circle" : "cart"}
            size={24}
            color={theme.colors.white}
          />
          <Text
            variant="body1Bold"
            text={isInCart ? "Already in Cart" : "Add to Cart"}
            color={theme.colors.white}
            style={styles.buttonText}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 16,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    width: width,
    height: height * 0.4,
    backgroundColor: theme.colors.white,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  contentContainer: {
    padding: 20,
  },
  titleSection: {
    marginBottom: theme.spacing.lg,
  },
  productName: {
    marginBottom: theme.spacing.md,
  },
  section: {
    marginBottom: theme.spacing.xlg,
  },
  description: {
    lineHeight: 24,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.lg,
  },
  quantityButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  quantityButtonDisabled: {
    backgroundColor: theme.colors.background,
  },
  quantityDisplay: {
    minWidth: 50,
    alignItems: "center",
    paddingHorizontal: theme.spacing.lg,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.primaryLight,
    padding: theme.spacing.lg,
    borderRadius: 12,
    marginBottom: theme.spacing.xlg,
  },
  featuresContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.spacing.md,
  },
  featureCard: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: theme.spacing.lg,
    borderRadius: 12,
    alignItems: "center",
    elevation: 1,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  featureText: {
    marginTop: theme.spacing.s,
    textAlign: "center",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    elevation: 8,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  addToCartButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: theme.spacing.md,
  },
  addToCartButtonDisabled: {
    backgroundColor: theme.colors.textTertiary,
  },
  buttonText: {
    marginLeft: theme.spacing.s,
  },
});
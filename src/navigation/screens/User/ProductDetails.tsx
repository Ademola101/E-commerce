import {
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import Text from "../../../components/Text";
import { theme } from "../../../../config/theme";
import { useCartStore } from "../../../hooks/useProduct";
import { useToastMessage } from "../../../hooks/useToastMessage";
import type { ProductType } from "../../../types";
import { formatToMoney } from "../../../utils/formatToMoney";
import CartIcon from "../../../components/CartIcon";


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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: product.name,
      headerRight: () => <CartIcon />,
    });
  }, [navigation, product.name]);

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        
        <View style={styles.imageContainer}>
          <Image source={{ uri: product.imageUrl }} style={styles.image} />
        </View>
      </ScrollView>

      <View
        style={[styles.bottomContainer, { paddingBottom: insets.bottom + 16 }]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: theme.spacing.md,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Image
              source={{ uri: product.imageUrl }}
              style={{ width: 60, height: 60, borderRadius: 8 }}
            />
            <Text
              variant="body1Bold"
              text={product.name}
              color={theme.colors.textPrimary}
              style={{ marginTop: theme.spacing.s }}
            />
          </View>

          <Text
            variant="body1Bold"
            text={formatToMoney(product.price * quantity)}
            color={theme.colors.primary}
            style={{ marginTop: theme.spacing.s }}
          />
        </View>
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
    marginHorizontal: theme.spacing.md,
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
    borderRadius: (height + width) * 0.02,
  },
  addToCartButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: (height + width) * 0.02,
    gap: theme.spacing.md,
  },
  addToCartButtonDisabled: {
    backgroundColor: theme.colors.textTertiary,
  },
  buttonText: {
    marginLeft: theme.spacing.s,
  },
});

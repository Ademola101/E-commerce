import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import React, { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { ProductType } from "../../../../types";

import Text from "../../../../components/Text";
import { formatToMoney } from "../../../../utils/formatToMoney";
import EmptyState from "../../../../components/EmptyState";
import { theme } from "../../../../../config/theme";
import { useCartStore } from "../../../../hooks/useProduct";
import { useToastMessage } from "../../../../hooks/useToastMessage";
import CartItemSwipeable from "../../../../components/CartItemSwipeable";

const DELIVERY_FEE = 5.0;
const DISCOUNT_THRESHOLD = 3;
const DISCOUNT_PERCENTAGE = 0.5; 

const Cart = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { products, removeProduct, updateProduct } = useCartStore();
  const { showToast } = useToastMessage();

  
  const { subtotal, discount, total } = useMemo(() => {
    let subtotalAmount = 0;
    let discountAmount = 0;

    const productGroups = products.reduce((acc, product) => {
      if (!acc[product.id]) {
        acc[product.id] = { ...product, totalQuantity: 0 };
      }
      acc[product.id].totalQuantity += product.quantity || 0;
      return acc;
    }, {} as Record<string, ProductType & { quantity: number; totalQuantity: number }>);

    products.forEach((product) => {
      const itemTotal = product.price * product.quantity;
      subtotalAmount += itemTotal;

      const productGroup = productGroups[product.id];
      if (productGroup.totalQuantity >= DISCOUNT_THRESHOLD) {
        discountAmount += itemTotal * DISCOUNT_PERCENTAGE;
      }
    });

    const totalAmount = subtotalAmount - discountAmount + DELIVERY_FEE;

    return {
      subtotal: subtotalAmount,
      discount: discountAmount,
      total: totalAmount,
    };
  }, [products]);

  const handleDeleteProduct = (id: string) => {
    removeProduct(id);
    showToast("Item removed from cart", "success");
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      updateProduct({ ...product, quantity });
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleCheckout = () => {
    showToast("Checkout feature coming soon!", "success");
  };

  const renderCartItem = ({
    item,
  }: {
    item: ProductType & { quantity: number };
  }) => (
    <CartItemSwipeable
      item={item}
      onDelete={handleDeleteProduct}
      onUpdateQuantity={handleUpdateQuantity}
    />
  );

  const renderEmptyState = () => (
    <EmptyState
      icon="cart-outline"
      title="Your Cart is Empty"
      subtitle="Add some products to get started"
    />
  );

  const renderSummary = () => (
    <View style={styles.summaryContainer}>
      <Text
        variant="h5Bold"
        text="Order Summary"
        color={theme.colors.textPrimary}
        spacing="lg"
      />

      {/* Subtotal */}
      <View style={styles.summaryRow}>
        <Text
          variant="body1"
          text="Subtotal"
          color={theme.colors.textSecondary}
        />
        <Text
          variant="body1Bold"
          text={formatToMoney(subtotal)}
          color={theme.colors.textPrimary}
        />
      </View>

      {/* Delivery Fee */}
      <View style={styles.summaryRow}>
        <Text
          variant="body1"
          text="Delivery Fee"
          color={theme.colors.textSecondary}
        />
        <Text
          variant="body1Bold"
          text={formatToMoney(DELIVERY_FEE)}
          color={theme.colors.textPrimary}
        />
      </View>

      {/* Discount */}
      {discount > 0 && (
        <View style={styles.summaryRow}>
          <View style={styles.discountLabel}>
            <Text
              variant="body1"
              text="Discount (50%)"
              color={theme.colors.success}
            />
            <Ionicons
              name="pricetag"
              size={16}
              color={theme.colors.success}
              style={styles.discountIcon}
            />
          </View>
          <Text
            variant="body1Bold"
            text={`-${formatToMoney(discount)}`}
            color={theme.colors.success}
          />
        </View>
      )}

      {/* Divider */}
      <View style={styles.divider} />

      {/* Total */}
      <View style={styles.summaryRow}>
        <Text variant="h6Bold" text="Total" color={theme.colors.textPrimary} />
        <Text
          variant="h5Bold"
          text={formatToMoney(total)}
          color={theme.colors.primary}
        />
      </View>

      {/* Discount Info */}
      {discount === 0 && (
        <View style={styles.discountInfo}>
          <Ionicons
            name="information-circle"
            size={16}
            color={theme.colors.textTertiary}
          />
          <Text
            variant="body3"
            text="Add 3+ of the same item to get 50% off!"
            color={theme.colors.textTertiary}
            style={styles.discountInfoText}
          />
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      

      {/* Cart Items */}
      <FlatList
        data={products}
        renderItem={renderCartItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={products.length > 0 ? renderSummary : null}
      />

      {/* Checkout Button */}
      {products.length > 0 && (
        <View
          style={[
            styles.checkoutContainer,
            { paddingBottom: insets.bottom + 16 },
          ]}
        >
          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={handleCheckout}
          >
            <Text
              variant="body1Bold"
              text="Proceed to Checkout"
              color={theme.colors.white}
            />
            <Ionicons
              name="arrow-forward"
              size={20}
              color={theme.colors.white}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default Cart;

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
  cartBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 20,
    flexGrow: 1,
  },
  summaryContainer: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 12,
    padding: theme.spacing.lg,
    marginTop: theme.spacing.lg,
    elevation: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  discountLabel: {
    flexDirection: "row",
    alignItems: "center",
  },
  discountIcon: {
    marginLeft: theme.spacing.s,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  discountInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primaryLight,
    padding: theme.spacing.md,
    borderRadius: 8,
    marginTop: theme.spacing.md,
  },
  discountInfoText: {
    marginLeft: theme.spacing.s,
    flex: 1,
  },
  checkoutContainer: {
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
  checkoutButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: theme.spacing.md,
  },
});

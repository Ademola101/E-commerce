import { StyleSheet, View, FlatList, TouchableOpacity } from "react-native";
import React, { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { DELIVERY_FEE, ProductType } from "../../../../types";

import Text from "../../../../components/Text";
import { formatToMoney } from "../../../../utils/formatToMoney";
import EmptyState from "../../../../components/EmptyState";
import { theme } from "../../../../../config/theme";
import { useCartStore } from "../../../../hooks/useProduct";
import { useToastMessage } from "../../../../hooks/useToastMessage";
import CartItemSwipeable from "../../../../components/CartItemSwipeable";
import { useCartCalculation } from "../../../../hooks/useCartCalculation";

const Cart = () => {
  const insets = useSafeAreaInsets();
  const { products, removeProduct, updateProduct } = useCartStore();
  const { showToast } = useToastMessage();
  const { subtotal, discount, total } = useCartCalculation(products);

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

      
      <View style={styles.divider} />

      
      <View style={styles.summaryRow}>
        <Text variant="h6Bold" text="Total" color={theme.colors.textPrimary} />
        <Text
          variant="h5Bold"
          text={formatToMoney(total)}
          color={theme.colors.primary}
        />
      </View>

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
      <FlatList
        data={products}
        renderItem={renderCartItem}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={products.length > 0 ? renderSummary : null}
      />

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

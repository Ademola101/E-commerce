import { StyleSheet, View, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Text from "./Text";
import { theme } from "../../config/theme";
import { useCartStore } from "../hooks/useProduct";

type CartIconProps = {
  color?: string;
  size?: number;
  onPress?: () => void;
};

const CartIcon: React.FC<CartIconProps> = ({
  color = theme.colors.textPrimary,
  size = 24,
  onPress,
}) => {
  const navigation = useNavigation();
  const { products } = useCartStore();
  const cartItemCount = products.length;

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      // Default navigation to cart screen
      navigation.navigate("Cart" as never);
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.iconContainer}>
        <Ionicons name="cart-outline" size={size} color={color} />
        {cartItemCount > 0 && (
          <View style={styles.badge}>
            <Text
              variant="body3Bold"
              text={cartItemCount > 99 ? "99+" : cartItemCount.toString()}
              color={theme.colors.white}
              style={styles.badgeText}
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default CartIcon;

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  iconContainer: {
    position: "relative",
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -8,
    backgroundColor: theme.colors.accentPink,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  badgeText: {
    fontSize: 10,
    lineHeight: 12,
  },
});
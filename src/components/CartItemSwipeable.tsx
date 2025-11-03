import { StyleSheet, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Text from "./Text";
import { theme } from "../../config/theme";
import type { ProductType } from "../types";
import { formatToMoney } from "../utils/formatToMoney";

interface CartItemSwipeableProps {
  item: ProductType & { quantity: number };
  onDelete: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
}

const SWIPE_THRESHOLD = 80;
const DELETE_BUTTON_WIDTH = 80;

const CartItemSwipeable: React.FC<CartItemSwipeableProps> = ({
  item,
  onDelete,
  onUpdateQuantity,
}) => {
  const translateX = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      
      if (event.translationX > 0) {
        translateX.value = Math.min(event.translationX, DELETE_BUTTON_WIDTH);
      } else if (translateX.value > 0) {
        translateX.value = Math.max(0, translateX.value + event.translationX);
      }
    })
    .onEnd(() => {
      if (translateX.value > SWIPE_THRESHOLD) {
        translateX.value = withSpring(DELETE_BUTTON_WIDTH);
      } else {
        translateX.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handleDelete = () => {
    translateX.value = withSpring(0, {}, () => {
      runOnJS(onDelete)(item.id);
    });
  };

  const incrementQuantity = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const decrementQuantity = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.deleteContainer}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash" size={24} color={theme.colors.white} />
        </TouchableOpacity>
      </View>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.card, animatedStyle]}>
          <Image source={{ uri: item.imageUrl }} style={styles.image} />

          <View style={styles.infoContainer}>
            <View style={styles.nameAndPrice}>
              <Text
                variant="body1Bold"
                text={item.name}
                color={theme.colors.textPrimary}
                lines={1}
              />
              <Text
                variant="body1Bold"
                text={formatToMoney(item.price)}
                color={theme.colors.primary}
                style={styles.price}
              />
            </View>

            
          </View>
          <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={[
                  styles.quantityButton,
                  item.quantity === 1 && styles.quantityButtonDisabled,
                ]}
                onPress={decrementQuantity}
                disabled={item.quantity === 1}
              >
                <Ionicons
                  name="remove"
                  size={16}
                  color={
                    item.quantity === 1
                      ? theme.colors.textTertiary
                      : theme.colors.textPrimary
                  }
                />
              </TouchableOpacity>

              <Text
                variant="body1Bold"
                text={item.quantity}
                color={theme.colors.textPrimary}
                style={styles.quantityText}
              />

              <TouchableOpacity
                style={styles.quantityButton}
                onPress={incrementQuantity}
              >
                <Ionicons
                  name="add"
                  size={16}
                  color={theme.colors.textPrimary}
                />
              </TouchableOpacity>
            </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

export default CartItemSwipeable;

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.lg,
    position: "relative",
  },
  deleteContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: theme.colors.accentPink,
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: theme.colors.cardBackground,
    borderRadius: 12,
    padding: theme.spacing.lg,
    flexDirection: "row",
    elevation: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: theme.colors.background,
  },
  infoContainer: {
    flex: 1,
    marginLeft: theme.spacing.lg,
    justifyContent: "space-between",
  },
  nameAndPrice: {
    flex: 1,
  },
  price: {
    marginTop: theme.spacing.s,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    minWidth: 30,
    textAlign: "center",
  },
});
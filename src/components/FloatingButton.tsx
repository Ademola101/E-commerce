import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../config/theme";
import Text from "./Text";

type FloatingButtonProps = {
  onPress: () => void;
  icon?: keyof typeof Ionicons.glyphMap;
  label?: string;
  backgroundColor?: string;
  position?: {
    bottom?: number;
    right?: number;
    left?: number;
    top?: number;
  };
  size?: "small" | "medium" | "large";
  style?: ViewStyle;
};

const FloatingButton: React.FC<FloatingButtonProps> = ({
  onPress,
  icon = "log-out-outline",
  label,
  backgroundColor = theme.colors.accentPink,
  position = { bottom: 30, right: 20 },
  size = "medium",
  style,
}) => {
  const buttonSizes = {
    small: { width: 48, height: 48, iconSize: 20 },
    medium: { width: 56, height: 56, iconSize: 24 },
    large: { width: 64, height: 64, iconSize: 28 },
  };

  const dimensions = buttonSizes[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor,
          width: label ? "auto" : dimensions.width,
          height: dimensions.height,
          minWidth: dimensions.width,
          ...position,
        },
        style,
      ]}
      activeOpacity={0.8}
    >
      <Ionicons name={icon} size={dimensions.iconSize} color={theme.colors.white} />
      {label && (
        <Text
          variant="body2Bold"
          text={label}
          color={theme.colors.white}
          style={styles.label}
        />
      )}
    </TouchableOpacity>
  );
};

export default FloatingButton;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 16,
    elevation: 6,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  label: {
    marginLeft: theme.spacing.md,
  },
});
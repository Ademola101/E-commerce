import { StyleSheet, View } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import Text from "./Text";
import { theme } from "../../config/theme";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  iconSize?: number;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon = "cube-outline",
  title,
  subtitle,
  iconSize = 64,
}) => {
  return (
    <View style={styles.emptyState}>
      <Ionicons name={icon} size={iconSize} color={theme.colors.textTertiary} />
      <Text
        variant="h5"
        text={title}
        color={theme.colors.textSecondary}
        style={styles.emptyText}
      />
      <Text
        variant="body2"
        text={subtitle}
        color={theme.colors.textTertiary}
      />
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.s,
  },
});
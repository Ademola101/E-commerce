import { StyleSheet, TextInput, View, TextInputProps } from "react-native";
import React from "react";
import Text from "./Text";
import { theme } from "../../config/theme";

interface FormInputProps extends TextInputProps {
  label: string;
  error?: string;
  isTextArea?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  error,
  isTextArea = false,
  ...inputProps
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text
        variant="body1Bold"
        text={label}
        color={theme.colors.textPrimary}
        spacing="s"
      />
      <TextInput
        style={[
          styles.input,
          isTextArea && styles.textArea,
          error && styles.inputError,
        ]}
        placeholderTextColor={theme.colors.textSecondary}
        {...inputProps}
      />
      {error && (
        <Text
          variant="body3"
          text={error}
          color={theme.colors.accentPink}
          style={styles.errorText}
        />
      )}
    </View>
  );
};

export default FormInput;

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: theme.spacing.lg,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: theme.colors.textPrimary,
    backgroundColor: theme.colors.white,
    fontFamily: "Regular",
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  inputError: {
    borderColor: theme.colors.accentPink,
  },
  errorText: {
    marginTop: theme.spacing.s,
  },
});
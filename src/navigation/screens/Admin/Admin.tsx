import { StyleSheet, TouchableOpacity, View, TextInput, Image } from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Text from "../../../components/Text";
import { theme } from "../../../../config/theme";
import { storage } from "../../../../config/mmkv";
import { useToastMessage } from "../../../hooks/useToastMessage";
import {z} from "zod";
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { Controller, useForm } from "react-hook-form";


const generateUniqueId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};
const Admin = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{ flex: 1, paddingTop: insets.top + 20, paddingHorizontal: 20 }}
    >
      <View style={{ flex: 1, justifyContent: "space-between", flexDirection: "row",  }}>
        <View>
          <Text
            variant="h3"
            text="Welcome Admin"
            color={theme.colors.textPrimary}
            align="center"
          />
          <Text
            variant="body1"
            text="Manage your e-commerce platform efficiently"
            color={theme.colors.textSecondary}
            align="center"
            spacing="xxlg"
          />
        </View>
        <TouchableOpacity>
          <Ionicons
            name="add"
            size={24}
            color={theme.colors.black}
            

          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Admin;

const styles = StyleSheet.create({});

import { Assets as NavigationAssets } from "@react-navigation/elements";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import * as React from "react";

import useLoadFont from "./hooks/useLoadFont";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import FlashMessage from "react-native-flash-message";
import Constants from "expo-constants";
import { theme } from "../config/theme";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Navigation } from "./navigation";

Asset.loadAsync([...NavigationAssets]);

SplashScreen.preventAutoHideAsync();

export function App() {
  const { isLoaded, error } = useLoadFont();

  const onLayoutRoot = async () => {
    if (isLoaded) {
      await SplashScreen.hideAsync();
    }
    if (error) {
      console.warn("Error loading fonts", error);
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRoot}>
      <BottomSheetModalProvider>
        <Navigation />
        <StatusBar
          backgroundColor={theme.colors.white}
          barStyle="dark-content"
        />
        <FlashMessage
          position="top"
          titleStyle={{
            fontFamily: "ClashMedium",
            textAlign: "center",
          }}
          duration={3000}
          floating={true}
          // @ts-expect-error
          icon={{ icon: "auto", position: "left" }}
          style={{ marginTop: Constants.statusBarHeight }}
        />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}

import { useState, useEffect } from "react";
import * as Font from "expo-font";

const useLoadFont = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fonts = {
    Regular: require('../assets/fonts/gellix-regular.ttf'),
    Bold: require('../assets/fonts/gellix-bold.ttf'),
    Thin: require('../assets/fonts/gellix-thin.ttf'),
    Light: require('../assets/fonts/gellix-light.ttf'),
    ClashRegular: require('../assets/fonts/ClashGrotesk-Regular.otf'),
    ClashBold: require('../assets/fonts/ClashGrotesk-Bold.otf'),
    ClashMedium: require('../assets/fonts/ClashGrotesk-Medium.otf'),
    ClashLight: require('../assets/fonts/ClashGrotesk-Light.otf'),
    ClashSemiBold: require('../assets/fonts/ClashGrotesk-Semibold.otf'),
  };

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync(fonts);
        setIsLoaded(true);
      } catch (err) {
        setError(err as any);
      }
    };

    loadFonts();
  }, []);

  return { isLoaded, error };
};

export default useLoadFont;

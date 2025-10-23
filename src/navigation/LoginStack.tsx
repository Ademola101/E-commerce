import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./screens/Login";

export const LoginStack = createNativeStackNavigator({
  screens: {
    Login: {
      screen: Login,
      options: {
        headerShown: false,
      },
    },
  },
});

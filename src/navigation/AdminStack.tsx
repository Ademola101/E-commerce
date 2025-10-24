import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Admin from "./screens/Admin/Admin";

export const AdminStack = createNativeStackNavigator({
  screens: {
    Admin: {
      screen: Admin,
      options: {
        headerShown: false,
      },
    },
  },
});
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Dashboard from "./screens/User/Dashboard";

export const UserStack = createNativeStackNavigator({
  screens: {
    Dashboard: {
      screen: Dashboard,
      options: { headerShown: false },
    },
  },
});

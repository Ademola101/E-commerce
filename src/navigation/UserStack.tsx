import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Dashboard from "./screens/User/Dashboard";
import ProductDetails from "./screens/User/ProductDetails";

export const UserStack = createNativeStackNavigator({
  screens: {
    Dashboard: {
      screen: Dashboard,
      options: { headerShown: false },
    },
    ProductDetails: {
      screen: ProductDetails,
      options: { headerShown: false },
    },
  },
});

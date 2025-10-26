import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Dashboard from "./screens/User/Dashboard/Dashboard";
import ProductDetails from "./screens/User/ProductDetails";
import Cart from "./screens/User/Cart/CartScreen";

export const UserStack = createNativeStackNavigator({
  screens: {
    Dashboard: {
      screen: Dashboard,
      options: { headerShown: false },
    },
    ProductDetails: {
      screen: ProductDetails,
      options: {
        headerShown: true,
        headerShadowVisible: false,
        title: "Product Details",
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 18,
        },
      },
    },
    Cart: {
      screen: Cart,
      options: {
        headerShown: true,
        headerShadowVisible: false,
        title: "Your Cart",
        headerTitleAlign: "center",
        headerTitleStyle: {
          fontSize: 18,
        },
      },
    },
  },
});

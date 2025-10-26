import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Admin from "./screens/Admin/Admin";
import AddNewProduct from "./screens/Admin/AddNewProduct";

export const AdminStack = createNativeStackNavigator({
  screens: {
    Admin: {
      screen: Admin,
      options: {
        headerShown: false,
      },
    },
    AddNewProduct: {
      screen: AddNewProduct,
      options: {
        animation: "slide_from_right",
        headerShown: true,
        headerShadowVisible: false,
        title: 'Add New Product',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontSize: 18,
       },
      },
    },
  },
});
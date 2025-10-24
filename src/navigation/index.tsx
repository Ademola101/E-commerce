import { createStaticNavigation } from "@react-navigation/native";
import { LoginStack } from "./LoginStack";
import { AdminStack } from "./AdminStack";

export const Navigation = createStaticNavigation(LoginStack);
  
export const AdminNavigation = createStaticNavigation(AdminStack);
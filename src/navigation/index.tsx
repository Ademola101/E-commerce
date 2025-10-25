import { createStaticNavigation } from "@react-navigation/native";
import { LoginStack } from "./LoginStack";
import { AdminStack } from "./AdminStack";
import { UserStack } from "./UserStack";


export const AuthNavigation = createStaticNavigation(LoginStack);
  
export const AdminNavigation = createStaticNavigation(AdminStack);

export const UserNavigation = createStaticNavigation(UserStack);


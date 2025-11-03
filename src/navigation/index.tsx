import { createStaticNavigation } from "@react-navigation/native";
import { LoginStack } from "./LoginStack";
import { AdminStack } from "./AdminStack";
import { UserStack } from "./UserStack";
import { useAuthStore } from "../hooks/useAuth";
import { UserRole } from "../utils/role";
import { createURL } from "expo-linking";
const prefix = createURL("/");
const AuthNavigation = createStaticNavigation(LoginStack);

const AdminNavigation = createStaticNavigation(AdminStack);

const UserNavigation = createStaticNavigation(UserStack);

export const Navigation = () => {
  const { userRole, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || userRole === UserRole.GUEST) {
    return <AuthNavigation linking={{ enabled: "auto", prefixes: [prefix] }} />;
  }

  if (userRole === UserRole.ADMIN) {
    return (
      <AdminNavigation linking={{ enabled: "auto", prefixes: [prefix] }} />
    );
  }

  if (userRole === UserRole.USER) {
    return <UserNavigation linking={{ enabled: "auto", prefixes: [prefix] }} />;
  }

  return <AuthNavigation linking={{ enabled: "auto", prefixes: [prefix] }} />;
};

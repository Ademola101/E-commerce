import { createMMKV } from "react-native-mmkv";
export const storage = createMMKV({
  id: "appStorage",
  encryptionKey: "32-characters-minimum-key!!",
});

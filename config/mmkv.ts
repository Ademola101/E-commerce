import { createMMKV, } from "react-native-mmkv";
import type { StateStorage } from "zustand/middleware";
export const storage = createMMKV({
  id: "appStorage",
  encryptionKey: "32-characters-minimum-key!!",
});


export const zustandStorage: StateStorage = {
  getItem: (name: string): string => {
    return storage.getString(name) || "";
  },
  setItem: (name: string, value: string): void => {
    storage.set(name, value);
  },
  removeItem: (name: string): void => {
    storage.remove(name);
  },
};
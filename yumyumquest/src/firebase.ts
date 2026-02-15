import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import * as RNAuth from "@firebase/auth";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID!,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = (() => {
    try {
        const getReactNativePersistence = (RNAuth as any).getReactNativePersistence as
            | ((storage: typeof ReactNativeAsyncStorage) => unknown)
            | undefined;

        if (!getReactNativePersistence) {
            return getAuth(app);
        }

        return initializeAuth(app, {
            persistence: getReactNativePersistence(ReactNativeAsyncStorage) as any,
        });
    } catch {
        return getAuth(app);
    }
})();
export const db = getFirestore(app);

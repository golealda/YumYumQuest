import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

const CHILD_AUTO_LOGIN_KEY = 'child_auto_login_enabled';
const CHILD_SESSION_ID_KEY = 'child_session_id';

export interface ChildProfile {
    childId: string;
    nickname: string;
    avatar: string;
    age?: number;
}

export const getChildAutoLoginEnabled = async (): Promise<boolean> => {
    try {
        const value = await AsyncStorage.getItem(CHILD_AUTO_LOGIN_KEY);
        if (value === null) return true;
        return value === 'true';
    } catch (error) {
        console.error('Error reading child auto-login preference:', error);
        return true;
    }
};

export const setChildAutoLoginEnabled = async (enabled: boolean): Promise<void> => {
    try {
        await AsyncStorage.setItem(CHILD_AUTO_LOGIN_KEY, String(enabled));
    } catch (error) {
        console.error('Error saving child auto-login preference:', error);
    }
};

export const getChildSessionId = async (): Promise<string | null> => {
    try {
        return await AsyncStorage.getItem(CHILD_SESSION_ID_KEY);
    } catch (error) {
        console.error('Error reading child session id:', error);
        return null;
    }
};

export const setChildSessionId = async (childId: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(CHILD_SESSION_ID_KEY, childId);
    } catch (error) {
        console.error('Error saving child session id:', error);
    }
};

export const clearChildSession = async (): Promise<void> => {
    try {
        await AsyncStorage.removeItem(CHILD_SESSION_ID_KEY);
    } catch (error) {
        console.error('Error clearing child session id:', error);
    }
};

export const isChildSessionValid = async (childId: string): Promise<boolean> => {
    try {
        const snap = await getDoc(doc(db, 'children', childId));
        return snap.exists();
    } catch (error) {
        console.error('Error validating child session:', error);
        return false;
    }
};

export const getCurrentChildProfile = async (): Promise<ChildProfile | null> => {
    const childId = await getChildSessionId();
    if (!childId) return null;

    try {
        const snap = await getDoc(doc(db, 'children', childId));
        if (!snap.exists()) return null;
        const data = snap.data();
        return {
            childId,
            nickname: data.nickname ?? '아이',
            avatar: data.avatar ?? '🐼',
            age: data.age ?? undefined,
        };
    } catch (error) {
        console.error('Error reading current child profile:', error);
        return null;
    }
};

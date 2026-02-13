import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTO_LOGIN_KEY = 'auto_login_enabled';

export const getAutoLoginEnabled = async (): Promise<boolean> => {
    try {
        const value = await AsyncStorage.getItem(AUTO_LOGIN_KEY);
        if (value === null) return true;
        return value === 'true';
    } catch (error) {
        console.error('Error reading auto-login preference:', error);
        return true;
    }
};

export const setAutoLoginEnabled = async (enabled: boolean): Promise<void> => {
    try {
        await AsyncStorage.setItem(AUTO_LOGIN_KEY, String(enabled));
    } catch (error) {
        console.error('Error saving auto-login preference:', error);
    }
};

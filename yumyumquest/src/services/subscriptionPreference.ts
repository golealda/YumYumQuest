import AsyncStorage from '@react-native-async-storage/async-storage';

const PREMIUM_SUBSCRIPTION_KEY = 'premium_subscription_active';
const PARENT_SELECTED_THEME_KEY = 'parent_selected_theme';

export type ParentThemeId =
    | 'ant_and_grasshopper'
    | 'tortoise_and_hare'
    | 'dolphin_and_fish';

export const getSubscriptionActive = async (): Promise<boolean> => {
    try {
        const value = await AsyncStorage.getItem(PREMIUM_SUBSCRIPTION_KEY);
        return value === 'true';
    } catch (error) {
        console.error('Error reading subscription status:', error);
        return false;
    }
};

export const setSubscriptionActive = async (active: boolean): Promise<void> => {
    try {
        await AsyncStorage.setItem(PREMIUM_SUBSCRIPTION_KEY, String(active));
    } catch (error) {
        console.error('Error saving subscription status:', error);
    }
};

export const getSelectedTheme = async (): Promise<ParentThemeId> => {
    try {
        const value = await AsyncStorage.getItem(PARENT_SELECTED_THEME_KEY);
        if (
            value === 'ant_and_grasshopper' ||
            value === 'tortoise_and_hare' ||
            value === 'dolphin_and_fish'
        ) {
            return value;
        }
        return 'ant_and_grasshopper';
    } catch (error) {
        console.error('Error reading selected theme:', error);
        return 'ant_and_grasshopper';
    }
};

export const setSelectedTheme = async (theme: ParentThemeId): Promise<void> => {
    try {
        await AsyncStorage.setItem(PARENT_SELECTED_THEME_KEY, theme);
    } catch (error) {
        console.error('Error saving selected theme:', error);
    }
};

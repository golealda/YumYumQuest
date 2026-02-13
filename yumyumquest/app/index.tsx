import { onAuthStateChanged, signOut } from 'firebase/auth';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { auth } from '../src/firebase';
import { getUserFlowStatus } from '../src/services/auth';
import { getAutoLoginEnabled } from '../src/services/sessionPreference';

export default function Page() {
    useEffect(() => {
        let mounted = true;

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (!mounted) return;

            try {
                if (!user) {
                    router.replace('/login');
                    return;
                }

                const autoLoginEnabled = await getAutoLoginEnabled();
                if (!autoLoginEnabled) {
                    await signOut(auth);
                    router.replace('/login');
                    return;
                }

                const flow = await getUserFlowStatus(user.uid);
                if (!flow.phoneVerified) {
                    router.replace('/phone-auth');
                    return;
                }

                if (!flow.onboardingCompleted) {
                    router.replace('/onboarding');
                    return;
                }

                router.replace('/(parent)');
            } catch (error) {
                console.error('Error resolving startup route:', error);
                router.replace('/login');
            }
        });

        return () => {
            mounted = false;
            unsubscribe();
        };
    }, []);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#FFA000" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFF8E1',
    },
});

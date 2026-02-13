import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, User } from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase"; // Adjust path if needed

export interface UserFlowStatus {
    phoneVerified: boolean;
    onboardingCompleted: boolean;
}

/**
 * Creates or updates the user profile in Firestore after authentication.
 * This ensures that we have a user document for every authenticated user.
 */
export async function upsertUserProfile(user: User) {
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        // Create new user document
        await setDoc(ref, {
            uid: user.uid,
            role: "PARENT", // Default role, can be changed later
            displayName: user.displayName ?? "",
            photoURL: user.photoURL ?? "",
            email: user.email ?? "",
            provider: user.providerData?.[0]?.providerId ?? "",
            phoneVerified: false,
            onboardingCompleted: false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
    } else {
        // Update existing user document
        await setDoc(
            ref,
            { updatedAt: serverTimestamp() },
            { merge: true }
        );
    }
}

/**
 * Sign up a new user with email, password, and display name.
 */
export async function signUp(email: string, pw: string, displayName: string) {
    const cred = await createUserWithEmailAndPassword(auth, email, pw);

    // Update the user's display name in Firebase Auth
    await updateProfile(cred.user, { displayName });

    // Pass the updated user object (or refresh it) to upsertUserProfile
    // Note: cred.user might not reflect the update immediately in some SDK versions without reload, 
    // but for Firestore purposes we can just pass the displayName manually if we wanted, 
    // but upsertUserProfile reads from user.displayName. 
    // Let's refactor upsertUserProfile generic slightly or just rely on the object property being updated locally by the SDK.
    // To be safe, let's manually pass the displayName to a modified upsert, OR just assume the SDK updates the object reference.
    // Safest: reload user or just trust the SDK updates the local object.
    // Actually, simplest is to update the doc with the name explicitly if needed.

    // Let's go with updating the auth profile first.
    await upsertUserProfile({ ...cred.user, displayName } as User);
    return cred.user;
}

/**
 * Sign in an existing user with email and password.
 */
export async function signIn(email: string, pw: string) {
    const cred = await signInWithEmailAndPassword(auth, email, pw);
    await upsertUserProfile(cred.user);
    return cred.user;
}

export async function getUserFlowStatus(uid: string): Promise<UserFlowStatus> {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    const data = userSnap.data();

    let phoneVerified = !!data?.phoneVerified;
    let onboardingCompleted = !!data?.onboardingCompleted;

    if (!onboardingCompleted) {
        const parentRef = doc(db, "parents", uid);
        const parentSnap = await getDoc(parentRef);
        if (parentSnap.exists()) {
            onboardingCompleted = true;
            phoneVerified = true;

            await setDoc(
                userRef,
                {
                    phoneVerified: true,
                    onboardingCompleted: true,
                    updatedAt: serverTimestamp(),
                },
                { merge: true }
            );
        }
    }

    return {
        phoneVerified,
        onboardingCompleted,
    };
}

export async function setPhoneVerified(uid: string): Promise<void> {
    const ref = doc(db, "users", uid);
    await setDoc(
        ref,
        {
            phoneVerified: true,
            phoneVerifiedAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        },
        { merge: true }
    );
}

export async function setOnboardingCompleted(uid: string): Promise<void> {
    const ref = doc(db, "users", uid);
    await setDoc(
        ref,
        {
            onboardingCompleted: true,
            onboardingCompletedAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        },
        { merge: true }
    );
}

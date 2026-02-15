import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Group, Parent } from '../types/firestore';

// Helper to generate random 6-character alphanumeric code
const generateInviteCode = (): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};

// Check if a group with this code already exists
const isCodeUnique = async (code: string): Promise<boolean> => {
    const docRef = doc(db, 'groups', code);
    const docSnap = await getDoc(docRef);
    return !docSnap.exists();
};

// Create a new Parent document
export const createParentProfile = async (
    uid: string,
    email: string,
    displayName: string,
    photoUrl?: string
): Promise<void> => {
    const parentRef = doc(db, 'parents', uid);

    const parentData: Parent = {
        uid,
        email,
        displayName,
        groupId: null, // Will be updated after group creation
        isPremium: false,
        createdAt: new Date(), // This might need to be serverTimestamp() but keeping it Date for TS compatibility for now
    };

    if (photoUrl) {
        parentData.photoUrl = photoUrl;
    }

    await setDoc(parentRef, parentData);
};

// Create a new Group document with a unique invite code
export const createFamilyGroup = async (ownerUid: string): Promise<string> => {
    let inviteCode = generateInviteCode();
    let unique = await isCodeUnique(inviteCode);

    // Keep generating if not unique (unlikely but possible)
    while (!unique) {
        inviteCode = generateInviteCode();
        unique = await isCodeUnique(inviteCode);
    }

    const groupRef = doc(db, 'groups', inviteCode);

    const groupData: Group = {
        inviteCode,
        ownerId: ownerUid,
        children: [],
        settings: {
            selectedTheme: 'ant_and_grasshopper', // Default theme
            allowAutoApproval: false,
        },
        createdAt: new Date(),
    };

    await setDoc(groupRef, groupData);

    // Update parent with groupId
    const parentRef = doc(db, 'parents', ownerUid);
    await setDoc(parentRef, { groupId: inviteCode }, { merge: true });

    return inviteCode;
};

// Return existing family code for this parent, or create one if missing.
export const getOrCreateFamilyCode = async (ownerUid: string): Promise<string> => {
    const parentRef = doc(db, 'parents', ownerUid);
    const parentSnap = await getDoc(parentRef);
    const parentData = parentSnap.exists() ? (parentSnap.data() as Partial<Parent>) : null;
    const existingCode = parentData?.groupId;

    if (existingCode) {
        const groupRef = doc(db, 'groups', existingCode);
        const groupSnap = await getDoc(groupRef);
        if (groupSnap.exists()) {
            return existingCode;
        }
    }

    return createFamilyGroup(ownerUid);
};

// Initialize Parent Vault (optional, usually done on first purchase or lazily created)
// Implementing for completeness if needed later
export const initializeParentVault = async (parentId: string): Promise<void> => {
    // This might just be a collection reference usage, not necessarily creating a document upfront.
    // If we want a subcollection or separate collection, it depends. Users requested 'parent_vault' collection.
    // We don't need to do anything here right now as documents are created per item.
};

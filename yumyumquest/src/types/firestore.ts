export interface Parent {
    uid: string;
    email: string;
    displayName: string;
    groupId: string | null;
    isPremium: boolean;
    createdAt: Date;
    photoUrl?: string; // Optional field for profile picture
}

export interface Group {
    inviteCode: string; // Document ID
    ownerId: string;
    children: string[]; // Array of child UIDs
    settings: {
        selectedTheme: string;
        allowAutoApproval: boolean;
    };
    createdAt: Date;
}

export interface ParentVaultItem {
    vaultId: string; // Document ID
    parentId: string;
    targetChildId: string | null; // Can be null if not assigned yet
    gifticonData: {
        name: string;
        imageUrl: string;
        barcodeUrl: string;
        status: 'pending' | 'delivered';
        expiryDate?: Date; // Optional expiration date
    };
    createdAt: Date;
}

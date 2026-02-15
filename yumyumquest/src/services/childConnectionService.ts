import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db } from '../firebase';
import {
    Timestamp,
    arrayUnion,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    updateDoc,
    where,
} from 'firebase/firestore';

const ACTIVE_REQUEST_ID_KEY = 'active_child_link_request_id';

export type LinkRequestStatus = 'pending' | 'approved' | 'rejected';

export interface ChildLinkRequest {
    id: string;
    familyCode: string;
    childNickname: string;
    childAvatar: string;
    childAge?: number;
    status: LinkRequestStatus;
    rejectionReason?: string;
    parentUid?: string;
    childId?: string;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

export interface ParentApprovalPayload {
    confirmedNickname: string;
    confirmedAge: number;
    serviceTermsAgreed: boolean;
    privacyAgreed: boolean;
    pushAgreed: boolean;
    rewardEnabled: boolean;
    baseCoinReward: number;
    approvalMode: 'manual' | 'auto';
    recoveryEmail?: string;
    usageStartTime: string;
    usageEndTime: string;
    dailyMaxCompletion: number;
}

const generateRequestId = (): string => `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
const generateChildId = (): string => `child_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const createChildLinkRequest = async (params: {
    familyCode: string;
    childNickname: string;
    childAvatar: string;
    childAge?: number;
}): Promise<ChildLinkRequest> => {
    const normalizedCode = params.familyCode.trim().toUpperCase();
    const groupRef = doc(db, 'groups', normalizedCode);
    const groupSnap = await getDoc(groupRef);
    if (!groupSnap.exists()) {
        throw new Error('invalid-family-code');
    }

    const requestId = generateRequestId();
    const requestRef = doc(db, 'child_link_requests', requestId);

    await setDoc(requestRef, {
        familyCode: normalizedCode,
        childNickname: params.childNickname.trim(),
        childAvatar: params.childAvatar,
        childAge: params.childAge ?? null,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    await AsyncStorage.setItem(ACTIVE_REQUEST_ID_KEY, requestId);

    return {
        id: requestId,
        familyCode: normalizedCode,
        childNickname: params.childNickname.trim(),
        childAvatar: params.childAvatar,
        childAge: params.childAge,
        status: 'pending',
    };
};

export const getActiveChildLinkRequestId = async (): Promise<string | null> => {
    return AsyncStorage.getItem(ACTIVE_REQUEST_ID_KEY);
};

export const clearActiveChildLinkRequestId = async (): Promise<void> => {
    await AsyncStorage.removeItem(ACTIVE_REQUEST_ID_KEY);
};

export const getChildLinkRequestById = async (requestId: string): Promise<ChildLinkRequest | null> => {
    const ref = doc(db, 'child_link_requests', requestId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data();
    return {
        id: snap.id,
        familyCode: data.familyCode,
        childNickname: data.childNickname,
        childAvatar: data.childAvatar,
        childAge: data.childAge ?? undefined,
        status: data.status,
        rejectionReason: data.rejectionReason ?? undefined,
        parentUid: data.parentUid ?? undefined,
        childId: data.childId ?? undefined,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
    };
};

export const getPendingChildLinkRequestsForCurrentParent = async (): Promise<ChildLinkRequest[]> => {
    const user = auth.currentUser;
    if (!user) return [];

    const parentSnap = await getDoc(doc(db, 'parents', user.uid));
    if (!parentSnap.exists()) return [];
    const familyCode = parentSnap.data().groupId as string | null;
    if (!familyCode) return [];

    const q = query(collection(db, 'child_link_requests'), where('familyCode', '==', familyCode));
    const requestSnaps = await getDocs(q);

    const requests = requestSnaps.docs.map((snap) => {
        const data = snap.data();
        return {
            id: snap.id,
            familyCode: data.familyCode,
            childNickname: data.childNickname,
            childAvatar: data.childAvatar,
            childAge: data.childAge ?? undefined,
            status: data.status as LinkRequestStatus,
            rejectionReason: data.rejectionReason ?? undefined,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
        } as ChildLinkRequest;
    });

    return requests
        .filter((item) => item.status === 'pending')
        .sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
};

export const approveChildLinkRequest = async (
    requestId: string,
    payload: ParentApprovalPayload
): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error('not-authenticated');

    const requestRef = doc(db, 'child_link_requests', requestId);
    const requestSnap = await getDoc(requestRef);
    if (!requestSnap.exists()) throw new Error('request-not-found');

    const requestData = requestSnap.data();
    if (requestData.status !== 'pending') throw new Error('request-not-pending');

    const familyCode = requestData.familyCode as string;
    const childId = generateChildId();
    const childRef = doc(db, 'children', childId);

    await setDoc(childRef, {
        childId,
        familyCode,
        nickname: payload.confirmedNickname,
        avatar: requestData.childAvatar,
        age: payload.confirmedAge,
        parentUid: user.uid,
        approvalSettings: {
            rewardEnabled: payload.rewardEnabled,
            baseCoinReward: payload.baseCoinReward,
            approvalMode: payload.approvalMode,
            usageStartTime: payload.usageStartTime,
            usageEndTime: payload.usageEndTime,
            dailyMaxCompletion: payload.dailyMaxCompletion,
            pushAgreed: payload.pushAgreed,
            recoveryEmail: payload.recoveryEmail ?? '',
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    await updateDoc(doc(db, 'groups', familyCode), {
        children: arrayUnion(childId),
        updatedAt: serverTimestamp(),
    });

    await updateDoc(requestRef, {
        status: 'approved',
        parentUid: user.uid,
        childId,
        parentApproval: {
            ...payload,
            approvedAt: serverTimestamp(),
        },
        updatedAt: serverTimestamp(),
    });
};

export const rejectChildLinkRequest = async (requestId: string, rejectionReason: string): Promise<void> => {
    const user = auth.currentUser;
    if (!user) throw new Error('not-authenticated');

    await updateDoc(doc(db, 'child_link_requests', requestId), {
        status: 'rejected',
        parentUid: user.uid,
        rejectionReason: rejectionReason.trim() || '보호자가 요청을 거절했어요.',
        updatedAt: serverTimestamp(),
    });
};

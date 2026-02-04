import {
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'applications';

export function getUserApplications(userId, callback) {
    const q = query(
        collection(db, COLLECTION_NAME),
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        callback(data);
    });
}

export async function addApplication(userId, applicationData) {
    return addDoc(collection(db, COLLECTION_NAME), {
        ...applicationData,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    });
}

export async function updateApplication(appId, updates) {
    const appRef = doc(db, COLLECTION_NAME, appId);
    return updateDoc(appRef, {
        ...updates,
        updatedAt: serverTimestamp()
    });
}

export async function deleteApplication(appId) {
    return deleteDoc(doc(db, COLLECTION_NAME, appId));
}

import {
    collection,
    doc,
    setDoc,
    getDoc,
    getDocs,
    query,
    where,
    serverTimestamp,
    orderBy
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'dailyProgress';

// Helper to get consistent date string YYYY-MM-DD (Local Time)
export function getDateString(dateObj = new Date()) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export async function getDailyProgress(userId, date) {
    const docId = `${userId}_${date}`;
    const docRef = doc(db, COLLECTION_NAME, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        return null;
    }
}

export async function updateDailyProgress(userId, date, data) {
    const docId = `${userId}_${date}`;
    const docRef = doc(db, COLLECTION_NAME, docId);

    // Calculate score based on booleans
    let score = 0;
    if (data.aptitude) score++;
    if (data.coding) score++;
    if (data.communication) score++;

    const payload = {
        userId,
        date,
        ...data,
        score,
        updatedAt: serverTimestamp()
    };

    // Use setDoc with merge: true to create or update
    // We add createdAt only if it's a new document largely handled by setDoc merging, 
    // but here we just update everything. To be safe/clean we can just set it.
    // simpler: just set.
    return setDoc(docRef, payload, { merge: true });
}

export async function getMonthProgress(userId, year, month) {
    // Month is 0-indexed in JS Date, but let's expect 1-indexed or handle carefully.
    // Actually, simplest is to query by string comparison on 'date' field if format is YYYY-MM-DD.
    // e.g. start: "2024-02-01", end: "2024-02-31"

    // Ensure month is 2 digits
    const monthStr = month.toString().padStart(2, '0');
    const startDate = `${year}-${monthStr}-01`;
    // cheat for end date: just go to next month/year? 
    // Or just query "date" >= startDate and "date" <= "${year}-${monthStr}-31" works mostly for string sort.

    const q = query(
        collection(db, COLLECTION_NAME),
        where("userId", "==", userId),
        where("date", ">=", startDate),
        where("date", "<=", `${year}-${monthStr}-31`), // simplistic, covers all days
        orderBy("date", "asc")
    );

    const querySnapshot = await getDocs(q);
    const progressMap = {};
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        progressMap[data.date] = data;
    });
    return progressMap;
}

// Get all progress for heatmap (maybe limit to last year)
export async function getAllProgress(userId) {
    // Removed orderBy to avoid missing index errors. We can sort in JS.
    const q = query(
        collection(db, COLLECTION_NAME),
        where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const data = [];
    querySnapshot.forEach((doc) => {
        data.push(doc.data());
    });
    // Sort by date ascending
    data.sort((a, b) => a.date.localeCompare(b.date));
    return data;
}

import admin from "firebase-admin";
import {env} from "./secrets";

export const connectFirebase = async () => {
    if (admin.apps.length === 0) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: env.FIREBASE_PROJECT_ID,
                privateKey: env.FIREBASE_PRIVATE_KEY,
                clientEmail: env.FIREBASE_CLIENT_EMAIL,
            }),
            storageBucket: env.FIREBASE_STORAGE_BUCKET
        });
        console.log("✅ Firebase initialized");
    }
}

export const getBucket = () => admin.storage().bucket();
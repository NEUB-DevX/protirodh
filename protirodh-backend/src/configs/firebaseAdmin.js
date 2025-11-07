import admin from 'firebase-admin';
import dotenv from 'dotenv';
dotenv.config();

// Initialize firebase admin with service account
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
        })
    });
}

export const updateUserPassword = async (uid, newPassword) => {
    try {
        await admin.auth().updateUser(uid, {
            password: newPassword
        });
        return true;
    } catch (error) {
        console.error('Firebase Update Password Error:', error);
        throw error;
    }
};

export default admin; 
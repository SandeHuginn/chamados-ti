const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');

const app = initializeApp({
    credential: applicationDefault(),
    projectId: process.env.FIREBASE_PROJECT_ID,
});

const adminAuth = getAuth(app);
const adminDb = getFirestore(app);

module.exports = {
    adminAuth,
    adminDb,
};

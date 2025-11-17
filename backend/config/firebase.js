const admin = require("firebase-admin");

let firebaseApp = null;
let firestore = null;

function initFirebase() {
  if (firebaseApp) return firestore;

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    console.warn("⚠️  Firebase env vars missing. Firestore & Auth features limited.");
    return null;
  }

  privateKey = privateKey.replace(/\\n/g, "\n");

  try {
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    firestore = admin.firestore();
    console.log("✅ Firebase initialized");
    return firestore;
  } catch (err) {
    console.error("❌ Firebase init error:", err.message);
    return null;
  }
}

async function logScanToFirestore(data) {
  const db = initFirebase();
  if (!db) return;

  try {
    await db.collection("product_scans").add({
      ...data,
      loggedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error("Firestore log error:", err.message);
  }
}

async function getRecentScans(limit = 10) {
  const db = initFirebase();
  if (!db) return [];
  try {
    const snap = await db
      .collection("product_scans")
      .orderBy("loggedAt", "desc")
      .limit(limit)
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error("Firestore read error:", err.message);
    return [];
  }
}

async function verifyUserToken(idToken) {
  if (!idToken) return null;
  const dbApp = initFirebase();
  if (!dbApp) return null;

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    return decoded;
  } catch (err) {
    console.error("verifyUserToken error:", err.message);
    return null;
  }
}

module.exports = { initFirebase, logScanToFirestore, getRecentScans, verifyUserToken };

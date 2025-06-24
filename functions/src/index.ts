import * as admin from 'firebase-admin';
const serviceAccount = require('./serviceAccountKey.json'); // Adjust path as needed

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export * from './normalize-stats';
export * from './notify-email';

import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin (only once)
if (!(admin as any).apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT 
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    : {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      };

  (admin as any).initializeApp({
    credential: (admin as any).credential.cert(serviceAccount),
  });
}

const db = (admin as any).firestore();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, comment } = req.body;

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json({ error: 'Comment is required' });
    }

    if (comment.length > 500) {
      return res.status(400).json({ error: 'Comment too long (max 500 characters)' });
    }

    const feedbackData = {
      username: username?.trim() || 'Anonymous',
      comment: comment.trim(),
      timestamp: (admin as any).firestore.FieldValue.serverTimestamp(),
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection('feedback').add(feedbackData);

    return res.status(201).json({ 
      success: true, 
      id: docRef.id,
      message: 'Feedback submitted successfully!' 
    });
  } catch (error: any) {
    console.error('Error submitting feedback:', error);
    return res.status(500).json({ error: 'Failed to submit feedback', message: error.message });
  }
}

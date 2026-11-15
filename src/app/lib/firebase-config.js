'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBCBVR7PKP5QOxAeLLsGIQlB9YjP7fGlko",
  authDomain: "promptbiotics.firebaseapp.com",
  projectId: "promptbiotics",
  storageBucket: "promptbiotics.firebasestorage.app",
  messagingSenderId: "28935945719",
  appId: "1:28935945719:web:f3204342db6b20516dc2f2"
};

// Singleton pattern to prevent "Firebase App already initialized" error during hot reloads
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
